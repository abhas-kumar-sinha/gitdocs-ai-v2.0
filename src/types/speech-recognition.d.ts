export {};

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;

    start(): void;
    stop(): void;
    abort(): void;

    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  }

  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}
