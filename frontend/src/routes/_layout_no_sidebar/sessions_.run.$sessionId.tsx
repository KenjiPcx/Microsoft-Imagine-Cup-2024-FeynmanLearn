// Here is where we run the teaching session
// Basically App.tsx is run here
// Send Message to student agent

import { FileRoute } from "@tanstack/react-router";
import { Box, Drawer, Navbar, ScrollArea, Stack, Text } from "@mantine/core";
import TranscriptButton from "../../components/TranscriptButton";
import { NavbarLink } from "../../components/NavbarLink";
import { IconMessageCircle, IconSettings } from "@tabler/icons-react";
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
import { useDisclosure } from "@mantine/hooks";

export const Route = new FileRoute(
  "/_layout_no_sidebar/sessions/run/$sessionId"
).createRoute({
  loader: async ({ params: { sessionId } }) => fetchSession(sessionId),
  errorComponent: SessionErrorComponent as any,
  component: SessionComponent,
});

type Message = {
  role: string;
  message: string;
};

const mockChatHistory = [
  {
    role: "user",
    message:
      "So, imagine you're spreading a drop of ink in a glass of water. That's similar to how diffusion models work in AI.",
  },
  {
    role: "assistant",
    message: "Interesting! How does the ink spread represent diffusion models?",
  },
  {
    role: "user",
    message:
      "The ink spreads out evenly, right? In diffusion models, we start with a random pattern and gradually add structure to it, much like the ink spreading but in reverse.",
  },
  {
    role: "assistant",
    message: "Oh, so it's like forming a clear picture from chaos?",
  },
  {
    role: "user",
    message:
      "Exactly! It’s a step-by-step process where we slowly shape noise into a detailed image or solution.",
  },
  {
    role: "assistant",
    message:
      "Got it! So, diffusion models help in creating things out of randomness?",
  },
  {
    role: "user",
    message:
      "Yes, and they're used for various applications like creating art or generating new ideas based on existing data.",
  },
  {
    role: "assistant",
    message: "That's really cool! How do we control what the model creates?",
  },
  {
    role: "user",
    message:
      "We can guide the model by training it on specific types of data, so it learns what kind of patterns to create.",
  },
  {
    role: "assistant",
    message: "Makes sense! So, the output depends on what it's been taught?",
  },
  {
    role: "user",
    message:
      "You're welcome! Another cool thing about diffusion models is their ability to generate new, original content that looks like it could have been real.",
  },
  {
    role: "assistant",
    message:
      "So, they can create things that don't exist? Like imagining a new kind of animal?",
  },
  {
    role: "user",
    message:
      "Exactly. By understanding the pattern of the data it's trained on, it can produce new examples that fit those patterns but are entirely unique.",
  },
  {
    role: "assistant",
    message:
      "That’s incredible! It’s like having an artist that can paint in any style after seeing a few examples.",
  },
  {
    role: "user",
    message:
      "Right, and that's why they're so powerful in creative fields. From art to music, they're opening up new possibilities for creation.",
  },
  {
    role: "assistant",
    message:
      "I can imagine so many applications. It must be exciting to work with such technology.",
  },
  {
    role: "user",
    message:
      "It really is. The potential is huge, and we're just scratching the surface of what's possible.",
  },
  {
    role: "assistant",
    message:
      "Thanks for teaching me about diffusion models. I feel like I understand them much better now.",
  },
];

function SessionComponent() {
  const session = Route.useLoaderData();

  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [recognizing, setRecognizing] = useRecoilState(isRecognizingState);
  const [userMessageCache, setUserMessageCache] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>(mockChatHistory);
  const [
    chatHistoryOpened,
    { open: openChatHistory, close: closeChatHistory },
  ] = useDisclosure(false);

  const baseData = {
    user_id: "Azure",
    session_id: "a763d853-4345-4017-8265-2151c63c67ba",
    // session_id: session.session_data.id,
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
              }}
            />
            <NavbarLink
              icon={IconSettings}
              tooltipLabel={"Settings"}
              tooltipPosition="right"
              active={false}
              onClick={() => {}}
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
          <Box>
            <Box>{msg.role}</Box>
            <Box>{msg.message}</Box>
          </Box>
        ))}
      </Drawer>
    </>
  );
}
