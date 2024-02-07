import {
  Box,
  Button,
  Modal,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import { useAuth } from "../utils/auth";


interface SettingsModalProps {
  opened: boolean;
  closeSettings: () => void;
}

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.cardFill,
  },

  content: {
    backgroundColor: theme.colors.cardFill,
    border: `1px solid ${theme.colors.cardStroke}`,
  },
}));

const SettingsModal = ({ opened, closeSettings }: SettingsModalProps) => {
  const { classes } = useStyles();
  const auth = useAuth();

  console.log("auth data", auth.authData)
  return (
    <Modal
      id="settings-modal"
      size={"md"}
      opened={opened}
      onClose={closeSettings}
      yOffset={300}
      title={<Text fw={700}>Settings</Text>}
      classNames={{ content: classes.content, header: classes.header }}
    >
      <Stack>
        {auth.isAuthenticated && (
          <Box>
            <Text>Logged in as {auth.authData.userDetails}</Text>
            <Button
              component={"a"}
              href="/.auth/logout"
              variant="default"
              mt="auto"
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
