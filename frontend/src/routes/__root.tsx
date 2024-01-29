import * as React from "react";
import {
  Link,
  Outlet,
  rootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Auth } from "../utils/auth";
import { Spinner } from "../components/Spinner";
import {
  Box,
  Container,
  ContainerProps,
  Flex,
  FlexProps,
  createPolymorphicComponent,
  createStyles,
  Image,
  Center,
} from "@mantine/core";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useDisclosure } from "@mantine/hooks";
import SettingsModal from "../components/SettingsModal";

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return <Spinner show={isLoading} />;
}

export const Route = rootRouteWithContext<{
  auth: Auth;
}>()({
  component: RootComponent,
});

// animate-able components for framer-motion
// https://github.com/orgs/mantinedev/discussions/1169#discussioncomment-5444975
const PFlex = createPolymorphicComponent<"div", FlexProps>(Flex);
const PContainer = createPolymorphicComponent<"div", ContainerProps>(Container);

const useStyles = createStyles({
  root: {
    height: "100vh",
    width: "100vw",
    background:
      "var(--bg-gradient-full---blue, linear-gradient(180deg, #191A27 2.23%, #14141D 25.74%, #14141D 49.42%, #14141D 73.62%, #14141D 96.28%))",
    overflow: "clip",
  },

  container: {
    width: "100%",
    height: "100%",
    padding: 0,
    flex: "1 1 0",
  },
});

function RootComponent() {
  const { classes } = useStyles();

  const [opened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);

  const toggleSettings = () => {
    if (opened) {
      closeSettings();
    } else {
      openSettings();
    }
  };

  return (
    <>
      <PFlex component={motion.div} className={classes.root} layout>
        <Sidebar settingsOpened={opened} toggleSettings={toggleSettings} />
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
            <Outlet />
          </Center>
        </PContainer>
        <TanStackRouterDevtools position="bottom-right" />
      </PFlex>

      <SettingsModal opened={opened} closeSettings={closeSettings} />
    </>
  );
}
