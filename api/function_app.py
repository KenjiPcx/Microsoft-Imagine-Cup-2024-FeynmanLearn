from functools import reduce
import json
import os
import uuid
import logging
import time
import helper 

import azure.functions as func
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from langchain_openai import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
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
        lesson_concept = req_body.get("lesson_concept")
        lesson_objectives = req_body.get("lesson_objectives")
        game_mode = req_body.get("game_mode")
        difficulty = req_body.get("difficulty")
        student_persona = req_body.get("student_persona")

        # Hard code for now
        lesson_concept = "Diffusion Models in AI"
        lesson_objectives = "Understand the basic principles of diffusion models and be able to apply them to solve simple problems."
        student_persona = "None"
        game_mode = "Explain to a 5 year old - you will act as a 5 year old student, user needs to explain using very simple language and examples, otherwise you don't understand"
        difficulty = "beginner - just ask really basic information"
        student_persona = "None"

        instructions_prompt = feynman_student_prompt_template.format(
            concept=lesson_concept,
            objectives=lesson_objectives,
            game_mode=game_mode,
            difficulty=difficulty,
            student_persona=student_persona,
        )

        # Send the first message to create a thread
        assistant = OpenAIAssistantRunnable(
            assistant_id=feynman_assistant_id, as_agent=True
        )
        start_msg = "Before we start, can you please ask me what we will be learning today in a fun and concise way?"
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
            "lesson_concept": lesson_concept,
            "lesson_objectives": lesson_objectives,
            "game_mode": game_mode,
            "difficulty": difficulty,
            "student_persona": student_persona,
            "prompt": feynman_student_prompt,
            "session_transcripts": [
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
        user_id = req_body.get("user_id")
        question_id = req_body.get("question_id")
        session_id = req_body.get("session_id")

        # Fetch the session data and process transcripts
        transcript = database_handler.get_transcript_by_question(user_id, question_id, session_id)
        if len(transcript) < 1:
            return func.HttpResponse("Cannot find transcript by question_id", status_code=401)

        # Obtain transcript by question
        question_transcript = transcript[0]["session_transcript"]["question_transcript"]
        audience_level = transcript[0]["student_persona"]
        session_document_id = transcript[0]["id"]
        
        # Terminate if analysis is already generated for this question
        session_data = database_handler.sessions_container.read_item(
            item=session_document_id, partition_key=user_id
        )
        session_analysis = session_data.get('session_analysis', [])
        check_if_analysis_exist = list(filter(lambda _: _['question_id'] == question_id, session_analysis))
        if len(check_if_analysis_exist) != 0:
            return func.HttpResponse('Analysis already exist!', status_code=409)

        # Construct response schema and format instructions to use in prompt
        response_schemas = constants.QUESTION_RESPONSE_SCHEMARESPONSE_SCHEMA
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()

        # Create prompt and run analysis on prompt
        template = "You are a helpful assistant that takes a transcript and scores the user's explanation to a learner and provides a detailed explanation for the score using the evidence available. You will score using this rubric: {rubric} and you can use the learner's response to support your case but remember that you are scoring the user's explanations. \n{format_instructions}\n{question}. Your response is directed towards the user, so do address them as from a second person perspective, that is, phrasing your feedback with 'You/ Your explanation/ You did well'. Use evidence and quotation in your explanation where possible.  Also, try to be encouraging, and make sure to score in whole numbers between 1 and 5 inclusive. The audience level you will evaluate for is '{audience_level}'."
        prompt = PromptTemplate(
            template=template,
            input_variables=["question", "rubric"],
            partial_variables={"format_instructions": format_instructions}
        )
        _input = prompt.format_prompt(
            question=question_transcript, rubric=constants.MARKING_RUBRIC, audience_level=audience_level
        )

        # Build response
        output = langchain_llm(_input.to_messages())
        question_transcript_analysis = output_parser.parse(output.content)
        question_transcript_analysis["question"] = transcript[0]["session_transcript"]["question"]
        question_transcript_analysis["question_id"] = transcript[0]["session_transcript"]["question_id"]
        res = {"success": True, "analysis": question_transcript_analysis}
        logging.info(question_transcript_analysis)

        # Update session data 
        session_analysis.append(question_transcript_analysis)
        session_data['session_analysis'] = session_analysis
        database_handler.sessions_container.replace_item(
            item=session_id, body=session_data
        )
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
        user_id = req_body.get("user_id")
        session_id = req_body.get("session_id")

        # Fetch the session data and process analysis
        session_data = database_handler.get_analysis_by_session(user_id, session_id)

        if len(session_data) != 1:
            return func.HttpResponse('Failed to get session data', status_code=401)

        session_analysis = session_data[0].get('session_analysis', [])
        post_session_analysis = session_data[0].get('post_session_analysis', {})
        session_document_id = session_data[0]["id"]

        # Error handling
        if len(session_analysis) == 0:
            return func.HttpResponse('Session does not contain any analysis', status_code=401)
        if post_session_analysis != {}:
            return func.HttpResponse('Post session analysis already exist', status_code=401)

        # Aggregate scores across all questions
        scores = helper.get_overall_and_average_score_for_session(session_analysis)
        logging.info(scores)

        if scores['overall_score'] < 2.5:
            # TODO: suggest easier topics since student has failed the feynman session
            pass

        # Structure output schema
        output_parser = StructuredOutputParser.from_response_schemas(constants.POST_SESSION_ANALYSIS_SCHEMA)
        format_instructions = output_parser.get_format_instructions()

        # Create prompt and run analysis on prompt
        template = "Using this instruction {format_instructions}, aggregate the feedback for this session using the analysis on different questions, use an encouraging tone and address using a second person perspective. Aggreagted scores across all questions in this session is: {aggregated_score}. Structure your feedback using the following in the following order: overall_comment, strengths, room_for_improvement, suggestions_for_improvement. \n Session data: {session}"
        prompt = PromptTemplate(
            template=template,
            input_variables=["session", "aggregated_score", "format_instructions"],
        )
        _input = prompt.format_prompt(
            session=session_analysis, rubric=constants.MARKING_RUBRIC, aggregated_score=scores, format_instructions=format_instructions
        )

        # Build response
        output = langchain_llm(_input.to_messages())
        qualitative_analysis = output_parser.parse(output.content)
        logging.info(qualitative_analysis)

        # Construct content dictionary to find similar topic suggestions
        content = {
            'concept': session_data[0].get('concept', []),
            'question': [ question_obj['question'] for question_obj in session_analysis  ]
        }

        # Create similar topic suggestions
        prompt = ChatPromptTemplate.from_template("Suggest 5 similar topics for a student to learn about, based on the learning session below. Return just the topics as a list of strings, nothing extra. \n Questions and concept explored in current learning session: \n {content}")
        model = ChatOpenAI(model="gpt-4", api_key='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')
        output_parser = StrOutputParser()
        chain = prompt | model | output_parser
        topics_str = chain.invoke({"content": content})
        similar_topics_list = json.loads(topics_str)
        logging.info(similar_topics_list)

        # Insert data into DB
        session_data = database_handler.sessions_container.read_item(
            item=session_document_id, partition_key=user_id
        )
        post_session_analysis = {
            'qualitative_analysis': qualitative_analysis,
            'scores': scores,
            'similar_topic': similar_topics_list,
            'feynman_session_outcome': 'passed' 
        }
        session_data['post_session_analysis'] = post_session_analysis
        database_handler.sessions_container.replace_item(
            item=session_document_id, body=session_data
        )
        logging.info(post_session_analysis)
        return func.HttpResponse(json.dumps(post_session_analysis), status_code=200)

        # session_data["session_aggregated_score"] = scores
        # session_data["last_date_attempt"] = time.time()
        # session_data["image_url"] = ""
        # database_handler.sessions_container.upsert_item(body=session_data)

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
