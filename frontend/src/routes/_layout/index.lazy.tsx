import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button, Group, Stack, createStyles } from "@mantine/core";
import { HeroTitle } from "../../components/Hero";
import { useAuth } from "../../utils/auth";
import { IconBrandGithub } from "@tabler/icons-react";
import NewSessionButton from "../../components/NewSessionButton";
import { useEffect } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

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
        {/* <Button
          component={Link}
          to={"/sessions/run/$sessionId"}
          params={{ sessionId: "fae5f009-7599-4740-9fbf-f79d7355071b" }}
        >
          Navigate to run session for dev purposes
        </Button> */}
        <Button
          onClick={async () => {
            try {
              const res = await axios.get("/api/say_hello");
              console.log(res.data);
              notifications.show({
                title: "Success Hello",
                message: res.data,
              });
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Get hello api
        </Button>
      </Group>
    </Stack>
  );
}
