// Here is where we select the sessions based on a user's history

import { createFileRoute, redirect } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { fetchSessionSummaries } from "../../utils/sessionsService";

export const Route = createFileRoute("/_layout/sessions")({
  loader: async ({ context }) =>
    fetchSessionSummaries(context.auth.getUserId()),
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
