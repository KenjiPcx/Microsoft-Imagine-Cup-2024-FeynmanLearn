import { Button, createStyles } from "@mantine/core";
import { Link } from "@tanstack/react-router";

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

export default function NewSessionButton() {
  const { classes } = useStyles();

  return (
    <Button
      component={Link}
      to="/sessions/new"
      size="xl"
      className={classes.control}
      variant="gradient"
      gradient={{ from: "blue", to: "cyan" }}
    >
      New Session
    </Button>
  );
}
