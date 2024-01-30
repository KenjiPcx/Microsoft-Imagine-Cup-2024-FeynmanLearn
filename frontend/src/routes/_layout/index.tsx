import * as React from "react";
import { FileRoute, Link } from "@tanstack/react-router";
import { Box, Stack } from "@mantine/core";
import { HeroTitle } from "../../components/Hero";

export const Route = new FileRoute("/_layout/").createRoute({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <Stack>
      <HeroTitle />
    </Stack>
  );
}
