import axios from "axios";

export type SessionType = {
  id: string;
  title: string;
  body: string;
};

export type listOfSessionsType = [
  {
    id: string;
    concept: string;
    student_persona: string;
    generated_image?: string;
  }
]

export class SessionNotFoundError extends Error {}

export const fetchSession = async (sessionId: string) => {
  console.log(`Fetching Session with id ${sessionId}...`);
  await new Promise((r) => setTimeout(r, 500));
  const Session = await axios
    .get<SessionType>(`https://jsonplaceholder.typicode.com/Sessions/${sessionId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.response.status === 404) {
        throw new SessionNotFoundError(`Session with id "${sessionId}" not found!`);
      }
      throw err;
    });

  return Session;
};

export const getAllSessionsByUser = async (userId: string) => {
  console.log(`Getting all sessions of userId ${userId}...`);
  await new Promise((r) => setTimeout(r, 500));
  const listOfSessions = await axios
    .get<listOfSessionsType>(`https://jsonplaceholder.typicode.com/get_all_sessions_by_user?user_id=${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.response.status === 404) {
        throw new SessionNotFoundError(`Session with user id "${userId}" not found!`);
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
