import json
import os
import sys
import uuid
import logging

import openai
from langchain.agents.openai_assistant import OpenAIAssistantRunnable
import azure.functions as func
from azure.core.exceptions import AzureError
from azure.cosmos import CosmosClient, PartitionKey

from agents.agent_prompt import prompt, prompt_template, parser

openai_key = os.getenv("OPENAI_API_KEY")
cosmos_endpoint, cosmos_key = os.getenv("COSMOS_ENDPOINT"), os.getenv("COSMOS_KEY")

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

openai_client = openai.OpenAI(api_key=openai_key)
cosmos_client = CosmosClient(cosmos_endpoint, cosmos_key)
db = cosmos_client.get_database_client("feynman_db")
users_container = db.get_container_client("users")
sessions_container = db.get_container_client("sessions")

assistant = OpenAIAssistantRunnable.create_assistant(
    name="feynman student",
    instructions="You are a personal math tutor. Write and run code to answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-1106-preview",
    client=openai_client,
)


@app.route(route="get_session_prebuilts")
def get_session_prebuilts(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("get_session_prebuilts HTTP trigger function processed a request.")

    # just some prebuilt combinations of session options for the home page

    user_id = req.params.get("user_id")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")

    res = {}
    res["user_id"] = user_id
    res["success"] = True

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )


@app.route(route="get_session_options")
def get_session_options(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("get_session_options HTTP trigger function processed a request.")

    # for a custom session thing, we just need to get all the options
    # in a page, so user can choose some combination for start_session

    user_id = req.params.get("user_id")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")

    res = {}
    res["user_id"] = user_id
    res["success"] = True

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )


@app.route(route="start_session")
def start_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("start_session HTTP trigger function processed a request.")

    # take in concept src here
    # come up with a session plan
    # probably add some session data into the database here
    # and send some ok message before frontend redirects to the chat page
    # maybe create the thread here?

    user_id = req.params.get("user_id")
    # concept = req.params.get("concept")
    # game_mode = req.params.get("game_mode")
    # depth = req.params.get("depth")
    # student_persona = req.params.get("student_persona")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")
            concept = req_body.get("concept")
            game_mode = req_body.get("game_mode")
            depth = req_body.get("depth")

            # hard code for now
            concept = "Diffusion Models in AI"
            student_persona = req_body.get("student_persona")
            game_mode = "Explain to a 5 year old, user needs to explain using very simple language and examples"
            depth = "beginner - just ask really basic information"
            student_persona = "5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old"
            example_questions = ["What is Diffusion Models in AI?"]

            prompt = prompt_template.format(
                concept=concept,
                game_mode=game_mode,
                depth=depth,
                student_persona=student_persona,
                example_questions=str(example_questions),
                output_format=parser.get_format_instructions(),
            )

            session_data = {}
            session_data["id"] = str(uuid.uuid4())
            session_data["user_id"] = user_id
            session_data["concept"] = concept
            session_data["game_mode"] = game_mode
            session_data["depth"] = depth
            session_data["student_persona"] = student_persona
            session_data["example_questions"] = example_questions
            session_data["prompt"] = prompt
            session_data["transcripts"] = []
            session_data["unprocessed_transcript"] = ""
            session_data["agent_speaking"] = False

            try:
                sessions_container.create_item(body=session_data)
            except AzureError as e:
                print("Error", e)
                res = {}
                res["success"] = False
                return func.HttpResponse(json.dumps(res), status_code=500)
            else:
                res = {}
                res["session_id"] = session_data["id"]
                res["concept"] = session_data["concept"]
                res["game_mode"] = session_data["game_mode"]
                res["depth"] = session_data["depth"]
                res["student_persona"] = session_data["student_persona"]
                res["success"] = True
            return func.HttpResponse(json.dumps(res), status_code=200)

    return func.HttpResponse(
        "Bad request. Missing user_id in query string or request body.",
        status_code=400,
    )


@app.route(route="send_message")
def send_message(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("send_message HTTP trigger function processed a request.")

    user_id = req.params.get("user_id")
    message = req.params.get("message")
    if not user_id or not message:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")
            message = req_body.get("message")

    res = {}
    res["user_id"] = user_id
    res["message"] = message
    res["success"] = True

    if user_id and message:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )


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

    user_id = req.params.get("user_id")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")

    res = {}
    res["user_id"] = user_id
    res["success"] = True

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )


@app.route(route="get_user_data")
def get_user_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_session HTTP trigger function processed a request.")

    # fetch basic user app info
    # fetch user sessions history in a list

    user_id = req.params.get("user_id")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")

    res = {}
    res["user_id"] = user_id
    res["success"] = True

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )


@app.route(route="get_session_data")
def get_session_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("analyze_session HTTP trigger function processed a request.")

    # fetch session data from the db
    # just display it the same as the analyze_session function

    user_id = req.params.get("user_id")
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get("user_id")

    res = {}
    res["user_id"] = user_id
    res["success"] = True

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200,
        )
