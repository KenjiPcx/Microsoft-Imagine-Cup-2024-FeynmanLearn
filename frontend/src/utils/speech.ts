import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  SpeakerAudioDestination,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = SpeechConfig.fromSubscription(
  import.meta.env.VITE_AZURE_SPEECH_KEY,
  import.meta.env.VITE_AZURE_SPEECH_REGION
);
speechConfig.speechSynthesisVoiceName = "en-US-JaneNeural";
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

export const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
speechRecognizer.sessionStopped = (s, e) => {
  console.log("\nSession stopped event.");
  speechRecognizer.stopContinuousRecognitionAsync();
};

export const playMessage = (message: string, onAudioEnd: () => void) => {
  const player = new SpeakerAudioDestination();
  player.onAudioEnd = onAudioEnd;
  const audioConfig = AudioConfig.fromSpeakerOutput(player);
  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
  speechSynthesizer?.speakTextAsync(message, () => {
    speechSynthesizer.close();
  });
};
