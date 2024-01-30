import { forwardRef } from "react";
import { Stack, UnstyledButton, Text } from "@mantine/core";

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
