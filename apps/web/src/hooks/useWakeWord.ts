/**
 * Wake Word Detection Hook
 * Listens for wake words to activate Luminas
 */

import { useState, useCallback, useRef, useEffect } from "react";

interface UseWakeWordOptions {
  wakeWords?: string[];
  sensitivity?: number;
  onWake?: (detectedWord: string) => void;
  language?: "th-TH" | "en-US";
}

export function useWakeWord({
  wakeWords = ["Hey Luminas", "ลูมินัส", "Luminas"],
  sensitivity = 0.7,
  onWake,
  language = "th-TH",
}: UseWakeWordOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectedWord, setLastDetectedWord] = useState("");
  const [confidence, setConfidence] = useState(0);

  const recognitionRef = useRef<any>(null);
  const transcriptBufferRef = useRef<string[]>([]);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        return null;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        console.log("Wake word detection started");
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if we want continuous listening
        if (isListening) {
          setTimeout(() => {
            recognition.start();
          }, 100);
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        const fullText = (finalTranscript + interimTranscript).trim();

        // Check for wake words
        const detected = checkWakeWords(fullText, wakeWords);
        if (detected) {
          setLastDetectedWord(detected.word);
          setConfidence(detected.confidence);
          setIsProcessing(true);

          if (onWake) {
            onWake(detected.word);
          }

          // Clear buffer after detection
          transcriptBufferRef.current = [];
          setTimeout(() => setIsProcessing(false), 2000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Wake word detection error:", event.error);
        if (event.error === "not-allowed") {
          console.warn("Microphone permission denied");
        }
      };

      return recognition;
    }
    return null;
  }, [language, wakeWords, isListening, onWake]);

  // Check if transcript contains wake word
  const checkWakeWords = useCallback(
    (transcript: string, words: string[]) => {
      const lowerText = transcript.toLowerCase();

      for (const word of words) {
        const lowerWord = word.toLowerCase();
        if (lowerText.includes(lowerWord)) {
          // Calculate confidence based on how close the match is
          const index = lowerText.indexOf(lowerWord);
          const matchLength = lowerWord.length;
          const confidence = Math.min(1, (index === 0 ? 1 : 0.8));

          return {
            word,
            confidence,
          };
        }
      }

      return null;
    },
    []
  );

  // Start listening
  const startListening = useCallback(() => {
    const recognition = initRecognition();
    if (recognition) {
      try {
        recognitionRef.current = recognition;
        recognition.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  }, [initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Auto-start on mount if wake words are configured
  useEffect(() => {
    if (wakeWords.length > 0) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [wakeWords.length, startListening, stopListening]);

  // Hotkey support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+L or Cmd+L to toggle
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        toggleListening();
      }

      // Spacebar to quickly activate
      if (!event.repeat && event.code === "Space" && event.ctrlKey) {
        event.preventDefault();
        if (onWake) {
          onWake("hotkey");
          setLastDetectedWord("hotkey");
          setConfidence(1);
          setTimeout(() => setLastDetectedWord(""), 2000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleListening, onWake]);

  return {
    isListening,
    isProcessing,
    lastDetectedWord,
    confidence,
    startListening,
    stopListening,
    toggleListening,
  };
}
