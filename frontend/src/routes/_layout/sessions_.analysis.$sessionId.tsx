// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { createFileRoute, redirect } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { fetchSessionAnalysis } from "../../utils/sessionsService";

export const Route = createFileRoute("/_layout/sessions/analysis/$sessionId")({
  loader: async ({ params: { sessionId }, context }) =>
    fetchSessionAnalysis(sessionId, context.auth.getUserId()),
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
