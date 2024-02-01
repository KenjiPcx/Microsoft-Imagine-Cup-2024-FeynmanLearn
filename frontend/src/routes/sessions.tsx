// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSessions, getAllSessionsByUser } from "../sessions";
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

export const Route = new FileRoute("/sessions").createRoute({
  // loader: fetchSessions,
  component: SessionsComponent,
});

// call hook
// display in grid format
// put image in the grid
// on-click link to sessions post analysis
// TODO : add types (TYPESCRIPT STUFFS)
function SessionGrid({ sessions }) {
  const theme = useMantineTheme();

  return (
    <Container my="md" ml="5%" mr="5%" mt="400px">
      <Flex
        wrap={"wrap"}
        w={{ base: 300, xs: 300, sm: 700, md: 900, lg: 1200 }}
      >
        {sessions.map((session) => (
          <Card
            withBorder
            radius="md"
            className={classes.card}
            m="8px"
            p="8px"
            // w="350px"
            w={{ base: 280, xs: 280, sm: 330, md: 280, lg: 350 }}
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
              <Card.Section
                // p="10px"
                // p={{ xs: 15, sm: 20, lg: 8 }}
                pl={{ base: 15, xs: 15, sm: 20, lg: 8 }}
                pr={{ base: 15, xs: 15, sm: 20, lg: 8 }}
              >
                <a>
                  <Image src={session.generated_image} />
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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch sessions when the component mounts
    fetchSessionsData();
  }, []);
  // const getAllSessionsByUser
  const fetchSessionsData = async () => {
    try {
      //TODO: change this to a proper hook
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
    } finally {
      // Set loading state to false whether the fetch succeeded or failed
      setIsLoading(false);
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
        {isLoading ? (
          // Render Skeleton when loading
          <Skeleton height={800} />
        ) : (
          // Render SessionGrid when not loading
          <SessionGrid sessions={sessions} />
        )}
        <Outlet />
      </div>
      <Outlet />
    </div>
  );
}
