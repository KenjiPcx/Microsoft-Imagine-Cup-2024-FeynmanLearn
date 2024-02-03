import * as React from "react";
import { ErrorComponent, ErrorRouteProps, Link } from "@tanstack/react-router";
import { SessionNotFoundError } from "../sessionsService";
import { Button, Group, Stack, Text } from "@mantine/core";

export function SessionErrorComponent({ error }: ErrorRouteProps) {
  return (
    <Stack align={"center"}>
      {error instanceof SessionNotFoundError ? (
        <Text size={"lg"}>{error.message}</Text>
      ) : (
        <ErrorComponent error={error} />
      )}
      <Group position="apart" w={"80%"}>
        <Button color="gray" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Button component={Link} to={"/"} color="blue">
          Return Home
        </Button>
      </Group>
    </Stack>
  );
}
