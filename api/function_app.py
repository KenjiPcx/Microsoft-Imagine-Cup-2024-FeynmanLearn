import json
import os
import uuid
import logging
import helper
import time
import requests
import constants
import openai

import azure.functions as func
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from azure.storage.blob import BlobServiceClient, ContentSettings
from langchain_openai import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

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
openai_client = openai.OpenAI(api_key=openai_key)
langchain_llm = ChatOpenAI(api_key=openai_key, model="gpt-4-turbo-preview")
database_handler = DatabaseHandler()

connect_str = os.getenv("BLOB_CONN_STR")
container_name = "feynmanlearn"
blob_service_client = BlobServiceClient.from_connection_string(connect_str)


@app.route(route="create_session")
def create_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("create_session HTTP trigger function processed a request.")

    try:
        # Extract the request body
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        session_id = req_body.get("session_id")
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
        assistant = OpenAIAssistantRunnable.create_assistant(
            name=f"student-{session_id}",
            instructions=feynman_student_instructions_prompt,
            tools=[],
            model="gpt-4-turbo-preview",
        )
        # assistant = OpenAIAssistantRunnable(
        #     assistant_id=feynman_assistant_id, as_agent=True
        # )

        start_msg = f"Tell me you're excited to learn about {lesson_concept} in a very brief way, and I'll proceed to teach"
        output = assistant.invoke(
            {
                "content": start_msg,
            }
        )
        assistant_output = output[0].content[0].text.value
        assistant_output = feynman_student_prompt_parser.parse(assistant_output)
        thread_id = output[0].thread_id
        assistant_id = output[0].assistant_id

        # Create the session data and store it in the database
        session_data = {
            "id": session_id,
            "user_id": user_id,
            "assistant_id": assistant_id,
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
        assistant_id = session_data.get("assistant_id")

        # Get student agent response
        assistant = OpenAIAssistantRunnable(
            assistant_id=assistant_id, as_agent=True
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


# @app.route(route="analyze_question_response")
# def analyze_question_response(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info("analyze_question_response HTTP trigger function processed a request.")

#     try:
#         req_body = req.get_json()
#         user_id = req_body.get("user_id")
#         question_id = req_body.get("question_id")
#         session_id = req_body.get("session_id")

#         # Fetch the session data and process transcripts
#         transcript = database_handler.get_transcript_by_question(
#             user_id, question_id, session_id
#         )
#         if len(transcript) < 1:
#             return func.HttpResponse(
#                 "Cannot find transcript by question_id", status_code=404
#             )

#         # Obtain transcript by question
#         question_transcript = transcript[0]["session_transcript"]["question_transcript"]
#         audience_level = transcript[0]["student_persona"]

#         # Terminate if analysis is already generated for this question
#         session_data = database_handler.sessions_container.read_item(
#             item=session_id, partition_key=user_id
#         )
#         session_analysis = session_data.get("session_analysis", [])
#         check_if_analysis_exist = list(
#             filter(lambda _: _["question_id"] == question_id, session_analysis)
#         )
#         if len(check_if_analysis_exist) != 0:
#             return func.HttpResponse("Analysis already exist!", status_code=400)

#         # Construct response schema and format instructions to use in prompt
#         response_schemas = constants.QUESTION_RESPONSE_SCHEMARESPONSE_SCHEMA
#         output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
#         format_instructions = output_parser.get_format_instructions()

#         # Create prompt and run analysis on prompt
#         template = "You are a helpful assistant that takes a transcript and scores the user's explanation to a learner and provides a detailed explanation for the score using the evidence available. You will score using this rubric: {rubric} and you can use the learner's response to support your case but remember that you are scoring the user's explanations. \n{format_instructions}\n{question}. Your response is directed towards the user, so do address them as from a second person perspective, that is, phrasing your feedback with 'You/ Your explanation/ You did well'. Use evidence and quotation in your explanation where possible.  Also, try to be encouraging, and make sure to score in whole numbers between 1 and 5 inclusive. The audience level you will evaluate for is '{audience_level}'."
#         prompt = PromptTemplate(
#             template=template,
#             input_variables=["question", "rubric"],
#             partial_variables={"format_instructions": format_instructions},
#         )
#         _input = prompt.format_prompt(
#             question=question_transcript,
#             rubric=constants.MARKING_RUBRIC,
#             audience_level=audience_level,
#         )

#         # Build response
#         output = langchain_llm(_input.to_messages())
#         question_transcript_analysis = output_parser.parse(output.content)
#         question_transcript_analysis["question"] = transcript[0]["session_transcript"][
#             "question"
#         ]
#         question_transcript_analysis["question_id"] = transcript[0][
#             "session_transcript"
#         ]["question_id"]
#         res = {"success": True, "analysis_data": question_transcript_analysis}
#         logging.info(question_transcript_analysis)

#         # Update session data
#         session_analysis.append(question_transcript_analysis)
#         session_data["session_analysis"] = session_analysis
#         database_handler.sessions_container.replace_item(
#             item=session_id, body=session_data
#         )
#         return func.HttpResponse(json.dumps(res), status_code=200)

#     except ValueError:
#         # Handle JSON parsing error
#         return value_error_response
#     except CosmosResourceNotFoundError:
#         return cosmos_404_error_response
#     except Exception:
#         return generic_server_error_response


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
            "session_passed": overall_score >= 50,
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
        image_url = DallEAPIWrapper(model="dall-e-3").run(output.image_prompt)
        session_data["oai_image_url"] = image_url

        # Download image to blob storage
        blob_name = f"{user_id}/{session_id}.png"
        blob_client = blob_service_client.get_blob_client(
            container=container_name, blob=blob_name
        )
        image = requests.get(image_url)
        blob_client.upload_blob(
            image.content,
            blob_type="BlockBlob",
            overwrite=True,
            content_settings=ContentSettings(content_type="image/png"),
        )

        # Update the session data with the image blob url
        blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}"
        session_data["image_url"] = blob_url

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


# @app.route(route="analyze_session_v2")
# def analyze_session_v2(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info("analyze_session HTTP trigger function processed a request.")

#     # # Some dall e code from ventus
#     # dalle_api_wrapper = DallEAPIWrapper()

#     #     # Create a prompt for the current session
#     #     dall_e_prompt = f"Can you create an image to illustrate a student having the following persona: {student_persona}, while learning: {concept}"

#     #     # Add the generated image information to the current session dictionary
#     #     session["image_url"] = dalle_api_wrapper.run(dall_e_prompt)

#     try:
#         req_body = req.get_json()
#         user_id = req_body.get("user_id")
#         session_id = req_body.get("session_id")

#         # Fetch the session data and process analysis
#         session_data = database_handler.get_analysis_by_session(user_id, session_id)

#         if len(session_data) < 1:
#             return func.HttpResponse("Failed to get session data", status_code=400)

#         session_analysis = session_data[0].get("session_analysis", [])
#         post_session_analysis = session_data[0].get("post_session_analysis", {})

#         # Error handling
#         if len(session_analysis) == 0:
#             return func.HttpResponse(
#                 "Session does not contain any analysis", status_code=404
#             )
#         if post_session_analysis != {}:
#             return func.HttpResponse(
#                 "Post session analysis already exist", status_code=400
#             )

#         # Aggregate scores across all questions
#         scores = helper.get_overall_and_average_score_for_session(session_analysis)
#         logging.info(scores)

#         # Structure output schema
#         output_parser = StructuredOutputParser.from_response_schemas(
#             constants.POST_SESSION_ANALYSIS_SCHEMA
#         )
#         format_instructions = output_parser.get_format_instructions()

#         # Create prompt and run analysis on prompt
#         template = "Using this instruction {format_instructions}, aggregate the feedback for this session using the analysis on different questions, use an encouraging tone and address using a second person perspective. Aggregated scores across all questions in this session is: {aggregated_score}. Structure your feedback using the following in the following order: overall_comment, strengths, room_for_improvement, suggestions_for_improvement. \n Session data: {session}"
#         prompt = PromptTemplate(
#             template=template,
#             input_variables=["session", "aggregated_score", "format_instructions"],
#         )
#         _input = prompt.format_prompt(
#             session=session_analysis,
#             rubric=constants.MARKING_RUBRIC,
#             aggregated_score=scores,
#             format_instructions=format_instructions,
#         )

#         # Build response
#         output = langchain_llm(_input.to_messages())
#         qualitative_analysis = output_parser.parse(output.content)
#         logging.info(qualitative_analysis)

#         # Construct content dictionary to use as input to find new topic suggestions
#         concept_explored = session_data[0].get("concept", [])
#         question_asked = [question_obj["question"] for question_obj in session_analysis]
#         content = {
#             "overall_score": scores["overall_score"],
#             "concept": concept_explored,
#             "question": question_asked,
#         }

#         # Suggest new topics depending on performance:
#         student_did_poorly = scores["overall_score"] < 3.5
#         topic_list = []
#         topic_type = "related and at a similar or slightly higher level of difficulty"
#         if student_did_poorly:
#             topic_type = "at a lower level of difficulty"

#         # Generate sugggestions for new topics in subsequent feynman sessions
#         prompt = ChatPromptTemplate.from_template(
#             "Suggest 5 topics that are {topic_type} for a student to learn about, based on the content the student explored in the session. Return just the topics as a list of strings (the output should be parsable by json.loads in python) and nothing extra. \n Questions, score and concept explored in current learning session: \n {content}"
#         )
#         output_parser = StrOutputParser()
#         chain = prompt | langchain_llm | output_parser
#         topics_str = chain.invoke({"content": content, "topic_type": topic_type})
#         topic_list = json.loads(topics_str)
#         logging.info(topic_list)

#         # Insert data into DB
#         session_data = database_handler.sessions_container.read_item(
#             item=session_id, partition_key=user_id
#         )
#         post_session_analysis = {
#             "concept_explored": concept_explored,
#             "questions_asked": question_asked,
#             "qualitative_analysis": qualitative_analysis,
#             "scores": scores,
#             "suggested_topics": topic_list,
#             "satisfactory_outcome": scores["overall_score"] >= 3.5,
#         }
#         session_data["post_session_analysis"] = post_session_analysis
#         database_handler.sessions_container.replace_item(
#             item=session_id, body=session_data
#         )
#         logging.info(post_session_analysis)
#         res = {"success": True, "post_session_analysis_data": post_session_analysis}
#         return func.HttpResponse(json.dumps(res), status_code=200)

#         # session_data["session_aggregated_score"] = scores
#         # session_data["last_date_attempt"] = time.time()
#         # session_data["image_url"] = ""
#         # database_handler.sessions_container.upsert_item(body=session_data)

#     except ValueError:
#         # Handle JSON parsing error
#         return value_error_response
#     except CosmosResourceNotFoundError:
#         return cosmos_404_error_response
#     except Exception:
#         return generic_server_error_response


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


@app.route(route="check_post_session_analysis_exists")
def check_post_session_analysis_exists(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(
        "check_post_session_analysis_exists HTTP trigger function processed a request."
    )

    try:
        req_body = req.get_json()
        session_id = req_body.get("session_id")
        user_id = req_body.get("user_id")

        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )
        res = {
            "exists": "post_session_analysis" in session_data,
        }
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        return cosmos_404_error_response
    except Exception:
        return generic_server_error_response


@app.route(route="check_session_exists")
def check_session_exists(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("check_session_exists HTTP trigger function processed a request.")

    try:
        req_body = req.get_json()
        user_id = req_body.get("user_id")
        session_id = req_body.get("session_id")
        session_data = database_handler.sessions_container.read_item(
            item=session_id, partition_key=user_id
        )
        res = {"exists": True}
        return func.HttpResponse(json.dumps(res), status_code=200)

    except ValueError:
        # Handle JSON parsing error
        return value_error_response
    except CosmosResourceNotFoundError:
        res = {"exists": False}
        return func.HttpResponse(json.dumps(res), status_code=404)
    except Exception:
        return generic_server_error_response


# @app.route(route="get_post_session_analysis_v2")
# def get_post_session_analysis_v2(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info(
#         "get_post_session_analysis_v2 HTTP trigger function processed a request."
#     )

#     try:
#         req_body = req.get_json()
#         session_id = req_body.get("session_id")
#         user_id = req_body.get("user_id")

#         session_data = database_handler.sessions_container.read_item(
#             item=session_id, partition_key=user_id
#         )
#         post_session_analysis_data = {
#             "post_session_analysis": session_data["post_session_analysis"],
#             "analysis_by_question": session_data["session_analysis"],
#         }
#         res = {
#             "success": True,
#             "post_session_analysis_data": post_session_analysis_data,
#         }
#         return func.HttpResponse(json.dumps(res), status_code=200)

#     except ValueError:
#         # Handle JSON parsing error
#         return value_error_response
#     except CosmosResourceNotFoundError:
#         return cosmos_404_error_response
#     except Exception:
#         return generic_server_error_response
