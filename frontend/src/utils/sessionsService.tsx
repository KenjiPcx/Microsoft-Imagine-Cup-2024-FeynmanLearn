import axios from "axios";
import { GET_SESSION_DATA_ENDPOINT } from "../backendEndpoints";

export type SessionType = {
  session_data: {
    id: string;
    user_id: string;
    concept: string;
    game_mode: string;
    depth: string;
    student_persona: string;
    session_plan: string;
    prompt: string;
    transcripts: Array<{
      user: string;
      assistant: {
        message: string;
        emotion: "happy" | "confused";
        internal_thoughts: string;
      };
    }>;
    thread_id: string;
    image_url?: string;
    _rid?: string;
    _self?: string;
    _etag?: string;
    _attachments?: string;
    _ts?: number;
  };
  success: boolean;
};

export class SessionNotFoundError extends Error {}

export const fetchSession = async (sessionId: string) => {
  console.log(`Fetching Session with id ${sessionId}...`);

  const data = {
    session_id: sessionId,
    user_id: "KenjiPcx",
  };

  const Session = await axios
    .post<SessionType>(GET_SESSION_DATA_ENDPOINT, data)
    .then((r) => r.data)
    .catch((err) => {
      if (err.response.status === 404) {
        throw new SessionNotFoundError(
          `Session with id "${sessionId}" not found!`
        );
      }
      throw err;
    });

  return Session;
};

export const fetchSessionSummaries = async () => {
  console.log(`Fetching summary of all sessions...`);
  await new Promise((r) => setTimeout(r, 500));
  const listOfSessions = await axios
    .get<SessionType[]>(
      `https://jsonplaceholder.typicode.com/get_session_summaries`
    )
    .then((r) => r.data)
    .catch((err) => {
      if (err.response.status === 404) {
        throw new SessionNotFoundError(`Session not found!`);
      }
      throw err;
    });

  return listOfSessions;
};

export const fetchSessions = async () => {
  console.log("Fetching sessions...");
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get<SessionType[]>("https://jsonplaceholder.typicode.com/Sessions")
    .then((r) => r.data.slice(0, 10));
};
