// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  Drawer,
  Modal,
  Navbar,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import TranscriptButton from "../../components/TranscriptButton";
import { NavbarLink } from "../../components/NavbarLink";
import {
  IconCheck,
  IconCross,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../utils/hooks";
import { isRecognizingState } from "../../recoil";
import { useRecoilState } from "recoil";
import { playMessage, speechRecognizer } from "../../utils/speech";
import {
  CREATE_POST_SESSION_ANALYSIS,
  SEND_MESSAGE_ENDPOINT,
} from "../../backendEndpoints";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import { useDisclosure } from "@mantine/hooks";
import { mockChatHistory } from "../../mock_data/mockChatHistoryData";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import CountdownTimer from "../../components/Countdown";
import { SendMessageResponse } from "../../utils/sessionsService";
import SessionIntroGuide from "../../components/SessionIntroGuide";

export const Route = createLazyFileRoute(
  "/_layout_no_sidebar/sessions/run/$sessionId"
)({
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

type Message = {
  role: string;
  message: string;
};

function SessionComponent() {
  const session = Route.useLoaderData();
  const navigate = useNavigate();
  const startTime = new Date().getTime();

  const [introDone, setIntroDone] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [recognizing, setRecognizing] = useRecoilState(isRecognizingState);
  const [userMessageCache, setUserMessageCache] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [assistantEmotion, setAssistantEmotion] = useState<
    "happy" | "neutral" | "confused"
  >("neutral");
  const [conceptUnderstood, setConceptUnderstood] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [
    chatHistoryOpened,
    { open: openChatHistory, close: closeChatHistory },
  ] = useDisclosure(false);
  const [introModalOpened, { open: openIntroModal, close: closeIntroModal }] =
    useDisclosure(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const baseData = {
    // user_id: "KenjiPcx",
    // session_id: "fae5f009-7599-4740-9fbf-f79d7355071b",
    user_id: session.session_data.user_id,
    session_id: session.session_data.id,
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
      onConfirm: async () => {
        await closeSession("user_quit");
      },
    });

  const closeSession = async (termination_reason: string) => {
    console.log("Closing session");
    setPauseTimer(true);
    const session_duration = new Date().getTime() - startTime;
    // return;

    try {
      const notificationId = "process-session";
      const data = {
        ...baseData,
        termination_reason,
        session_duration,
      };
      notifications.show({
        id: notificationId,
        loading: true,
        title: "Analyzing session",
        message:
          "Session is being processed, this may take a minute, feel free to grab a coffee, don't close this tab",
        autoClose: false,
        withCloseButton: false,
      });
      const res = await axios.post(CREATE_POST_SESSION_ANALYSIS, data);
      if (res.status === 200) {
        notifications.update({
          id: notificationId,
          color: "teal",
          title: "Analysis Completed",
          message: "Redirecting to the analysis page",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate({
            to: "/sessions/analysis/$sessionId",
            params: { sessionId: session.session_data.id },
          });
        }, 3000);
        return;
      }
      notifications.update({
        id: notificationId,
        color: "red",
        title: "Error",
        message: "Error processing the session, please try again later",
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error processing the session, please try again later",
      });
    }
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
      // return;
      setRecognizing(false);
      handleUserMessage(userMsg);
      const notificationId = "send-message";
      notifications.show({
        id: notificationId,
        loading: true,
        title: "Agent is thinking",
        message:
          "Agent is processing your lesson, give it a quick break, it should take a few seconds",
        autoClose: false,
        withCloseButton: false,
      });
      const res = await axios.post<SendMessageResponse>(
        SEND_MESSAGE_ENDPOINT,
        data
      );
      if (res.status === 200) {
        notifications.update({
          id: notificationId,
          color: "teal",
          title: "Agent has got a response",
          message: "Agent is gonna speak now",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
        handleAssistantResponse(res.data);
      } else {
        notifications.update({
          id: notificationId,
          color: "red",
          title: "Error processing",
          message: "There is a bug, please contact developer",
          icon: <IconCross size="1rem" />,
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.log("Error", err);
    }
  }, 4000);

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

  const handleAssistantResponse = (asstResp: SendMessageResponse) => {
    const {
      message,
      concept_understood: understood,
      question,
      emotion,
    } = asstResp;

    setAssistantMessage(message);
    setAssistantEmotion(emotion);
    setQuestions((questions) => [...questions, question]);
    setChatHistory((chatHistory) => {
      chatHistory.push({
        role: "assistant",
        message: message,
      });
      return chatHistory;
    });
    playMessage(message, () => {
      setRecognizing(true);
      setAssistantMessage("");
      if (understood) {
        notifications.show({
          title: "Concept Understood",
          message: "Student has understood the concept, ending the session",
          color: "green",
        });
        closeSession("concept_understood");
      }
    });
  };

  // const handleSideQuestionChainProcess = async () => {
  //   const lastQuestion = questions[questions.length - 1];
  //   const data = {
  //     ...baseData,
  //     message: lastQuestion,
  //   };

  //   try {
  //     const res = await axios.post<SendMessageResponse>(
  //       SEND_MESSAGE_ENDPOINT,
  //       data
  //     );
  //     handleAssistantResponse(res.data);
  //   } catch (err) {
  //     console.log("Error", err);
  //   }
  // };

  useEffect(() => {
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

    openIntroModal();

    return () => {
      debouncedUserTalk.cancel();
    };
  }, []);

  useEffect(() => {
    if (introDone) {
      const assistantStartMessage =
        session.session_data.session_transcripts[0].assistant.message;
      setAssistantMessage(assistantStartMessage);
      setRecognizing(false);
      chatHistory.push({
        role: "assistant",
        message: assistantStartMessage,
      });
      playMessage(assistantStartMessage, () => {
        setAssistantMessage("");
        setRecognizing(true);
      });
      notifications.show({
        title: "Session Started",
        message: "Session has started, you have 10 minutes",
        color: "green",
      });
    }
  }, [introDone]);

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
        <Text size={"lg"} align="center">
          {assistantMessage}
        </Text>
        <Text size={"xl"} align="center">
          {questions[questions.length - 1]}
        </Text>
        <Text size={"lg"} align="center">
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
      <Box p={"xl"} sx={{ position: "absolute", top: 0, right: 0 }}>
        {introDone && (
          <Stack>
            <CountdownTimer
              minutes={10}
              pauseTimer={pauseTimer}
              onTimeUp={async () => {
                notifications.show({
                  title: "Time's up",
                  message: "Session has ended",
                  color: "red",
                });
                await closeSession("timeout");
              }}
            />
            <Box>
              <Text size={"lg"} fw={"bold"}>
                Emotion:
              </Text>
              <Box>
                <Text
                  size={"xl"}
                  fw={"bold"}
                  color={
                    assistantEmotion === "happy"
                      ? "green"
                      : assistantEmotion === "confused"
                        ? "orange"
                        : "white"
                  }
                >
                  {assistantEmotion}
                </Text>
              </Box>
            </Box>
          </Stack>
        )}
      </Box>
      <Modal
        opened={introModalOpened}
        onClose={() => {
          closeIntroModal();
          setIntroDone(true);
        }}
        size="auto"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        title="Tutorial 🚀"
        centered
      >
        <SessionIntroGuide />
        <Box mt={"sm"} p={"xs"}>
          <Button
            w={"100%"}
            size="lg"
            onClick={() => {
              closeIntroModal();
              setIntroDone(true);
            }}
          >
            Start
          </Button>
        </Box>
      </Modal>
    </>
  );
}
