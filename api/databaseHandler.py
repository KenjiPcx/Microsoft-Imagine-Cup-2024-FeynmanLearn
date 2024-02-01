import logging, os 

from azure.cosmos import CosmosClient

cosmos_endpoint, cosmos_key = os.getenv("COSMOS_ENDPOINT"), os.getenv("COSMOS_KEY")

class DatabaseHandler:
    def __init__(self, connection_string: str):
        self.cosmos_client = CosmosClient(connection_string)
        self.db = self.cosmos_client.get_database_client("feynman_db")
        self.users_container = self.db.get_container_client("users")
        self.sessions_container = self.db.get_container_client("sessions")

    def fetch_sessions_by_user(self, user_id: str) -> list:
        # Query sessions for the given user_id
        query = f"SELECT c.id, c.concept, c.student_persona FROM c WHERE c.user_id = '{user_id}'"
        sessions = list(self.sessions_container.query_items(query, enable_cross_partition_query=True))

        # Return the sessions
        logging.info("Log sessions update %s", sessions)
        return sessions
