import axios from "axios";
import {
  CREATE_POST_SESSION_ANALYSIS,
  CREATE_QUESTION_ANALYSIS,
  GET_POST_SESSION_ANALYSIS,
} from "../backendEndpoints";

export type CreatePostSessionAnalysisRequest = {
  session_id: string;
  user_id: string;
};

export type QualitativeAnalysis = {
  overall_comment: string;
  strengths: string;
  room_for_improvement: string;
  suggestions_for_improvement: string;
};

export type Scores = {
  clarity_score: number;
  conciseness_score: number;
  comprehensiveness_score: number;
  correctness_score: number;
  exemplification_score: number;
  adaptation_score: number;
  overall_score: number;
};

export type CreatePostSessionAnalysisResponse = {
  concept_explored: string;
  questions_asked: string[];
  qualitative_analysis: QualitativeAnalysis;
  scores: Scores;
  suggested_topics: string[];
  satisfactory_outcome: boolean;
};

export class SessionAnalysisError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "SessionAnalysisError";
  }
}

export const createPostSessionAnalysis = async (
  session_id: string,
  user_id: string
) => {
  const data: CreatePostSessionAnalysisRequest = {
    session_id: session_id,
    user_id: user_id,
  };

  try {
    const analysis = await axios.post<CreatePostSessionAnalysisResponse>(
      CREATE_POST_SESSION_ANALYSIS,
      data
    );
    return analysis.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      let message;
      switch (status) {
        case 404:
          message = `Session with id "${session_id}" not found.`;
          break;
        case 400:
          message = `Session with id "${session_id}" cannot be analyzed.`;
          break;
      }
      if (status === 400 || status === 404) {
        throw new SessionAnalysisError(message);
      }
    }
    throw err;
  }
};

export type CreateQuestionAnaysisRequest = {
  session_id: string;
  user_id: string;
  question_id: number;
};

export type CreateQuestionAnalysisResponse = {
  clarity_score: string;
  clarity_explanation: string;
  conciseness_score: string;
  conciseness_explanation: string;
  comprehensiveness_score: string;
  comprehensiveness_explanation: string;
  correctness_score: string;
  correctness_explanation: string;
  exemplification_score: string;
  exemplification_explanation: string;
  adaptation_score: string;
  adaptation_explanation: string;
  question: string;
  question_id: number;
};

export const createQuestionAnalysis = async (
  session_id: string,
  user_id: string,
  question_id: string
) => {
  const data = {
    session_id: session_id,
    user_id: user_id,
    question_id: question_id,
  };

  try {
    const analysis = await axios.post<CreateQuestionAnalysisResponse>(
      CREATE_QUESTION_ANALYSIS,
      data
    );
    return analysis.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      let message;
      switch (status) {
        case 404:
          message = `Question with id "${question_id}" in session "${session_id}" not found.`;
          break;
        case 400:
          message = `Question with id "${question_id}" in session "${session_id}" cannot be analyzed.`;
          break;
      }
      if (status === 400 || status === 404) {
        throw new SessionAnalysisError(message);
      }
    }
    throw err;
  }
};

export type GetPostSessionAnalysisRequest = CreatePostSessionAnalysisRequest;

export type GetPostSessionAnalysisResponse = {
  success: boolean;
  post_session_analysis_data: PostSessionAnalysisData;
};

export type PostSessionAnalysis = CreatePostSessionAnalysisResponse;
export type AnalysisByQuestion = CreateQuestionAnalysisResponse;

export type PostSessionAnalysisData = {
  analysis_by_question: AnalysisByQuestion[];
  post_session_analysis: PostSessionAnalysis;
};

export const getPostSessionAnalysis = async (
  user_id: string,
  session_id: string
) => {
  const data: GetPostSessionAnalysisRequest = {
    session_id: session_id,
    user_id: user_id,
  };

  try {
    const analysis = await axios.post<GetPostSessionAnalysisResponse>(
      GET_POST_SESSION_ANALYSIS,
      data
    );
    return analysis.data.post_session_analysis_data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new SessionAnalysisError(
        `Session with id "${session_id}" not found.`
      );
    }
    throw err;
  }
};
