/**
 * Voice Recognition Hook
 * Uses Web Speech API for STT
 */

import { useState, useRef, useCallback } from "react";

interface UseVoiceRecognitionOptions {
  language?: "th-TH" | "en-US";
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecognition({
  language = "th-TH",
  continuous = false,
  onResult,
  onError,
}: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return null;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript && onResult) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (onError) {
          onError(event.error);
        }
      };

      return recognition;
    }
    return null;
  }, [language, continuous, onResult, onError]);

  // Start listening
  const startListening = useCallback(() => {
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
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

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    setTranscript,
  };
}
