import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button, Group, Stack, createStyles } from "@mantine/core";
import { HeroTitle } from "../../components/Hero";
import { useAuth } from "../../utils/auth";
import { IconBrandGithub } from "@tabler/icons-react";
import NewSessionButton from "../../components/NewSessionButton";

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

export const Route = createLazyFileRoute("/_layout/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { classes } = useStyles();
  const auth = useAuth();

  return (
    <Stack>
      <HeroTitle />
      <Group className={classes.controls}>
        {auth.isAuthenticated ? (
          <NewSessionButton />
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
        <Button
          component={Link}
          to={"/sessions/run/$sessionId"}
          params={{ sessionId: "3dbf279a-0f4e-4616-a78f-262c0b54256f" }}
        >
          Navigate to run session for dev purposes
        </Button>
      </Group>
    </Stack>
  );
}
