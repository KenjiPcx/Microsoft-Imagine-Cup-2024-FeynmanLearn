import {
  Box,
  Button,
  Modal,
  Stack,
  Text,
  createStyles,
  CloseButton,
} from "@mantine/core";
import { useAuth } from "../../utils/auth";

interface SettingsModalProps {
  opened: boolean;
  closeSettings: () => void;
}

const useStyles = createStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    backgroundColor: theme.colors.dark[8],
    padding: theme.spacing.lg,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    color: theme.colors.gray[2],
    position: "relative",
  },

  content: {
    backgroundColor: theme.colors.dark[7],
    padding: theme.spacing.xl,
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color: theme.colors.gray[0],
  },

  title: {
    fontSize: theme.fontSizes.lg,
  },

  userDetails: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray[3],
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },

  logoutButton: {
    backgroundColor:
      "linear-gradient(135deg, theme.colors.red[6], theme.colors.cyan[6])",
    color: theme.white,
    "&:hover": {
      backgroundColor: "dark cyan",
    },
    marginTop: theme.spacing.md,
  },

  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: theme.colors.gray[2],
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    opacity: 0.5,
    "&:hover": {
      opacity: 1,
    },
    "&:focus": {
      opacity: 1,
    },
  },
}));

const SettingsModal = ({ opened, closeSettings }: SettingsModalProps) => {
  const { classes } = useStyles();
  const auth = useAuth();

  return (
    <Modal
      id="settings-modal"
      size="sm"
      opened={opened}
      onClose={closeSettings}
      classNames={{
        header: classes.header,
        body: classes.content,
      }}
      withCloseButton={false}
      centered
    >
      <Box className={classes.header}>
        <Text className={classes.title} weight={700}>
          Settings
        </Text>
        <CloseButton className={classes.closeButton} onClick={closeSettings} />
      </Box>
      <Stack>
        {auth.isAuthenticated && (
          <Box>
            <Text className={classes.userDetails}>
              Logged in as {auth.authData.userDetails}
            </Text>
            <Button
              fullWidth
              className={classes.logoutButton}
              component="a"
              href="/.auth/logout"
            >
              Log out
            </Button>
          </Box>
        )}
      </Stack>
    </Modal>
  );
};

export default SettingsModal;
