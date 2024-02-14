// Here is where we select the sessions based on a user's history

import { createLazyFileRoute } from "@tanstack/react-router";
import { Box, Center, SimpleGrid, Stack } from "@mantine/core";
import { Text } from "@mantine/core";
import SessionSummaryCard from "../../components/SessionSummaryCard";
import NewSessionButton from "../../components/layout/NewSessionButton";

export const Route = createLazyFileRoute("/_layout/sessions")({
  component: SessionsComponent,
});

function SessionsComponent() {
  const data = Route.useLoaderData();
  const sessionSummaries = data.sessions;
  // const sessionSummaries = [];
  console.log(sessionSummaries, "sessionSummaries");

  return (
    <Box w={"60vw"}>
      {sessionSummaries.length === 0 ? (
        <Center>
          <Stack spacing={"xl"}>
            <Text size={"xl"} fw={"bolder"} align="center">
              No sessions found
            </Text>
            <NewSessionButton />
          </Stack>
        </Center>
      ) : (
        <SimpleGrid
          cols={3}
          spacing={"xl"}
          breakpoints={[
            { maxWidth: "md", cols: 3, spacing: "md" },
            { maxWidth: "sm", cols: 2, spacing: "sm" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          {sessionSummaries.map((session, key) => (
            <SessionSummaryCard
              key={key}
              id={session.id}
              label={session.lesson_concept}
              image_url={session.image_url || ""}
              last_date_attempt={session.last_date_attempt}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
