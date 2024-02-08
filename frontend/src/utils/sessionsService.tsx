import axios from "axios";
import {
  GET_POST_SESSION_ANALYSIS_ENDPOINT,
  GET_SESSION_DATA_ENDPOINT,
  GET_SESSION_SUMMARIES_ENDPOINT,
} from "../backendEndpoints";

export type Transcript = {
  user: string;
  assistant: {
    message: string;
    emotion: "happy" | "neutral" | "confused";
    internal_thoughts: string;
  };
};

export type Session = {
  id: string;
  user_id: string;
  concept: string;
  game_mode: string;
  depth: string;
  student_persona: string;
  session_plan: string;
  prompt: string;
  transcripts: Transcript[];
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

export type SessionMetadata = {
  lesson_concept: string;
  lesson_objectives: string;
  game_mode: string;
  student_persona: string;
};

export type GetSessionAnalysisResponse = {
  session_metadata: SessionMetadata;
  post_session_analysis: {
    overall_score: number;
    session_passed: boolean;
    assessment_summary: string;
    general_assessment: string;
    knowledge_gaps: string[];
    constructive_feedback: string;
    easier_topics: string[];
    similar_topics: string[];
    objective_reached: boolean;
  };
  annotated_transcripts: Transcript[];
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

export const fetchSessionAnalysis = async (
  sessionId: string,
  userId: string
) => {
  const data = {
    session_id: sessionId,
    user_id: userId,
  };

  try {
    const sessionAnalysis = await axios.post<GetSessionAnalysisResponse>(
      GET_POST_SESSION_ANALYSIS_ENDPOINT,
      data
    );
    return sessionAnalysis.data;
  } catch (err) {
    if (err.response.status === 404) {
      throw new SessionNotFoundError(
        `Session with id "${sessionId}" not found!`
      );
    }
    throw err;
  }
};
