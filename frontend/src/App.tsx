import { useEffect, useState } from "react";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { useDebounce } from "./hooks";
import axios from "axios";
import duck from "./assets/duck-gpt-trans.png";
import "./App.css";

const speechConfig = SpeechConfig.fromSubscription(
  import.meta.env.VITE_AZURE_SPEECH_KEY,
  import.meta.env.VITE_AZURE_SPEECH_REGION
);

const sendMessageEndpoint = `${
  import.meta.env.VITE_REACT_APP_FUNCTION_BASE_URL
}/api/send_message`;

function App() {
  const [message, setMessage] = useState("Hello world");
  const [recognizer, setRecognizer] = useState<SpeechRecognizer>();
  const [recognizing, setRecognizing] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageIdx, setMessageIdx] = useState(0);

  const startRecognizing = () => {
    recognizer?.startContinuousRecognitionAsync();
    setRecognizing(true);
  };

  const stopRecognizing = () => {
    recognizer?.stopContinuousRecognitionAsync();
    setRecognizing(false);
  };

  const toggleRecognizing = () => {
    if (recognizing) {
      stopRecognizing();
    } else {
      startRecognizing();
    }
  };

  const debouncedSendMessages = useDebounce(async () => {
    if (messages.length === 0) return;
    console.log("Message idx", messageIdx);
    console.log("Send messages", messages.slice(messageIdx));

    const data = {
      user_id: "test_user",
      message: messages.slice(messageIdx).join(" "),
    };

    setMessageIdx(messages.length);

    try {
      const res = await axios.post(sendMessageEndpoint, data);
      console.log("Response", res);
    } catch (err) {
      console.log("Error", err);
    }
  }, 10000);

  const initRecognizer = () => {
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    recognizer.recognized = (s, e) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        setMessage(e.result.text);
        setMessages((messages) => [...messages, e.result.text]);
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      }
    };
    recognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      recognizer.stopContinuousRecognitionAsync();
    };
    setRecognizer(recognizer);
  };

  useEffect(() => {
    initRecognizer();
    return () => {
      recognizer?.close();
      debouncedSendMessages.cancel();
    };
  }, []);

  useEffect(() => {
    // console.log("Messages", messages);
    debouncedSendMessages();
  }, [messages]);

  return (
    <>
      <p>{message}</p>
      <button onClick={toggleRecognizing}>
        {recognizing ? "Stop" : "Start"}
      </button>
      <img alt="duck" src={duck} />
    </>
  );
}

export default App;
