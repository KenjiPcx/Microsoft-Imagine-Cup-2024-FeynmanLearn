import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContext } from "../utils/auth";
import {
  Flex,
  FlexProps,
  createPolymorphicComponent,
  createStyles,
} from "@mantine/core";
import { motion } from "framer-motion";

export interface RouterContext {
  auth: AuthContext;
}

export const Route = rootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

// animate-able components for framer-motion
// https://github.com/orgs/mantinedev/discussions/1169#discussioncomment-5444975
const PFlex = createPolymorphicComponent<"div", FlexProps>(Flex);

const useStyles = createStyles({
  root: {
    height: "100vh",
    width: "100vw",
    background:
      "var(--bg-gradient-full---blue, linear-gradient(180deg, #191A27 2.23%, #14141D 25.74%, #14141D 49.42%, #14141D 73.62%, #14141D 96.28%))",
    overflow: "clip",
  },
});

function RootComponent() {
  const { classes } = useStyles();

  return (
    <PFlex component={motion.div} className={classes.root} layout>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </PFlex>
  );
}
