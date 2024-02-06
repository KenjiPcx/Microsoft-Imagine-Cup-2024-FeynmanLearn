import {
  Alert,
  Button,
  Group,
  // Divider,
  // FileButton,
  Modal,
  Stack,
  Text,
  TextInput,
  createStyles,
  // Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRef, useState } from "react";
// import axiosClient from "../axiosConfig";
// import { UPLOAD_USERDATA_ENDPOINT } from "../serverEndpoints";

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

  const ref = useRef<HTMLInputElement>(null);

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
        <Button
          component={"a"}
          href="/.auth/logout"
          variant="default"
          mt="auto"
        >
          Log out
        </Button>

        <Alert
          icon={<IconInfoCircle />}
          title="Connect your custom data!"
          variant="light"
          color="blue"
        >
          Get started by setting a custom and unique username, then upload your
          CSV file containing your entity definitions
        </Alert>

        <Group>
          <TextInput
            ref={ref}
            placeholder="Your new username"
            label="Set New Username"
            withAsterisk
            sx={{ flex: "1" }}
          />
          <Button variant="default" mt="auto">
            Set Username
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default SettingsModal;
