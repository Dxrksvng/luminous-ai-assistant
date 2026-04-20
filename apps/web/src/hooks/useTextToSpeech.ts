/**
 * Text to Speech Hook
 * Uses Web Speech API for TTS
 */

import { useState, useCallback, useRef, useEffect } from "react";

interface UseTextToSpeechOptions {
  language?: "th-TH" | "en-US";
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
  userName?: string;
  persona?: "friendly" | "assistant" | "professional";
}

export function useTextToSpeech({
  language = "th-TH",
  rate = 1,
  pitch = 1,
  onEnd,
  onError,
  userName = "",
  persona = "friendly",
}: UseTextToSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  // Voice persona configurations
  const personaConfigs = {
    friendly: {
      pitch: 1.1,      // Slightly higher for female voice
      rate: 0.95,     // Slightly slower for more natural feel
    },
    assistant: {
      pitch: 1.0,
      rate: 1.0,
    },
    professional: {
      pitch: 1.05,
      rate: 1.0,
    },
  };

  // Initialize TTS and load voices
  const initTTS = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return window.speechSynthesis;
    }
    return null;
  }, []);

  // Get best female voice for the language
  const getBestVoice = useCallback(() => {
    const synthesis = initTTS();
    if (!synthesis) return null;

    const voices = synthesis.getVoices();
    const langPrefix = language.split("-")[0];

    // Priority: Thai female -> Thai voice -> English female -> Any voice
    const voicePriority = [
      // Thai female voices
      ...voices.filter(v => v.lang === "th-TH" && (v.name.toLowerCase().includes("female") || v.name.includes("สาว"))),
      // Thai voices
      ...voices.filter(v => v.lang === "th-TH"),
      // Female voices in the language
      ...voices.filter(v => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes("female")),
      // Any voice in the language
      ...voices.filter(v => v.lang.startsWith(langPrefix)),
    ];

    return voicePriority[0] || null;
  }, [language, initTTS]);

  // Load voices on mount
  useEffect(() => {
    const synthesis = initTTS();
    if (synthesis) {
      const loadVoices = () => {
        const voices = synthesis.getVoices();
        if (voices.length > 0) {
          voicesLoadedRef.current = true;
        }
      };

      loadVoices();
      synthesis.onvoiceschanged = loadVoices;
    }
  }, [initTTS]);

  // Speak text
  const speak = useCallback(
    (text: string) => {
      const synthesis = initTTS();
      if (!synthesis) {
        setIsSupported(false);
        if (onError) onError("TTS not supported");
        return;
      }

      // Cancel any ongoing speech
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      // Apply persona settings
      const config = personaConfigs[persona];
      utterance.pitch = pitch * config.pitch;
      utterance.rate = rate * config.rate;

      // Set best available voice
      const bestVoice = getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Natural pauses - add pauses at common Thai punctuation
      let processedText = text;
      processedText = processedText.replace(/[?。？]/g, '?...');
      processedText = processedText.replace(/[!！]/g, '!...');
      processedText = processedText.replace(/[，,]/g, ',...');
      utterance.text = processedText;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.error("TTS error:", event.error);
        setIsSpeaking(false);
        if (onError) onError(event.error);
      };

      utteranceRef.current = utterance;
      synthesis.speak(utterance);
    },
    [language, rate, pitch, onEnd, onError, initTTS, persona, getBestVoice, personaConfigs]
  );

  // Stop speaking
  const stop = useCallback(() => {
    const synthesis = initTTS();
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, [initTTS]);

  // Get available voices
  const getVoices = useCallback(() => {
    const synthesis = initTTS();
    if (!synthesis) return [];

    return synthesis.getVoices().filter((voice) =>
      voice.lang.startsWith(language.split("-")[0])
    );
  }, [language, initTTS]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    getVoices,
  };
}
