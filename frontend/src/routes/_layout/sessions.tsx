// Here is where we select the sessions based on a user's history

import * as React from "react";
import { FileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import {
  SessionSummary,
  fetchSessionSummaries,
} from "../../utils/sessionsService";
import { Box, Button, Center, NavLink, SimpleGrid } from "@mantine/core";
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
import SessionSummaryCard from "../../components/SessionSummaryCard";
import { mockSessionsSummaries } from "../../mock_data/mockSessionSummaryData";

export const Route = new FileRoute("/_layout/sessions").createRoute({
  // loader: async ({ context }) =>
  //   fetchSessionSummaries(context.auth.getUserId()),
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

function SessionsComponent() {
  // const data = Route.useLoaderData();
  // const sessionSummaries = data.sessions;
  const sessionSummaries = mockSessionsSummaries;
  console.log(sessionSummaries, "sessionSummaries");

  return (
    <Box w={"60vw"}>
      {sessionSummaries.length === 0 ? (
        <Text>No sessions found</Text>
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
              image_url={session.image_url}
              last_date_attempt={session.last_date_attempt}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
