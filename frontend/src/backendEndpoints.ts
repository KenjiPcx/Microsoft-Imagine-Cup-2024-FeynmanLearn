const isProd = import.meta.env.PROD || true; // Let's just use the prod version directly
const baseUrl = `${isProd ? "https://feynmanlearnapi.azurewebsites.net" : import.meta.env.VITE_REACT_APP_FUNCTION_BASE_URL}/api`;

export const CREATE_SESSION_ENDPOINT = `${baseUrl}/create_session?code=aXWeTBwsKBvmC6hTJekarfcDLgdp9jDv3GlLpHBPqpqrAzFuxcqPUA==`;
export const GET_SESSION_DATA_ENDPOINT = `${baseUrl}/get_session_data?code=z323hJXAGb2hQZlByVAiwEAO98tNxlop6AbpHMPO1kUTAzFuHQWA8w==`;
export const GET_SESSION_SUMMARIES_ENDPOINT = `${baseUrl}/get_session_summaries?code=h2qVco3MLgAmW86ZdkZkxspooBP3x9-iDfyR8IfwX0vTAzFuVkKs7g==`;
export const SEND_MESSAGE_ENDPOINT = `${baseUrl}/send_message?code=M3nNEvPci7x46xTcKO6F9y_Yuiqo1W_6fhu0ilWIzvNFAzFut9RDbQ==`;
export const VERIFY_LESSON_SCOPE_ENDPOINT = `${baseUrl}/verify_lesson_scope?code=v_1ZYRDxK0FoKbBRXJQGn8gvfBXQLMOEZtu9e8oauje6AzFuohiBMg==`;
export const CREATE_QUESTION_ANALYSIS = `${baseUrl}/analyze_question_response?code=`;
export const CREATE_POST_SESSION_ANALYSIS = `${baseUrl}/analyze_session?code=8Wh8sqUwmpZMIGcNWEmPQnI-OqazH-6XLLyDbn-5MLPMAzFuSRSQ6w==`;
export const GET_POST_SESSION_ANALYSIS_ENDPOINT = `${baseUrl}/get_post_session_analysis?code=7R1aIv6NKRKk6cA6quoNFjlJEhtivAh14j-NjbiNM9cLAzFualI5wA==`;
export const CHECK_POST_SESSION_ANALYSIS_EXISTS = `${baseUrl}/check_post_session_analysis_exists?code=MuWxQe0lEE9ju43z1LXXCj947dZvPArx3bR38s32QlQXAzFuOquvFw==`;
export const CHECK_SESSION_EXISTS = `${baseUrl}/check_session_exists?code=CpdhbZyVDs2i5fNQ-uZJylFrwGZ0sjB6Hhi55JDv4UF7AzFuEXjvVA==`;
