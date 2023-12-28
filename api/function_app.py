import azure.functions as func
import langchain
import logging
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

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