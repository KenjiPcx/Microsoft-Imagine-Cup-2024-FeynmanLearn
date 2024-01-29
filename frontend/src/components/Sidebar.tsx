import { JSX } from "react";
import {
  Navbar,
  Tooltip,
  createStyles,
  Stack,
  UnstyledButton,
  rem,
  Box,
  Badge,
} from "@mantine/core";
import { IconSettings, TablerIconsProps } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(66),
    height: rem(66),
    borderRadius: 999,
    borderWidth: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.iconColor,
    border: `3px solid ${theme.colors.cardStroke}`,
    backgroundColor: theme.colors.cardFill,
    ":active": { translate: "0 1px" },
    ":hover": { borderColor: theme.colors.convoscopeBlue },
    transition: "0.1s",
  },
}));

interface NavbarLinkProps {
  icon: (props: TablerIconsProps) => JSX.Element;
  label: string;
  active?: boolean;
  onClick?(): void;
}

export function NavbarLink({
  icon: Icon,
  label,
  // active,
  onClick,
}: NavbarLinkProps) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        variant={"outline"}
        onClick={onClick}
        className={cx(classes.link)}
      >
        <Icon size="2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

interface NavbarMinimalProps {
  settingsOpened: boolean;
  toggleSettings: () => void;
}

export function NavbarMinimal({
  settingsOpened,
  toggleSettings,
}: NavbarMinimalProps) {
  return (
    <Navbar w={"8rem"} p="xl" bg={"rgba(0, 0, 0, 0)"} withBorder={false}>
      <Navbar.Section>
        <Stack m="auto" w="min-content">
          {/* <TranscriptButton /> */}
          FeynmanLearn Home
        </Stack>
      </Navbar.Section>
      <Navbar.Section mt={"auto"}>
        <Box>
          For dev purposes
          {(
            [
              ["/", "Home (Kenji - landing page)"],
              ["/sessions", "Sessions (Ventus - session history)"],
              ["/sessions/new", "New Session (Nicolo - session creation)"],
              [
                "/sessions/run/some-id",
                "Feynman Session (Kenji - session run)",
              ],
              ["/sessions/analysis/some-id", "Post Session Analysis (Joshua)"],
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
            icon={IconSettings}
            label={"Settings"}
            active={settingsOpened}
            onClick={toggleSettings}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default NavbarMinimal;
