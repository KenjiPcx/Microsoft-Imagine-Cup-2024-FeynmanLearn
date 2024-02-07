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