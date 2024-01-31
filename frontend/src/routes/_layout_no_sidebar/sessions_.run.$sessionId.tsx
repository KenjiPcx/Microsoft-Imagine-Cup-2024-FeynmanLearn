// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSession } from "../../sessionsService";
import {
  Box,
  Center,
  Container,
  ContainerProps,
  createPolymorphicComponent,
  createStyles,
  Image,
  Navbar,
  Stack,
} from "@mantine/core";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import { motion } from "framer-motion";
import NavbarMinimal from "../../components/Sidebar";
import TranscriptButton from "../../components/TranscriptButton";
import { NavbarLink } from "../../components/NavbarLink";
import { IconSettings } from "@tabler/icons-react";

const useStyles = createStyles({
  container: {
    width: "100%",
    height: "100%",
    padding: 0,
    flex: "1 1 0",
  },
});

const PContainer = createPolymorphicComponent<"div", ContainerProps>(Container);

export const Route = new FileRoute("/_layout_no_sidebar/sessions/run/$sessionId").createRoute({
  // loader: async ({ params: { sessionId } }) => fetchSession(sessionId),
  // errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

function SessionComponent() {
  const session = Route.useLoaderData();
  const { classes } = useStyles();

  return (
    <>
      <Box sx={{ position: "absolute", left: 0 }}>
        <Navbar w={"8rem"} p="xl" bg={"rgba(0, 0, 0, 0)"} withBorder={false}>
          <Navbar.Section>
            <TranscriptButton />
          </Navbar.Section>
          <Navbar.Section mt={"auto"}>
            <Stack m="auto" w="min-content">
              <NavbarLink
                icon={IconSettings}
                label={"Settings"}
                active={false}
                onClick={() => {}}
              />
            </Stack>
          </Navbar.Section>
        </Navbar>
      </Box>
      <div>Hl</div>
    </>
  );
}