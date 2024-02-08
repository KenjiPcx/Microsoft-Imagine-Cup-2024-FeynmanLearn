// Here is where we configure a session
// 1. Select content to teach
// 2. Select game mode, student configs
// 3. Launch session
// 4. Redirect back new session id to /sessions/:id
//<li>We could have a input src concept to explain button</li>
// <li>We could have some common agent configs</li>

import { createFileRoute, redirect } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";

type NewSessionSearch = {
  topic: string;
};

export const Route = createFileRoute("/_layout/sessions/new")({
  validateSearch: (search: Record<string, unknown>): NewSessionSearch => {
    return {
      topic: (search.topic as string) || "",
    };
  },
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
