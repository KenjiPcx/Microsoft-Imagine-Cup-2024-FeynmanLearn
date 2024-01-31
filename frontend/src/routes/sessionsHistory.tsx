// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSessions, getAllSessionsByUser } from "../sessionsService";
import { Button, NavLink } from "@mantine/core";
import {
  Flex,
  Image,
  Card,
  Box,
  Grid,
  SimpleGrid,
  Skeleton,
  Container,
  Text,
  useMantineTheme,
  px,
} from "@mantine/core";
import classes from "../components/ArticleCard.module.css";

export const Route = new FileRoute("/sessionsHistory").createRoute({
  // loader: fetchSessions,
  component: SessionsComponent,
});

// call hook
// display in grid format -  done
// put image in the grid - check openai api
// on-click link to sessions post analysis - done
// TODO : add types (TYPESCRIPT STUFFS)
// TODO : add loading state
function SessionGrid({ sessions }) {
  const theme = useMantineTheme();

  return (
    <Container my="md">
      <Flex wrap={"wrap"} w="1200px">
        {sessions.map((session) => (
          <Card
            withBorder
            radius="md"
            className={classes.card}
            m="8px"
            p="2px"
            w="300px"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Link
              to={`/sessions/${session.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
              key={session.id}
            >
              <Card.Section>
                <a>
                  <Image src={session.generated_image?.image_url} />
                </a>
                <Text className={classes.title} fw={700}>
                  {session.concept}
                </Text>
                <Text fz="sm" c="dimmed">
                  {session.student_persona}
                </Text>
              </Card.Section>
            </Link>
          </Card>
        ))}
      </Flex>
    </Container>
  );
}

function SessionsComponent() {
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    // Fetch sessions when the component mounts
    fetchSessionsData();
  }, []);
  // const getAllSessionsByUser
  const fetchSessionsData = async () => {
    try {
      //TODO: change this to a proper hook, localhost for now to see mockdata response
      const response = await fetch(
        "http://localhost:7071/api/get_all_sessions_by_user?user_id=02"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data.sessions); // Assuming the API returns an object with a 'sessions' property
      console.log(sessions, "sessionsconsolelog");
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
        <SessionGrid sessions={sessions} />
        <Outlet />
      </div>
      <Outlet />
    </div>
  );
}
