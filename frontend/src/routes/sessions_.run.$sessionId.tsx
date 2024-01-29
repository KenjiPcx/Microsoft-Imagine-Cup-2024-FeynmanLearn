// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import * as React from "react";
import {
  ErrorComponent,
  FileRoute,
  Link,
  ErrorRouteProps,
} from "@tanstack/react-router";
import { fetchSession, SessionNotFoundError } from "../sessions";

export const Route = new FileRoute("/sessions/run/$sessionId").createRoute({
  loader: async ({ params: { sessionId } }) => fetchSession(sessionId),
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

export function SessionErrorComponent({ error }: ErrorRouteProps) {
  if (error instanceof SessionNotFoundError) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}

function SessionComponent() {
  const session = Route.useLoaderData();

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{session.title}</h4>
      <div className="text-sm">{session.body}</div>
      {/* <Link
        to="/sessions/$sessionId/deep"
        params={{
          sessionId: session.id,
        }}
        activeProps={{ className: "text-black font-bold" }}
        className="block py-1 text-blue-800 hover:text-blue-600"
      >
        Deep View
      </Link> */}
    </div>
  );
}
