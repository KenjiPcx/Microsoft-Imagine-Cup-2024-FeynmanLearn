import * as React from "react";
import { FileRoute, Link, redirect } from "@tanstack/react-router";
import { Box, Button, Group, Stack, createStyles } from "@mantine/core";
import { HeroTitle } from "../../components/Hero";
import { AuthData, useAuth } from "../../utils/auth";
import { IconBrandGithub } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  controls: {
    marginTop: theme.spacing.xl,
    alignItems: "center", // Center the words vertically
    justifyContent: "center", // Center the words horizontally
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      marginTop: theme.spacing.xl,
    },
  },
  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export const Route = new FileRoute("/_layout/").createRoute({
  component: IndexComponent,
  beforeLoad: async ({ context }) => {
    console.log("Context", context)
    if (!context.auth.isAuthenticated) {
      const res = await fetch("/.auth/me");
      const payload = await res.json();
      const { clientPrincipal } = payload;
      if (clientPrincipal) {
        console.log("Client Principal", clientPrincipal)
        context.auth.setAuthData(clientPrincipal as AuthData);
      }
    }
  },
});

function IndexComponent() {
  const { classes } = useStyles();
  const auth = useAuth();

  return (
    <Stack>
      <HeroTitle />
      <Group className={classes.controls}>
        {auth.isAuthenticated ? (
          <Button
            component={Link}
            to="sessions/new"
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            New Session
          </Button>
        ) : (
          <Button
            component="a"
            href="/.auth/login/github"
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            leftIcon={<IconBrandGithub />}
          >
            Login with GitHub
          </Button>
        )}
      </Group>
    </Stack>
  );
}
