import json
import os
import uuid
import logging
import time

import azure.functions as func
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from langchain_openai import ChatOpenAI
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
import openai

import constants
from langchain.agents.openai_assistant import OpenAIAssistantRunnable
from langchain_openai import ChatOpenAI
from agents.feynman_student_prompt import (
    feynman_student_prompt,
    feynman_student_prompt_template,
)
from agents.lesson_verification_prompt import (
    verify_lesson_prompt,
    verify_lesson_prompt_template,
    verify_lesson_parser,
)
from agents.assistant_ids import feynman_assistant_id
from error_responses import (
    cosmos_404_error_response,
    generic_server_error_response,
    value_error_response,
)
from databaseHandler import DatabaseHandler

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

openai_key = os.getenv("OPENAI_API_KEY")
openai_client = openai.OpenAI(api_key=openai_key)
langchain_llm = ChatOpenAI(api_key=openai_key, model="gpt-4-turbo-preview")
database_handler = DatabaseHandler()


@app.route(route="create_session")
def create_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("create_session HTTP trigger function processed a request.")

    try:
        # Extract the request body
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        concept = req_body.get("concept")
        game_mode = req_body.get("game_mode")
        depth = req_body.get("depth")

        # Hard code for now
        concept = "Diffusion Models in AI"
        student_persona = req_body.get("student_persona")
        game_mode = "Explain to a 5 year old - you will act as a 5 year old student, user needs to explain using very simple language and examples, otherwise you don't understand"
        depth = "beginner - just ask really basic information"
        student_persona = "None"
        session_plan = "To test the user on their knowledge on diffusion models, 1) verify if they know what it is, what it does, how it does it and where is it used"

        instructions_prompt = feynman_student_prompt_template.format(
            concept=concept,
            game_mode=game_mode,
            depth=depth,
            student_persona=student_persona,
            session_plan=session_plan,
        )

        # Send the first message to create a thread
        assistant = OpenAIAssistantRunnable(
            assistant_id=feynman_assistant_id, as_agent=True
        )
        start_msg = "Hey there, before we start, can you please briefly introduce yourself and what we will learn today?"
        output = assistant.invoke(
            {
                "instructions": instructions_prompt,
                "content": start_msg,
            }
        )
        assistant_intro_msg = output.return_values["output"]
        assistant_intro_msg = json.loads(assistant_intro_msg)
        thread_id = output.return_values["thread_id"]

        # Create the session data and store it in the database
        session_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "concept": concept,
            "game_mode": game_mode,
            "depth": depth,
            "student_persona": student_persona,
            "session_plan": session_plan,
            "prompt": feynman_student_prompt,
            "transcripts": [
                {
                    "user": start_msg,
                    "assistant": assistant_intro_msg,
                }
            ],
            "thread_id": thread_id,
        }
        database_handler.sessions_container.create_item(body=session_data)

        # Build the response
        res = {
            "session_id": session_data["id"],
            "concept": session_data["concept"],
            "game_mode": session_data["game_mode"],
            "depth": session_data["depth"],
            "student_persona": session_data["student_persona"],
            "intro_msg": assistant_intro_msg,
            "success": True,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="send_message")
