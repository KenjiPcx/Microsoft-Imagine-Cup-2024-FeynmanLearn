import * as React from "react";
import { Outlet, FileRoute } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingsModal";
import {
  Box,
  Center,
  Container,
  ContainerProps,
  createPolymorphicComponent,
  createStyles,
  Image,
} from "@mantine/core";
import { motion } from "framer-motion";

export const Route = new FileRoute("/_layout").createRoute({
  component: LayoutComponent,
});

const PContainer = createPolymorphicComponent<"div", ContainerProps>(Container);

const useStyles = createStyles({
  container: {
    width: "100%",
    height: "100%",
    padding: 0,
    flex: "1 1 0",
  },
});

function LayoutComponent() {
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
      <SettingsModal opened={opened} closeSettings={closeSettings} />
    </>
  );
}
