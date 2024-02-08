const isProd = import.meta.env.PROD;
const baseUrl = `${isProd ? "" : import.meta.env.VITE_REACT_APP_FUNCTION_BASE_URL}/api`;

export const CREATE_SESSION_ENDPOINT = `${baseUrl}/create_session`;
export const GET_SESSION_DATA_ENDPOINT = `${baseUrl}/get_session_data`;
export const GET_SESSION_SUMMARIES_ENDPOINT = `${baseUrl}/get_session_summaries`;
export const SEND_MESSAGE_ENDPOINT = `${baseUrl}/send_message`;
export const VERIFY_LESSON_SCOPE_ENDPOINT = `${baseUrl}/verify_lesson_scope`;
export const CREATE_QUESTION_ANALYSIS = `${baseUrl}/analyze_question_response`;
export const CREATE_POST_SESSION_ANALYSIS = `${baseUrl}/analyze_session`;
export const GET_POST_SESSION_ANALYSIS = `${baseUrl}/get_post_session_analysis`;