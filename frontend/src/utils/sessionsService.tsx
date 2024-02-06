import axios from "axios";
import {
  GET_SESSION_DATA_ENDPOINT,
  GET_SESSION_SUMMARIES_ENDPOINT,
} from "../backendEndpoints";

export type Session = {
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

export type SessionSummary = {
  id: string;
  image_url: string;
  lesson_concept: string;
  last_date_attempt: string;
};

export type GetSessionResponse = {
  session_data: Session;
  success: boolean;
};

export type GetSessionSummariesResponse = {
  sessions: SessionSummary[];
  session_count: number;
  success: boolean;
};

export class SessionNotFoundError extends Error {}

export const fetchSession = async (sessionId: string, userId: string) => {
  const data = {
    session_id: sessionId,
    user_id: userId,
  };

  try {
    const session = await axios.post<GetSessionResponse>(
      GET_SESSION_DATA_ENDPOINT,
      data
    );
    return session.data;
  } catch (err) {
    if (err.response.status === 404) {
      throw new SessionNotFoundError(
        `Session with id "${sessionId}" not found!`
      );
    }
    throw err;
  }
};

export const fetchSessionSummaries = async (userId: string) => {
  const data = {
    user_id: userId,
  };

  try {
    const sessionSummaries = await axios.post<GetSessionSummariesResponse>(
      GET_SESSION_SUMMARIES_ENDPOINT,
      data
    );
    return sessionSummaries.data;
  } catch (err) {
    if (err.response.status === 404) {
      throw new SessionNotFoundError(`Session not found!`);
    }
    throw err;
  }
};
