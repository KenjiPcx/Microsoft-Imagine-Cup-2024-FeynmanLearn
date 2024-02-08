import {
  Box,
  Paper,
  Stack,
  Title,
  Text,
  Button,
  Collapse,
  Center,
} from "@mantine/core";
import { Transcript } from "../../utils/sessionsService";
import { useDisclosure } from "@mantine/hooks";

interface LineByLineFeedbackProps {
  transcripts: Transcript[];
}

interface LineFeedbackCardProps {
  transcript: Transcript;
}

export const LineFeedbackCard = ({ transcript }: LineFeedbackCardProps) => {
  return (
    <Paper radius={"lg"} p={"xs"}>
      <Stack p={"md"}>
        <Text>
          <Text span fw={"bold"}>
            User:{" "}
          </Text>
          {transcript.user}
        </Text>
        <Text>
          <Text span fw={"bold"}>
            Assistant:{" "}
          </Text>
          {transcript.assistant.message}
        </Text>
        <Text
          color={
            transcript.assistant.emotion === "happy"
              ? "green"
              : transcript.assistant.emotion === "confused"
                ? "orange"
                : "gray"
          }
        >
          <Text span fw={"bold"}>
            Feedback:{" "}
          </Text>
          {transcript.assistant.internal_thoughts}
        </Text>

        <Text
          fw={"bolder"}
          color={
            transcript.assistant.emotion === "happy"
              ? "green"
              : transcript.assistant.emotion === "confused"
                ? "orange"
                : "gray"
          }
        >
          Assistant emotion: {transcript.assistant.emotion}
        </Text>
      </Stack>
    </Paper>
  );
};

const LineByLineFeedback = ({ transcripts }: LineByLineFeedbackProps) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [firstTranscript, ...restTranscripts] = transcripts;

  return (
    <Box>
      <Title order={2} color={"blue"}>
        Line by line feedback
      </Title>
      <Stack mt={"lg"}>
        <LineFeedbackCard transcript={firstTranscript} />
        <Center mt={"xs"}>
          <Button onClick={toggle}>
            {opened ? "Close line feedback" : "View all line feedback"}
          </Button>
        </Center>
        <Collapse
          in={opened}
          transitionDuration={500}
          transitionTimingFunction="linear"
        >
          {transcripts.map((transcript, index) => (
            <LineFeedbackCard
              transcript={transcript}
              key={`line-feedback-${index}`}
            />
          ))}
          <Center mt={"lg"}>
            <Button onClick={toggle}>Close line feedback</Button>
          </Center>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default LineByLineFeedback;
