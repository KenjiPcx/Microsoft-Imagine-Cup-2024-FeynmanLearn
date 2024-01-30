// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSessions } from "../sessions";
import { Button, NavLink } from "@mantine/core";
import { Box,Grid,SimpleGrid, Skeleton, Container, Stack, useMantineTheme, px } from '@mantine/core';

export const Route = new FileRoute("/sessions").createRoute({
  // loader: fetchSessions,
  component: SessionsComponent,
});

// call hook
// display in grid format
// put image in the grid
// on-click link to sessions post analysis
// TODO : add types (TYPESCRIPT STUFFS)

function Subgrid({ sessions }) {
  const theme = useMantineTheme();

  return (
    <Container my="md">
      {sessions.map((session) => (
          <Link to={`/sessions/${session.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box key={session.id} style={{ display: 'flex', border: '1px solid #ccc', padding: '10px', borderRadius: '8px'}}>
            <Box style={{flex: 8}}>
            <div> <strong style={{fontSize: '18px'}}>{session.concept} </strong> </div>
            <div>{session.student_persona}</div>
            </Box>
          <Box style={{ flex: 4 }}>
            {/* placeholder for image */}
            <img
              src={session.generated_image?.image_url || 'placeholder_image_url'}
              alt="Dall-E Generated Image"
              style={{ width: '100%', marginTop: '10px' }}
            />
          </Box>
        </Box>
        </Link>
      ))}
    </Container>
  );
  
}

function SessionsComponent() {
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    // Fetch sessions when the component mounts
    fetchSessionsData();
  }, []);

  const fetchSessionsData = async () => {
    try {
      //TODO: change this to a proper hook
      const response = await fetch("http://localhost:7071/api/get_all_sessions_by_user?user_id=02");

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data.sessions); // Assuming the API returns an object with a 'sessions' property
      console.log(sessions,'sessionsconsolelog')
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    }
  };

  return (
    <div className="p-2 flex gap-2">
      Sessions
      <div>
        We could have a new session button here, clicking it will redirect to
        session/new
        {/* <NavLink component={Link} to="/sessions/new" label="New Session" /> */}
      </div>
      <Button component={Link} to="/sessions/new">
        New Session
      </Button>
      <div>
        Other than that, a grid of user previous sessions would be here,
        clicking on any of them will redirect to /sessions/$sessionId
      </div>
      <div className="p-2 flex flex-col gap-2">
      <div className="flex items-center">
        <Button component={Link} to="/sessions/new">
          New Session
        </Button>
      </div>
      <Subgrid sessions={sessions} />
      <Outlet />
    </div>
      <Outlet />
      {/* <ul className="list-disc pl-4">
        {sessions.map((session) => (
          <li key={session.id} className="whitespace-nowrap">
            <Link
              to={`/sessions/${session.id}`}
              className="block py-1 text-blue-800 hover:text-blue-600"
              activeProps={{ className: "text-black font-bold" }}
            >
              <div>{session.title.substring(0, 20)}</div>
            </Link>
          </li>
        ))}
      </ul> */}
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
