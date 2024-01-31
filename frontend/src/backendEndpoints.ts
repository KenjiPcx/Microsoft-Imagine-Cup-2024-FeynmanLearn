const baseUrl = import.meta.env.VITE_REACT_APP_FUNCTION_BASE_URL;

export const sendMessageEndpoint = `${baseUrl}/api/send_message`;
export const stopSpeakingEndpoint = `${baseUrl}/api/stop_speaking`;
