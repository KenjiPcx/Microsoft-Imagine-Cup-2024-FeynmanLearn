import {
  Box,
  Button,
  Modal,
  Stack,
  Text,
  createStyles,
  CloseButton,
  Anchor,
} from "@mantine/core";
import { useAuth } from "../../utils/auth";

interface CreditsModalProps {
  opened: boolean;
  closeCredits: () => void;
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

const CreditsModal = ({ opened, closeCredits }: CreditsModalProps) => {
  const { classes } = useStyles();
  const auth = useAuth();

  return (
    <Modal
      id="credits-modal"
      size="md"
      opened={opened}
      onClose={closeCredits}
      classNames={{
        header: classes.header,
        body: classes.content,
      }}
      withCloseButton={false}
      centered
    >
      <Box className={classes.header}>
        <Text className={classes.title} weight={700}>
          Credits
        </Text>
        <CloseButton className={classes.closeButton} onClick={closeCredits} />
      </Box>
      <Stack p={"md"}>
        <Text>
          Credit to TeamOpenSmartGlasses for the Convoscope project, available
          under the MIT License.
          <Text size={"sm"}>Copyright 2023 TeamOpenSmartGlasses.</Text>
          <Anchor
            href="https://github.com/TeamOpenSmartGlasses/Convoscope"
            target="_blank"
          >
            Checkout their GitHub
          </Anchor>
        </Text>
      </Stack>
    </Modal>
  );
};

export default CreditsModal;