def send_message(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("send_message HTTP trigger function processed a request.")

    try:
        # Extract the request body
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        session_id = req_body.get("session_id")
        message = req_body.get("message")

        # Get the session data from the database
        session_data = database_handler.sessions_container.read_item(
            session_id, partition_key=user_id
        )
        thread_id = session_data.get("thread_id")

        # Get student agent response
        assistant = OpenAIAssistantRunnable(
            assistant_id=feynman_assistant_id, as_agent=True
        )
        output = assistant.invoke({"content": message, "thread_id": thread_id})
        assistant_res = output.return_values["output"]
        assistant_res = json.loads(assistant_res)

        # Update session data
        session_data["transcripts"].append(
            {"user": message, "assistant": assistant_res}
        )
        database_handler.sessions_container.upsert_item(body=session_data)

        # Build the response
        res = {
            "message": assistant_res["message"],
            "emotion": assistant_res["emotion"],
            "internal_thoughts": assistant_res["internal_thoughts"],
            "success": True,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response

@app.route(route="analyze_question_response")
def analyze_question_response(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_question_response HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        session_id = req_body.get("session_id")
        user_id = req_body.get("user_id")

        # Fetch the session data and process transcripts
        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )

        # TODO: Obtain transcript by question
        # TODO: Construct response schema and format instructions to use in prompt
        # TODO: Create prompt and run analysis on prompt

        session_data["last_date_attempt"] = time.time()
        session_data["image_url"] = ""
        database_handler.sessions_container.upsert_item(body=session_data)

        # Build the response
        res = {"success": True}
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response

@app.route(route="analyze_session")
def analyze_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_session HTTP trigger function processed a request.")

    # get all of the stored data out of the db
    # generate some nice dashboard of the session
    # - Show gaps in explanation
    # - Provide suggestions on explaining and teaching
    # - Suggestion on similar topics that can contribute to this point
    # - Identifies misconceptions
    # - Gives useful additional nuggets of knowledge (did you know?)
    # - Set a timer on a session to explain again, can quiz through the user in a conversational manner?
    # - Set last date of attempt
    # - Set a reminder to explain again
    # - Generate a nice image using DALL-E API
    # - Generate a nice summary of the session

    # # Some dall e code from ventus
    # dalle_api_wrapper = DallEAPIWrapper()

    # # # loop through sessions and generate image based on each sessions
    # for session in sessions:
    #     student_persona = session.get("student_persona", "")
    #     concept = session.get("concept","")

    #     # Create a prompt for the current session
    #     dall_e_prompt = f"Can you create an image to illustrate a student having the following persona: {student_persona}, while learning: {concept}"

    #     # Add the generated image information to the current session dictionary
    #     session["image_url"] = dalle_api_wrapper.run(dall_e_prompt)

    try:
        req_body = req.get_json()
        session_id = req_body.get("session_id")
        user_id = req_body.get("user_id")

        # Fetch the session data and process transcripts
        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )
        session_data["last_date_attempt"] = time.time()
        session_data["image_url"] = ""
        database_handler.sessions_container.upsert_item(body=session_data)

        # Build the response
        res = {"success": True}
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="get_user_data")
def get_user_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_session HTTP trigger function processed a request.")

    # fetch basic user app info
    # fetch user sessions history in a list

    try:
        req_body = req.get_json()
        user_id = req_body.get("user_id")

        user_data = database_handler.users_container.read_item(
            item=user_id, partition_key=user_id
        )

        res = {"success": True, "user_data": user_data}
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="get_session_data")
def get_session_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("get_session_data HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        session_id = req_body.get("session_id")
        user_id = req_body.get("user_id")

        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )

        res = {"success": True, "session_data": session_data}
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="get_session_summaries")
def get_session_summaries(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("get_session_data HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        # user_id = "02" #For ventus testing purposes

        # Fetch sessions for the given user_id
        sessions = database_handler.fetch_session_summaries_by_user(user_id)

        # Build the response
        res = {
            "sessions": sessions,
            "sessions_count": len(sessions),
            "success": True,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="verify_lesson_scope")
def verify_lesson_scope(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("verify_lesson_scope HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        concept = req_body.get("lesson_concept")
        objectives = req_body.get("lesson_objectives")

        chain = verify_lesson_prompt_template | langchain_llm | verify_lesson_parser
        llm_res = chain.invoke({"concept": concept, "objectives": objectives})

        # Build the response
        res = {
            "passed_verification": llm_res.feasible,
            "feedback": llm_res.feedback,
            "suggestion": llm_res.suggestion, 
            "success": True,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except Exception:
        return generic_server_error_response
