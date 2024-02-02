import os

from azure.cosmos import CosmosClient

cosmos_endpoint, cosmos_key = os.getenv("COSMOS_ENDPOINT"), os.getenv("COSMOS_KEY")

class DatabaseHandler:
    """
    We only store custom sql queries here
    Otherwise use dbHandler.container to interact with the database
    """

    def __init__(self):
        self.cosmos_client = CosmosClient(cosmos_endpoint, cosmos_key)
        self.db = self.cosmos_client.get_database_client("feynman_db")
        self.users_container = self.db.get_container_client("users")
        self.sessions_container = self.db.get_container_client("sessions")

    def fetch_sessions_summary_by_user(self, user_id: str) -> list:
        try:
            # Query session summaries for the given user_id
            query = f"SELECT c.id, c.concept, c.student_persona, c.image_url, c.last_date_attempt FROM c WHERE c.user_id = '{user_id}'"
            sessions = self.sessions_container.query_items(
                query, enable_cross_partition_query=True
            )
            sessions = list(sessions)
            return sessions

        except Exception as e:
            raise

    def fetch_sessions_by_user(self, user_id: str) -> list:
        try:
            # Query sessions for the given user_id
            query = f"SELECT * FROM c WHERE c.user_id = '{user_id}'"
            sessions = list(
                self.sessions_container.query_items(
                    query, enable_cross_partition_query=True
                )
            )
            return sessions

        except Exception as e:
            raise
