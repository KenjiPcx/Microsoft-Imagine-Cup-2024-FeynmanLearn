// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchSession } from "../../utils/sessionsService";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute(
  "/_layout_no_sidebar/sessions/run/$sessionId"
)({
  loader: async ({ params: { sessionId }, context }) =>
    fetchSession(sessionId, context.auth.getUserId()),
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
