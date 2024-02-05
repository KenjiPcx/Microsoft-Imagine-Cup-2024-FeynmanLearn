import json
import azure.functions as func


value_error_response = func.HttpResponse(
    json.dumps(
        {
            "success": False,
            "error": "Bad request. Request body is missing or not in JSON format.",
        }
    ),
    status_code=400,
)
cosmos_404_error_response = func.HttpResponse(
    json.dumps({"success": False, "error": "Resource not found error."}),
    status_code=404,
)
generic_server_error_response = func.HttpResponse(
    json.dumps(
        {
            "success": False,
            "error": "Internal server error.",
        }
    ),
    status_code=500,
)
