import { Box, Title, Paper, Stack, Text } from "@mantine/core";
import { SessionMetadata } from "../../utils/sessionsService";

interface SessionMetadataCardProps {
  session_metadata: SessionMetadata;
}

const SessionMetadataCard = ({
  session_metadata,
}: SessionMetadataCardProps) => {
  return (
    <Box>
      <Title order={2} color="blue">
        Session Metadata
      </Title>
      <Paper radius={"lg"} mt={"lg"} p={"xs"}>
        <Stack p={"md"} spacing={"xs"}>
          <Text>
            <Text fw="bold" span>
              Concept:{" "}
            </Text>
            {session_metadata.lesson_concept}
          </Text>
          <Text>
            <Text fw="bold" span>
              Objectives:{" "}
            </Text>
            {session_metadata.lesson_objectives}
          </Text>
          <Text>
            <Text fw="bold" span>
              Game Mode:{" "}
            </Text>
            {session_metadata.game_mode}
          </Text>
          <Text>
            <Text fw="bold" span>
              Student Persona:{" "}
            </Text>
            {session_metadata.student_persona}
          </Text>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SessionMetadataCard;
