// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import {
  fetchSessions,
  fetchSessionSummaries,
} from "../../utils/sessionsService";
import { Button, NavLink } from "@mantine/core";
import {
  Title,
  Flex,
  Image,
  Card,
  Skeleton,
  Container,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
// import classes from "../../components/ArticleCard.module.css";

interface SessionProps {
  id: string;
  generated_image: string;
  concept: string;
  student_persona: string;
}

interface SessionGridProps {
  sessions: SessionProps[];
}

export const Route = new FileRoute("/_layout/sessions").createRoute({
  // loader: fetchSessions,
  component: SessionsComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      notifications.show({
        color: "yellow",
        title: "Unauthorized",
        message: "You are not authorized yet, please login first",
      });
      throw redirect({
        to: "/",
      });
    }
  },
});

function SessionGrid({ sessions }: SessionGridProps) {
  const theme = useMantineTheme();

  return (
    <Container>
      <Flex
        wrap={"wrap"}
        w={{ base: 300, xs: 300, sm: 700, md: 900, lg: 1200 }}
      >
        {sessions.map((session) => (
          <Card
            key={session.id}
            withBorder
            radius="md"
            // className={classes.card} //TODO: Change this to a proper class using styles API?
            m="8px"
            p="2%"
            pos="relative"
            w={{ base: 280, xs: 280, sm: 330, md: 280, lg: 350 }}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              background: "var(--mantine-color-body)",
            }}
          >
            <Link
              to={`/sessions/${session.id}` as string} //TODO: check if there is a better way to do this without showing warnings instead of changing type to string
              style={{ textDecoration: "none", color: "inherit" }}
              key={session.id}
            >
              <Card.Section
                pl={{ base: 15, xs: 15, sm: 20, lg: 8 }}
                pr={{ base: 15, xs: 15, sm: 20, lg: 8 }}
              >
                <a>
                  <Image src={session.generated_image} />
                </a>
                <Text
                  display="block"
                  fw={700}
                  // className={classes.title} //See if can use styles api to convert it to a proper class
                  style={{
                    marginTop: "var(--mantine-spacing-md)",
                    marginBottom: "rem(5px)",
                  }}
                >
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
      //TODO: change this to a proper hook, only for testing purposes
      const response = await fetch(
        "http://localhost:7071/api/get_session_summaries"
      );

      // user_id = '02' //needs to be changed to something that takes user_id automatically from the route
      // const response = await fetchSessionSummaries;

      // if (!response.ok) {
      //   throw new Error("Failed to fetch sessions");
      // }

      const data = await response.json();
      setSessions(data.sessions); // Assuming the API returns an object with a 'sessions' property
      console.log(sessions, "sessionsconsolelog");
    } catch (error) {
      console.error("Error fetching sessions:", (error as Error).message);
    } finally {
      setIsLoading(false); // Set loading to false whether the fetch succeeds or fails
    }
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <Title pt="5%" m="2%">
        Sessions
      </Title>
      <Button m="2%" color="blue" component={Link} to="/sessions/new">
        New Session
      </Button>
      {isLoading ? (
        <Skeleton
          ml="5%"
          mr="5%"
          w={{ base: 300, xs: 300, sm: 700, md: 900, lg: 1200 }}
          h="90vh"
        />
      ) : (
        <SessionGrid sessions={sessions} />
      )}
    </div>
  );
}
