import axios from "axios";

export type SessionType = {
  id: string;
  title: string;
  body: string;
};

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

export const fetchSessions = async () => {
  console.log("Fetching sessions...");
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get<SessionType[]>("https://jsonplaceholder.typicode.com/Sessions")
    .then((r) => r.data.slice(0, 10));
};
