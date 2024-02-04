import { Dialog, Group, TextInput, Text, Button, Navbar, Stack, rem, Box, Badge, Menu, CloseButton, createStyles } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconNewSection,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { NavbarLink } from "./NavbarLink";
import { NavButton } from "./NavButton";

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
    height: 44,
    paddingLeft: 32,
    paddingRight: 32,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

interface NavbarMinimalProps {
  settingsOpened: boolean;
  toggleSettings: () => void;
}

export function NavbarMinimal({
  settingsOpened,
  toggleSettings,
}: NavbarMinimalProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes } = useStyles();

  const closeSession = () => {
    console.log("Session closed");
  };

  return (
    <Navbar w={"8rem"} p="xl" bg={"rgba(0, 0, 0, 0)"} withBorder={false}>
      <Navbar.Section>
        <Stack m="auto" w="min-content">
          <Menu withArrow>
            <Menu.Target>
              <NavButton />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Navigation</Menu.Label>
              <Menu.Item
                component={Link}
                to={"/"}
                icon={<IconHome style={{ width: rem(14), height: rem(14) }} />}
              >
                Home
              </Menu.Item>
              <Menu.Item
                component={Link}
                to={"/sessions/new"}
                icon={
                  <IconNewSection style={{ width: rem(14), height: rem(14) }} />
                }
              >
                New Session
              </Menu.Item>
              <Menu.Item
                component={Link}
                to={"/sessions"}
                icon={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}
              >
                Past Sessions
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </Navbar.Section>
      <Navbar.Section mt={"auto"}>
        <Box>
          For dev purposes
          {(
            [
              ["/", "Home (Kenji)"],
              ["/sessions", "Sessions (Ventus)"],
              ["/sessions/new", "New Session (Nicolo)"],
              ["/sessions/run/$sessionId", "Feynman Session (Kenji)"],
              ["/sessions/analysis/$sessionId", "Post Analysis (Joshua)"],
              // ["/dashboard", "Dashboard"],
              // ["/profile", "Profile"],
              // ["/login", "Login"],
            ] as const
          ).map(([to, label]) => {
            return (
              <Badge key={to}>
                <Link
                  to={to}
                  activeOptions={
                    {
                      // If the route points to the root of it's parent,
                      // make sure it's only active if it's exact
                      // exact: to === '.',
                    }
                  }
                  preload="intent"
                  className={`block py-2 px-3 text-blue-700`}
                  // Make "active" links bold
                  activeProps={{ className: `font-bold` }}
                >
                  {label}
                </Link>
              </Badge>
            );
          })}
        </Box>
      </Navbar.Section>
      <Navbar.Section mt={"auto"}>
        <Stack m="auto" w="min-content">
          <NavbarLink
            icon={CloseButton}
            tooltipLabel={"Quit Session"}
            tooltipPosition="right"
            active={settingsOpened}
            onClick={toggle}
          />
        </Stack>
      </Navbar.Section>
      <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
        <Text size="m" mb="xs" fw={500}>
          Do you really want to quit the session?
        </Text>
        <Group align="center">
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "green" }}
            onClick={close}
          >
            No</Button>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "red" }}
            onClick={closeSession}
          >
            Yes
          </Button>
        </Group>
      </Dialog>
    </Navbar>
  );
}

export default NavbarMinimal;
