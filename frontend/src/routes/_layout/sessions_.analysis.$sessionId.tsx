// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { FileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Card,
  Text,
  Group,
  Title,
  Button,
  Flex,
  Box,
  ScrollArea,
  Accordion,
  Indicator,
  Skeleton,
  Modal,
  Stack,
  Paper,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { fetchSessionAnalysis } from "../../utils/sessionsService";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import { mockPostSessionAnalysis } from "../../mock_data/mockPostSessionAnalysis";
import LineByLineFeedback from "../../components/post_session_analysis/LineByLineFeedback";
import SessionMetadataCard from "../../components/post_session_analysis/SessionMetadata";

export const Route = new FileRoute(
  "/_layout/sessions/analysis/$sessionId"
).createRoute({
  loader: async ({ params: { sessionId }, context }) =>
    fetchSessionAnalysis(sessionId, context.auth.getUserId()),
  component: PostSessionAnalysisComponent,
  errorComponent: SessionErrorComponent as any,
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

function PostSessionAnalysisComponent() {
  // const analysis = Route.useLoaderData();
  const analysis = mockPostSessionAnalysis;
  console.log(analysis);
  const [error, setError] = useState(false);

  return (
    <ScrollArea h={"80vh"} offsetScrollbars>
      <Stack miw={"40vw"} maw={"50vw"} spacing={50} justify="center">
        <Box>
          <Title order={2} color="blue">
            Session Overview
          </Title>
          Overview, summary + score + objectives completed
        </Box>
        <Box>
          <Title order={2} color="blue">
            Identified Knowledge Gaps
          </Title>
          Knowledge gaps + Easier topics
        </Box>

        <SessionMetadataCard session_metadata={analysis.session_metadata} />

        <Box>
          <Title order={2} color="blue">
            Session Metadata
          </Title>
          Constructive feedback
        </Box>

        <LineByLineFeedback transcripts={analysis.annotated_transcripts} />
        <Box>
          <Title order={2} color="blue">
            Session Metadata
          </Title>
          Similar topics
        </Box>

        <Center>
          <Button component={Link} to={"/"}>
            Home
          </Button>
        </Center>
      </Stack>
    </ScrollArea>
  );
}
