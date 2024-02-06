/// Not used
import * as React from "react";
import { useNavigate, FileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useAuth } from "../utils/auth";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  createStyles,
  Text,
  Group,
  Center,
  Box,
  Stack,
} from "@mantine/core";
import { HeroTitle } from "../components/Hero";

export const Route = new FileRoute("/login").createRoute({
  validateSearch: z.object({
    redirect: z.string().catch("/"),
  }),
  component: LoginComponent,
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    width: "100vw",
    backgroundSize: "cover",
  },

  form: {
    borderRight: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`, // Adjusted for Mantine theming
    height: "100%",
    minWidth: "600px",
    maxWidth: "35vw",
    paddingTop: "80px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color:
      theme.colorScheme === "dark" ? theme.colors.white : theme.colors.black,
    fontFamily: "Greycliff CF, var(--mantine-font-family)",
  },
}));

function LoginComponent() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");

  //   const search = routeApi.useSearch();

  //   const handleLogin = (evt: React.FormEvent<HTMLFormElement>) => {
  //     evt.preventDefault();
  //     setIsSubmitting(true);

  //     flushSync(() => {
  //       auth.setUser(name);
  //     });

  //     navigate({ to: search.redirect });
  //   };

  return (
    <div className={classes.wrapper}>
      <Group h={"100vh"} w={"100vw"} position="apart">
        <Center mb={200} sx={{ flex: 1 }}>
          <HeroTitle />
        </Center>
        <Paper className={classes.form} radius={0} p={30}>
          <Stack h={"100%"} my={"auto"} justify="center">
            <Title
              order={2}
              className={classes.title}
              ta="center"
              mt="md"
              mb={50}
            >
              Login to Feynman Learn
            </Title>

            <Button fullWidth mt="xl" size="md">
              Login
            </Button>
          </Stack>
        </Paper>
      </Group>
    </div>
  );
}
