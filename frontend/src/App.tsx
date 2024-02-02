import { useEffect, useState } from "react";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
  ResultReason,
  SpeakerAudioDestination,
} from "microsoft-cognitiveservices-speech-sdk";
import { useDebounce } from "./utils/hooks";
import axios from "axios";
import duck from "./assets/duck-gpt-trans.png";
import "./App.css";

import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import { isRecognizingState } from "./recoil";

const speechConfig = SpeechConfig.fromSubscription(
  import.meta.env.VITE_AZURE_SPEECH_KEY,
  import.meta.env.VITE_AZURE_SPEECH_REGION
);
speechConfig.speechSynthesisVoiceName = "en-US-JaneNeural";

const baseUrl = import.meta.env.VITE_REACT_APP_FUNCTION_BASE_URL;
const sendMessageEndpoint = `${baseUrl}/api/send_message`;
const stopSpeakingEndpoint = `${baseUrl}/api/stop_speaking`;

function App() {
  const [message, setMessage] = useState("User message");
  const [assistantMessage, setAssistantMessage] = useState("Assistant message");
  const [recognizer, setRecognizer] = useState<SpeechRecognizer>();
  const [isRecognizing, setIsRecognizing] = useRecoilState(isRecognizingState);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageIdx, setMessageIdx] = useState(0);

  const toggleisRecognizing = () => {
    if (isRecognizing) {
      recognizer?.stopContinuousRecognitionAsync();
      setIsRecognizing(false);
    } else {
      recognizer?.startContinuousRecognitionAsync();
      setIsRecognizing(true);
    }
  };

  const playMessage = (message: string) => {
    const player = new SpeakerAudioDestination();
    player.onAudioEnd = () => {
      console.log("Audio ended");
      setIsRecognizing(true);
      const data = {
        user_id: "KenjiPcx",
        session_id: "3dbf279a-0f4e-4616-a78f-262c0b54256f",
      };
      axios.post(stopSpeakingEndpoint, data);
    };
    const audioConfig = AudioConfig.fromSpeakerOutput(player);
    const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    speechSynthesizer?.speakTextAsync(message, () => {
      speechSynthesizer.close();
    });
  };

  const debouncedSendMessages = useDebounce(async () => {
    if (messages.length === 0) return;
    console.log("Message idx", messageIdx);
    console.log("Send messages", messages.slice(messageIdx));

    const data = {
      user_id: "KenjiPcx",
      session_id: "3dbf279a-0f4e-4616-a78f-262c0b54256f",
      message: messages.slice(messageIdx).join(" "),
    };

    setMessageIdx(messages.length);

    try {
      setIsRecognizing(false);
      const res = await axios.post(sendMessageEndpoint, data);
      console.log("Response", res);
      setIsRecognizing(false);
      setAssistantMessage(res.data.message);
      setEmotion(res.data.emotion);
      setInnerThoughts(res.data.inner_thoughts);
      playMessage(res.data.message);
    } catch (err) {
      console.log("Error", err);
    }
  }, 10000);

  const initSpeech = () => {
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
    speechRecognizer.isRecognizing = (s, e) => {
      console.log(`isRecognizing: Text=${e.result.text}`);
    };
    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        setMessage(e.result.text);
        setMessages((messages) => [...messages, e.result.text]);
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      }
    };
    speechRecognizer.sessionStopped = (s, e) => {
      console.log("\nSession stopped event.");
      speechRecognizer.stopContinuousRecognitionAsync();
    };
    setRecognizer(speechRecognizer);
  };

  useEffect(() => {
    initSpeech();
    return () => {
      recognizer?.close();
      debouncedSendMessages.cancel();
    };
  }, []);

  // useEffect(() => {
  //   // console.log("Messages", messages);
  //   debouncedSendMessages();
  // }, [messages]);

  useEffect(() => {
    console.log(emotion);
  }, [emotion]);
  useEffect(() => {
    console.log(innerThoughts);
  }, [innerThoughts]);

  return (
    <>
      <p>{assistantMessage}</p>
      <img alt="duck" src={duck} />
      <button onClick={toggleisRecognizing}>
        {isRecognizing ? "Stop" : "Start"}
      </button>
      <p>{message}</p>
    </>
  );
}

export default App;
function useRecoilState(isRecognizingState: any): [any, any] {
  throw new Error("Function not implemented.");
}
