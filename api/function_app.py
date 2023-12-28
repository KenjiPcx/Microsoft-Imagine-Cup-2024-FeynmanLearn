import azure.functions as func
import openai
from langchain.agents.openai_assistant import OpenAIAssistantRunnable
import logging
import json
import os

from agents.agent_prompt import prompt

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
assistant = OpenAIAssistantRunnable.create_assistant(
    name="feynman student",
    instructions="You are a personal math tutor. Write and run code to answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-1106-preview",
    client=client
)

@app.route(route="get_session_prebuilts")
def get_session_prebuilts(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('get_session_prebuilts HTTP trigger function processed a request.')

    # just some prebuilt combinations of session options for the home page
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="get_session_options")
def get_session_options(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('get_session_options HTTP trigger function processed a request.')

    # for a custom session thing, we just need to get all the options 
    # in a page, so user can choose some combination for start_session
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
    
@app.route(route="start_session")
def start_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('start_session HTTP trigger function processed a request.')

    # probably add some session data into the database here
    # and send some ok message before frontend redirects to the chat page
    # maybe create the thread here?
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="send_message")
def send_message(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('send_message HTTP trigger function processed a request.')

    user_id = req.params.get('user_id')
    message = req.params.get('message')
    if not user_id or not message:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')
            message = req_body.get('message')

    res = {}
    res['user_id'] = user_id
    res['message'] = message
    res['success'] = True 

    if user_id and message:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="analyze_session")
def analyze_session(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('analyze_session HTTP trigger function processed a request.')

    # get all of the stored data out of the db
    # generate some nice dashboard of the session
    # - Show gaps in explanation
    # - Provide suggestions on explaining and teaching
    # - Suggestion on similar topics that can contribute to this point
    # - Identifies misconceptions
    # - Gives useful additional nuggets of knowledge (did you know?)
    # - Set a timer on a session to explain again, can quiz through the user in a conversational manner?
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="get_user_data")
def get_user_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('analyze_session HTTP trigger function processed a request.')

    # fetch basic user app info
    # fetch user sessions history in a list
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="get_session_data")
def get_session_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('analyze_session HTTP trigger function processed a request.')

    # fetch session data from the db
    # just display it the same as the analyze_session function
    
    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    res = {}
    res['user_id'] = user_id
    res['success'] = True 

    if user_id:
        return func.HttpResponse(json.dumps(res), status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
