import os
from azure.core.exceptions import AzureError
from azure.cosmos import CosmosClient, PartitionKey

cosmos_endpoint, cosmos_key = os.getenv("COSMOS_ENDPOINT"), os.getenv("COSMOS_KEY")
cosmos_client = CosmosClient(cosmos_endpoint, cosmos_key)

try:
    database = cosmos_client.create_database_if_not_exists(id="feynman_db")
    users_container = database.create_container_if_not_exists(
        id="users", partition_key=PartitionKey(path="/user_id")
    )
    sessions_container = database.create_container_if_not_exists(
        id="sessions", partition_key=PartitionKey(path="/user_id")
    )
except AzureError as e:
    print("Error", e)