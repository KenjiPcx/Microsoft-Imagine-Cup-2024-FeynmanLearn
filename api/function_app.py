import json
import os
import uuid
import logging
import time

import azure.functions as func
from azure.storage.blob import BlobServiceClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from langchain_openai import ChatOpenAI
from langchain.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
import openai

from langchain.agents.openai_assistant import OpenAIAssistantRunnable
from langchain_openai import ChatOpenAI
from langchain_community.utilities.dalle_image_generator import DallEAPIWrapper

from agents.feynman_student_prompt_v6 import (
    feynman_student_prompt_template,
    feynman_student_prompt_parser,
)
from agents.lesson_verification_prompt import (
    verify_lesson_prompt_template,
    verify_lesson_parser,
)
from agents.post_session_analysis_prompts import (
    analyze_transcripts_prompt_template,
    analyze_transcripts_parser,
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
azure_blob_key = os.getenv("AZURE_BLOB_KEY")
openai_client = openai.OpenAI(api_key=openai_key)
langchain_llm = ChatOpenAI(api_key=openai_key, model="gpt-4-turbo-preview")
database_handler = DatabaseHandler()
blob_service_client = BlobServiceClient.from_connection_string(azure_blob_key)

@app.route(route="create_session")
def create_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("create_session HTTP trigger function processed a request.")

    try:
        # Extract the request body
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        lesson_concept = req_body.get("lesson_concept")
        lesson_objectives = req_body.get("lesson_objectives")
        game_mode = req_body.get("game_mode")
        difficulty = req_body.get("difficulty")
        student_persona = req_body.get("student_persona")

        if game_mode == "Explain to a kid":
            student_persona = (
                "5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old. Additionally, "
                + student_persona
            )

        if student_persona == "":
            student_persona = "None"

        feynman_student_instructions_prompt = feynman_student_prompt_template.format(
            concept=lesson_concept,
            objectives=lesson_objectives,
            game_mode=game_mode,
            # difficulty=difficulty,
            student_persona=student_persona,
        )

        # Send the first message to create a thread
        assistant = OpenAIAssistantRunnable(
            assistant_id=feynman_assistant_id, as_agent=True
        )

        start_msg = f"Tell me you're excited to learn about {lesson_concept} in a very brief way, and I'll proceed to teach"
        output = assistant.invoke(
            {
                "instructions": feynman_student_instructions_prompt,
                "content": start_msg,
            }
        )
        assistant_output = output.return_values["output"]
        assistant_output = feynman_student_prompt_parser.parse(assistant_output)
        thread_id = output.return_values["thread_id"]

        # Create the session data and store it in the database
        session_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "lesson_concept": lesson_concept,
            "lesson_objectives": lesson_objectives,
            "game_mode": game_mode,
            "difficulty": difficulty,
            "student_persona": student_persona,
            "prompt": feynman_student_instructions_prompt,
            "session_transcripts": [
                {
                    "user": start_msg,
                    "assistant": assistant_output,
                }
            ],
            "objectives_satisfied": False,
            "thread_id": thread_id,
        }
        database_handler.sessions_container.create_item(body=session_data)

        # Build the response
        res = {
            "session_id": session_data["id"],
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
        assistant_res = feynman_student_prompt_parser.parse(assistant_res)

        # Update session data
        session_data["session_transcripts"].append(
            {"user": message, "assistant": assistant_res}
        )
        # Add objective satisfied it doesnt exist
        if assistant_res["objectives_satisfied"]:
            session_data["concept_understood"] = True
        database_handler.sessions_container.upsert_item(body=session_data)

        # Build the response
        res = {
            "message": assistant_res["message"],
            "emotion": assistant_res["emotion"],
            "internal_thoughts": assistant_res["internal_thoughts"],
            "question": assistant_res["question"],
            "concept_understood": assistant_res["objectives_satisfied"],
            "success": True,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response

@app.route(route="analyze_session")
def analyze_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_session HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        session_id = req_body.get("session_id")
        termination_reason = req_body.get("termination_reason")
        session_duration = req_body.get("session_duration")

        # Fetch the session data and process analysis
        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )

        transcripts = session_data.get("session_transcripts")

        if len(transcripts) == 0:
            return func.HttpResponse(
                "Session does not contain any transcripts", status_code=404
            )

        # Process the transcripts
        formatted_transcript = ""
        confused_sections, happy_sections = 0, 0
        for transcript in transcripts:
            user_msg = transcript.get("user")
            assistant_res = transcript.get("assistant")
            assistant_msg = assistant_res.get("message")
            assistant_emotion = assistant_res.get("emotion")

            # Group happy and confused sections
            if assistant_emotion == "confused":
                confused_sections += 1
            elif assistant_emotion == "happy":
                happy_sections += 1

            # Add transcript to formatted_transcript
            formatted_transcript += f"User: {user_msg}\nStudent: {assistant_msg} (emotion={assistant_emotion})\n"

        # Calculate the overall score
        overall_score = int((happy_sections / len(transcripts)) * 100)

        # Call the LLM to generate the post session analysis
        chain = (
            analyze_transcripts_prompt_template
            | langchain_llm
            | analyze_transcripts_parser
        )
        output = chain.invoke(
            {
                "concept": session_data["lesson_concept"],
                "objectives": session_data["lesson_objectives"],
                "student_persona": session_data["student_persona"],
                "transcripts": formatted_transcript,
            }
        )

        post_session_analysis = {
            "overall_score": overall_score,
            "session_passed": overall_score >= 0.5,
            "assessment_summary": output.general_assessment_summary,
            "general_assessment": output.general_assessment,
            "knowledge_gaps": output.knowledge_gaps,
            "constructive_feedback": output.constructive_feedback,
            "easier_topics": output.easier_topics,
            "similar_topics": output.similar_topics,
            "objective_reached": output.objective_reached,
        }

        # Save post session analysis to the session data
        session_data["post_session_analysis"] = post_session_analysis
        session_data["image_prompt"] = output.image_prompt
        session_data["termination_reason"] = termination_reason
        seconds = session_duration // 1000
        minutes = seconds // 60
        remaining_seconds = seconds % 60
        session_duration = f"{minutes}m {remaining_seconds}s"
        session_data["session_duration"] = session_duration
        session_data["last_date_attempt"] = time.time()

        database_handler.sessions_container.replace_item(
            item=session_id, body=session_data
        )

        # Generate the image over here and save it to the session data
        image_url = DallEAPIWrapper().run(output.image_prompt)
        session_data["image_url"] = image_url

        database_handler.sessions_container.replace_item(
            item=session_id, body=session_data
        )

        res = {"success": True}
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


@app.route(route="get_post_session_analysis")
def get_post_session_analysis(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("get_post_session_analysis HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        session_id = req_body.get("session_id")
        user_id = req_body.get("user_id")

        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )
        res = {
            "success": True,
            "session_metadata": {
                "lesson_concept": session_data["lesson_concept"],
                "lesson_objectives": session_data["lesson_objectives"],
                "game_mode": session_data["game_mode"],
                "student_persona": session_data["student_persona"],
                "last_date_attempt": session_data["last_date_attempt"],
                "session_duration": session_data["session_duration"],
                "termination_reason": session_data["termination_reason"],
            },
            "post_session_analysis": session_data["post_session_analysis"],
            "annotated_transcripts": session_data["session_transcripts"],
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response
