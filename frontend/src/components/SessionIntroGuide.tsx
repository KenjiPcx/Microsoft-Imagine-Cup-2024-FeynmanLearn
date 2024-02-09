import { List, Stack, Text, Box } from "@mantine/core";

const SessionIntroGuide = () => {
  return (
    <Stack px={"md"}>
      <Box>
        <Text size={"lg"} fw={"bold"}>
          Overview of the session 📚
        </Text>
        <List>
          <List.Item>
            You have 10 minutes to teach the student about your concept
          </List.Item>
          <List.Item>
            Session will end
            <List>
              <List.Item>whenthe agent understands</List.Item>
              <List.Item>or when you run out of time</List.Item>
              <List.Item>or when you voluntarily quit the session</List.Item>
            </List>
          </List.Item>
        </List>
      </Box>

      <Box>
        <Text size={"lg"} fw={"bold"}>
          Here is a quick UI guide 🎨
        </Text>
        
        <List>
          <List.Item>
            On the left, there are 3 buttons
            <List>
              <List.Item>Toggle voice input</List.Item>
              <List.Item>Chat history</List.Item>
              <List.Item>Exit session</List.Item>
            </List>
          </List.Item>

          <List.Item>
            In the center, you will see
            <List>
              <List.Item>the assistant's response</List.Item>
              <List.Item>the question being asked</List.Item>
              <List.Item>your transcripted message</List.Item>
            </List>
          </List.Item>
          <List.Item>
            On the top right, you can see
            <List>
              <List.Item> the time left</List.Item>
              <List.Item>assistant emotions</List.Item>
            </List>
          </List.Item>
        </List>
      </Box>

      <Text>Click start when you are ready 😊</Text>
    </Stack>
  );
};

export default SessionIntroGuide;
