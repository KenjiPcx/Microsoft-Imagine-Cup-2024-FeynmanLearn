import { Navbar, Stack, rem, Box, Badge, Menu } from "@mantine/core";
import {
  IconHome,
  IconNewSection,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { NavbarLink } from "./NavbarLink";
import { NavButton } from "./NavButton";

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
            tooltipLabel={"Settings"}
            tooltipPosition="right"
            active={settingsOpened}
            onClick={toggleSettings}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default NavbarMinimal;