// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import { FileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Drawer,
  Navbar,
  ScrollArea,
  Stack,
  Text,
  createStyles,
  Dialog,
  Group,
  Button,
} from "@mantine/core";
import TranscriptButton from "../../components/TranscriptButton";
import { NavbarLink } from "../../components/NavbarLink";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../utils/hooks";
import { isRecognizingState } from "../../recoil";
import { useRecoilState } from "recoil";
import { playMessage, speechRecognizer } from "../../utils/speech";
import { SEND_MESSAGE_ENDPOINT } from "../../backendEndpoints";
import { fetchSession } from "../../utils/sessionsService";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import { useDisclosure } from "@mantine/hooks";
import { mockChatHistory } from "../../mock_data/mockChatHistoryData";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export const Route = new FileRoute(
  "/_layout_no_sidebar/sessions/run/$sessionId"
).createRoute({
  loader: async ({ params: { sessionId }, context }) =>
    fetchSession(sessionId, context.auth.getUserId()),
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      notifications.show({
        color: "yellow",
        title: "Unauthorized",
        message: "You are not authorized yet, please login first",
      });
      throw redirect({
        to: "/",
      });
    }
  },
});

type Message = {
  role: string;
  message: string;
};

function SessionComponent() {
  const session = Route.useLoaderData();
  const navigate = useNavigate();

  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [recognizing, setRecognizing] = useRecoilState(isRecognizingState);
  const [userMessageCache, setUserMessageCache] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>(mockChatHistory);
  const [
    chatHistoryOpened,
    { open: openChatHistory, close: closeChatHistory },
  ] = useDisclosure(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const baseData = {
    user_id: "Azure",
    session_id: "a763d853-4345-4017-8265-2151c63c67ba",
    // session_id: session.session_data.id,
  };

  const openExitSessionModal = () =>
    modals.openConfirmModal({
      title: "Exit Session",
      centered: true,
      children: (
        <Text size="md">Are you sure you want to exit the session?</Text>
      ),

      labels: { confirm: "Exit Session", cancel: "Back" },
      confirmProps: { color: "blue" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => closeSession(),
    });

  const closeSession = () => {
    console.log("Closing session");
    return;
    // Run Joshua's code here to process the session
    navigate({
      to: "/sessions/analysis/$sessionId",
      params: { sessionId: session.session_data.id },
    });
  };

  const debouncedUserTalk = useDebounce(async (newRecognizedText: string) => {
    if (!newRecognizedText || newRecognizedText.length < 20) {
      return;
    }

    const userMsg = userMessageCache.join(" ") + " " + newRecognizedText;
    const data = {
      ...baseData,
      message: userMsg,
    };

    try {
      console.log(data);
      return;
      setRecognizing(false);
      handleUserMessage(userMsg);
      const res = await axios.post(SEND_MESSAGE_ENDPOINT, data);
      handleAssistantResponse(res.data.message);
    } catch (err) {
      console.log("Error", err);
    }
  }, 7500);

  const handleUserMessage = (userMsg: string) => {
    setChatHistory((chatHistory) => {
      chatHistory.push({
        role: "user",
        message: userMsg,
      });
      return chatHistory;
    });
    setUserMessage("");
  };

  const handleAssistantResponse = (asstResp: string) => {
    setAssistantMessage(asstResp);
    setChatHistory((chatHistory) => {
      chatHistory.push({
        role: "assistant",
        message: asstResp,
      });
      return chatHistory;
    });
    playMessage(asstResp, () => {
      setRecognizing(true);
      setAssistantMessage("");
    });
  };

  useEffect(() => {
    // const assistantStartMessage =
    //   session.session_data.transcripts[0].assistant.message;
    // setAssistantMessage(assistantStartMessage);
    // setRecognizing(false);
    // playMessage(assistantStartMessage, () => {
    //   setAssistantMessage("");
    //   setRecognizing(true);
    // });
    speechRecognizer.recognizing = (s, e) => {
      setUserMessage(e.result.text);
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };
    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        setUserMessage(e.result.text);
        setUserMessageCache((userMessageCache) => [
          ...userMessageCache,
          e.result.text,
        ]);
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

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <>
      <Navbar
        sx={{ position: "absolute", left: 0 }}
        w={"8rem"}
        p="xl"
        bg={"rgba(0, 0, 0, 0)"}
        withBorder={false}
      >
        <Navbar.Section>
          <TranscriptButton />
        </Navbar.Section>
        <Navbar.Section mt={"auto"}>
          <Stack m="auto" w="min-content">
            <NavbarLink
              icon={IconMessageCircle}
              tooltipLabel={"Chat History"}
              tooltipPosition="left"
              onClick={() => {
                openChatHistory();
                setTimeout(() => {
                  scrollRef?.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 500);
              }}
            />
            <NavbarLink
              icon={IconX}
              tooltipLabel={"Quit Session"}
              tooltipPosition="right"
              onClick={openExitSessionModal}
            />
          </Stack>
        </Navbar.Section>
      </Navbar>
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
      <Drawer
        opened={chatHistoryOpened}
        onClose={closeChatHistory}
        title={
          <Text size={"xl"} weight={600}>
            Chat History
          </Text>
        }
        position="right"
        overlayProps={{ opacity: 0 }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {chatHistory.map((msg, idx) => (
          <Box key={`chat-hist-${idx}`} mb={"md"}>
            <Text
              fw={"bold"}
              transform="uppercase"
              size={"sm"}
              sx={(theme) => ({
                color:
                  msg.role === "user"
                    ? theme.colors.convoscopeBlue
                    : theme.colors.blue[7],
              })}
            >
              {msg.role}
            </Text>
            <Box>{msg.message}</Box>
          </Box>
        ))}
        <div ref={scrollRef}></div>
      </Drawer>
    </>
  );
}
