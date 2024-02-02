// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import { FileRoute } from "@tanstack/react-router";
import { Box, Navbar, Stack, Text } from "@mantine/core";
import TranscriptButton from "../../components/TranscriptButton";
import { NavbarLink } from "../../components/NavbarLink";
import { IconSettings } from "@tabler/icons-react";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../utils/hooks";
import { isRecognizingState } from "../../recoil";
import { useRecoilState } from "recoil";
import { playMessage, speechRecognizer } from "../../utils/speech";
import { SEND_MESSAGE_ENDPOINT } from "../../backendEndpoints";
import { fetchSession } from "../../sessionsService";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";

export const Route = new FileRoute(
  "/_layout_no_sidebar/sessions/run/$sessionId"
).createRoute({
  loader: async ({ params: { sessionId } }) => fetchSession(sessionId),
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

function SessionComponent() {
  const session = Route.useLoaderData();
  console.log(session);

  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [recognizing, setRecognizing] = useRecoilState(isRecognizingState);
  const [messages, setMessages] = useState<string[]>([]);
  const [combinedMessages, setCombinedMessages] = useState<string[]>([]);

  const baseData = {
    user_id: "Azure",
    session_id: "a763d853-4345-4017-8265-2151c63c67ba",
  };

  const debouncedUserTalk = useDebounce(async (newRecognizedText: string) => {
    if (!newRecognizedText || newRecognizedText.length < 15) {
      return;
    }

    const data = {
      ...baseData,
      message: messages.join(" ") + " " + newRecognizedText,
    };

    try {
      console.log(data);
      setRecognizing(false);
      // return;
      const res = await axios.post(SEND_MESSAGE_ENDPOINT, data);
      setUserMessage("");
      setAssistantMessage(res.data.message);
      playMessage(res.data.message, () => {
        setRecognizing(true);
        setAssistantMessage("");
      });
    } catch (err) {
      console.log("Error", err);
    }
  }, 7500);

  useEffect(() => {
    const assistantStartMessage =
      session.session_data.transcripts[0].assistant.message;
    setAssistantMessage(assistantStartMessage);
    setRecognizing(false);
    playMessage(assistantStartMessage, () => {
      setAssistantMessage("");
      setRecognizing(true);
    });
    speechRecognizer.recognizing = (s, e) => {
      setUserMessage(e.result.text);
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };
    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        setUserMessage(e.result.text);
        setMessages((messages) => [...messages, e.result.text]);
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      }
    };
    return () => {
      debouncedUserTalk.cancel();
    };
  }, []);

  useEffect(() => {
    if (recognizing) {
      speechRecognizer.startContinuousRecognitionAsync();
    } else {
      speechRecognizer.stopContinuousRecognitionAsync();
    }
  }, [recognizing]);

  useEffect(() => {
    debouncedUserTalk(userMessage);
  }, [userMessage]);

  return (
    <>
      <Box sx={{ position: "absolute", left: 0 }}>
        <Navbar w={"8rem"} p="xl" bg={"rgba(0, 0, 0, 0)"} withBorder={false}>
          <Navbar.Section>
            <TranscriptButton />
          </Navbar.Section>
          <Navbar.Section mt={"auto"}>
            <Stack m="auto" w="min-content">
              <NavbarLink
                icon={IconSettings}
                label={"Settings"}
                active={false}
                onClick={() => {}}
              />
            </Stack>
          </Navbar.Section>
        </Navbar>
      </Box>
      <Stack
        justify="space-between"
        h={"85vh"}
        maw={"60%"}
        // style={{ outline: "1px solid red" }}
      >
        <Text size={"xl"} align="center">
          {assistantMessage}
        </Text>
        <Text size={"xl"} align="center">
          {userMessage}
        </Text>
      </Stack>
    </>
  );
}
