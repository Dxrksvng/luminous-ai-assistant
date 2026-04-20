/**
 * Background Voice Service Hook
 * Always listening in background - no button presses needed!
 */

import { useState, useCallback, useRef, useEffect } from "react";

interface UseBackgroundVoiceOptions {
  wakeWords?: string[];
  onWake?: (detectedWord: string) => void;
  onTranscript?: (transcript: string) => void;
  language?: "th-TH" | "en-US";
  autoTranslate?: boolean;
  onTranslation?: (original: string, translated: string) => void;
}

export function useBackgroundVoice({
  wakeWords = ["ลูมินัส", "Luminas", "Hey Luminas", "เฮย์ ลูมินัส"],
  onWake,
  onTranscript,
  language = "th-TH",
  autoTranslate = false,
  onTranslation,
}: UseBackgroundVoiceOptions = {}) {
  const [isActive, setIsActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [lastWakeWord, setLastWakeWord] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "translating">("idle");

  const recognitionRef = useRef<any>(null);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptBufferRef = useRef<string[]>([]);
  const lastWakeTimeRef = useRef<number>(0);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

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
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("listening");
      console.log("🎧 Background voice listening started");
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still active
      if (isActive) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log("Already started");
          }
        }, 100);
      }
    };

    recognition.onerror = (event: any) => {
      // "aborted" and "no-speech" are normal lifecycle events, not errors
      if (event.error !== "aborted" && event.error !== "no-speech") {
        console.error("Voice recognition error:", event.error);
      }
      if (event.error === "not-allowed") {
        console.warn("⚠️ Microphone permission denied");
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

      const fullText = finalTranscript || interimTranscript;

      // Send interim transcript
      if (onTranscript && interimTranscript) {
        onTranscript(fullText);
      }

      // Check for wake word
      const detected = checkWakeWords(fullText.toLowerCase(), wakeWords);
      if (detected) {
        handleWakeWord(detected);
      }

      // Auto-translate if enabled and final transcript
      if (autoTranslate && finalTranscript && onTranslation) {
        handleTranslation(finalTranscript);
      }

      return fullText;
    };

    return recognition;
  }, [language, wakeWords, isActive, onTranscript, autoTranslate, onTranslation]);

  // Check for wake words
  const checkWakeWords = useCallback(
    (transcript: string, words: string[]) => {
      for (const word of words) {
        const lowerWord = word.toLowerCase();
        if (transcript.includes(lowerWord)) {
          const confidence = transcript.endsWith(lowerWord) ? 1.0 : 0.8;
          return { word, confidence };
        }
      }
      return null;
    },
    []
  );

  // Handle wake word detection
  const handleWakeWord = useCallback(
    (detected: { word: string; confidence: number }) => {
      const now = Date.now();

      // Debounce - prevent multiple triggers
      if (now - lastWakeTimeRef.current < 2000) {
        return; // Ignore if triggered within 2 seconds
      }

      lastWakeTimeRef.current = now;
      setLastWakeWord(detected.word);
      setConfidence(detected.confidence);
      setStatus("processing");

      console.log("✨ Wake word detected:", detected.word);

      // Clear after 3 seconds
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
      wakeWordTimeoutRef.current = setTimeout(() => {
        setLastWakeWord("");
        setConfidence(0);
        setStatus("listening");
      }, 3000);

      // Trigger callback
      if (onWake) {
        onWake(detected.word);
      }
    },
    [onWake]
  );

  // Handle translation
  const handleTranslation = useCallback(
    async (text: string) => {
      setStatus("translating");

      try {
        // Call translation API
        const response = await fetch("/api/language/translate/text", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const result = await response.json();
          if (onTranslation) {
            onTranslation(text, result.translated_text);
          }
        }
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setTimeout(() => setStatus("listening"), 500);
      }
    },
    [onTranslation]
  );

  // Start listening on mount
  useEffect(() => {
    const recognition = initRecognition();
    if (recognition) {
      try {
        recognitionRef.current = recognition;
        recognition.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore stop errors
        }
      }
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
    };
  }, [initRecognition]);

  // Manual stop/start
  const stopListening = useCallback(() => {
    setIsActive(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setIsActive(true);
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

  const toggleListening = useCallback(() => {
    if (isActive) {
      stopListening();
    } else {
      startListening();
    }
  }, [isActive, stopListening, startListening]);

  return {
    isActive,
    isListening,
    lastWakeWord,
    confidence,
    status,
    startListening,
    stopListening,
    toggleListening,
  };
}
