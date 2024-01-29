import { JSX } from "react";
import {
  Navbar,
  Tooltip,
  createStyles,
  Stack,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconSettings, TablerIconsProps } from "@tabler/icons-react";

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
