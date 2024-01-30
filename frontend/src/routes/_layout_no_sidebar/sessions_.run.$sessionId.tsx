// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import * as React from "react";
import { FileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchSession } from "../../sessions";
import {
  Box,
  Center,
  Container,
  ContainerProps,
  createPolymorphicComponent,
  createStyles,
  Image,
} from "@mantine/core";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import { motion } from "framer-motion";

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
  loader: async ({ params: { sessionId } }) => fetchSession(sessionId),
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

function SessionComponent() {
  const session = Route.useLoaderData();
  const { classes } = useStyles();

  return (
    <PContainer
      component={motion.div}
      layout
      fluid
      className={classes.container}
      transition={{ bounce: 0 }}
    >
      <Box
        w="50%"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image src={"/blobs.gif"} fit="cover" />
      </Box>
      <Center
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Hello
      </Center>
    </PContainer>
  );
}
