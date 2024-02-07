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

    def fetch_session_summaries_by_user(self, user_id: str) -> list:
        try:
            # Query session summaries for the given user_id
            query = f"SELECT c.id, c.lesson_concept, c.image_url, c.last_date_attempt FROM c WHERE c.user_id = '{user_id}'"
            # query = f"SELECT c.id, c.concept, c.student_persona FROM c WHERE c.user_id = '{user_id}'" # For ventus testing purposes
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

    def get_transcript_by_question(self, user_id: str, question_id: int, session_id: str) -> list:
        try:
            # Query transcripts of a specific question using user_id and question_id 
            query = f"SELECT c.id, c.user_id, st AS session_transcript, c.student_persona FROM c JOIN st IN c.session_transcripts WHERE c.user_id='{user_id}' AND st.question_id={question_id} AND c.session_id='{session_id}'"
            sessions = list(
                self.sessions_container.query_items(
                    query, enable_cross_partition_query=True
                )
            )
            return sessions

        except Exception as e:
            raise