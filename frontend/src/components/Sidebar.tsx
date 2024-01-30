import { JSX, forwardRef } from "react";
import {
  Navbar,
  Tooltip,
  createStyles,
  Stack,
  UnstyledButton,
  rem,
  Box,
  Badge,
  Menu,
  keyframes,
  Text,
} from "@mantine/core";
import {
  IconHome,
  IconNewSection,
  IconPhoto,
  IconSettings,
  TablerIconsProps,
} from "@tabler/icons-react";
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

const breathe = keyframes`
  0% { transform: translate(0); filter: brightness(1); }
  50% { transform: translate(0, -6px); filter: brightness(1.2); }
  100% { transform: translate(0); filter: brightness(1); }
`;

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

export const NavButton = forwardRef<HTMLButtonElement>((others, ref) => {
  return (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        border: `3px solid ${theme.colors.cardStroke}`,
        padding: theme.spacing.xs,
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        color: theme.colors.cardFill,
        backgroundColor: theme.colors.convoscopeBlue,
        borderRadius: theme.spacing.md,
        // animation: `${breathe} 6s ease-in-out infinite`,

        ":active": { translate: "0 1px" },
        ":hover": { borderColor: theme.colors.convoscopeBlue },
      })}
      {...others}
    >
      <Stack spacing={0}>
        <Text size="xl" weight={700}>
          {"Feynman"}
        </Text>
        <Text size="xl">{"Learn"}</Text>
      </Stack>
    </UnstyledButton>
  );
});

interface NavbarMinimalProps {
  settingsOpened: boolean;
  toggleSettings: () => void;
}

export function NavbarMinimal({
  settingsOpened,
  toggleSettings,
}: NavbarMinimalProps) {
  const { classes } = useStyles();

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
