import * as React from "react";
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
import { Outlet } from "@tanstack/react-router";

interface LayoutContainerProps {
  children?: React.ReactNode;
}

const useStyles = createStyles({
  container: {
    width: "100%",
    height: "100%",
    padding: 0,
    flex: "1 1 0",
  },
});

const PContainer = createPolymorphicComponent<"div", ContainerProps>(Container);

export default function LayoutContainer({ children }: LayoutContainerProps) {
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
        {children}
      </Center>
    </PContainer>
  );
}
