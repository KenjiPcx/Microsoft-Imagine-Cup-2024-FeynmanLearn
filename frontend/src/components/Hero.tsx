import { Container, Text, Button, Group, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },
  inner: {
    position: "relative",
    paddingTop: 200,
    paddingBottom: 120,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color:
      theme.colorScheme === "dark" ? theme.colors.white : theme.colors.black,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },
  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: 18,
    },
  },
  controls: {
    marginTop: theme.spacing.xl,
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

export function HeroTitle() {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            fully featured
          </Text>{" "}
          React components and hooks library
        </h1>

        <Text className={classes.description} color="dimmed">
          Build fully functional accessible web applications with ease – Mantine
          includes more than 100 customizable components and hooks to cover you
          in any situation
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="default"
            className={classes.control}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </div>
  );
}
