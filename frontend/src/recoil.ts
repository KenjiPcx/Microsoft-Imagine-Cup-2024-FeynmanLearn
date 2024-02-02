import { atom, selector } from "recoil";
import { SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
/**
 * Type guard for Recoil's Default Value type.
 */
// const isRecoilDefaultValue = (val: unknown): val is DefaultValue => {
//   return val instanceof DefaultValue;
// };

export const isRecognizingState = atom<boolean>({
  key: "isRecognizing",
  default: false,
});
