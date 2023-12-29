// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSessions } from "../sessions";

export const Route = new FileRoute("/sessions").createRoute({
  // loader: fetchSessions,
  component: SessionsComponent,
});

function SessionsComponent() {
  // const sessions = Route.useLoaderData();

  return (
    <div className="p-2 flex gap-2">
      Sessions
      <div>
        We could have a new session button here, clicking it will redirect to
        session/new
      </div>
      <div>
        Other than that, a grid of user previous sessions would be here,
        clicking on any of them will redirect to /sessions/$sessionId
      </div>
      {/* <ul className="list-disc pl-4">
        {[...sessions, { id: "i-do-not-exist", title: "Non-existent Session" }]?.map(
          (session) => {
            return (
              <li key={session.id} className="whitespace-nowrap">
                <Link
                  to="/sessions/$sessionId"
                  params={{
                    sessionId: session.id,
                  }}
                  className="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ className: "text-black font-bold" }}
                >
                  <div>{session.title.substring(0, 20)}</div>
                </Link>
              </li>
            );
          }
        )}
      </ul> */}
    </div>
  );
}
