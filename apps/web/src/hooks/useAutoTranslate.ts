/**
 * Auto-translate Hook
 * Automatically transcribes and translates speech without manual send
 */

import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedWords?: any[];
  pronunciation?: any;
}

interface UseAutoTranslateOptions {
  sourceLang?: "th" | "en" | "auto";
  targetLang?: "th" | "en";
  autoTranslateDelay?: number; // ms before auto-translating
  onTranslation?: (result: TranslationResult) => void;
  onTranscription?: (text: string) => void;
}

export function useAutoTranslate({
  sourceLang = "auto",
  targetLang = "th",
  autoTranslateDelay = 500, // 500ms silence before auto-translate
  onTranslation,
  onTranscription,
}: UseAutoTranslateOptions = {}) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastResult, setLastResult] = useState<TranslationResult | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoTranslateEnabledRef = useRef(false);

  // Enable/disable auto-translate mode
  const enableAutoTranslate = useCallback(() => {
    isAutoTranslateEnabledRef.current = true;
    console.log("Auto-translate mode enabled");
  }, []);

  const disableAutoTranslate = useCallback(() => {
    isAutoTranslateEnabledRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    console.log("Auto-translate mode disabled");
  }, []);

  const toggleAutoTranslate = useCallback(() => {
    if (isAutoTranslateEnabledRef.current) {
      disableAutoTranslate();
    } else {
      enableAutoTranslate();
    }
    return isAutoTranslateEnabledRef.current;
  }, [enableAutoTranslate, disableAutoTranslate]);

  // Process audio for auto-translate
  const processAudio = useCallback(
    async (audioBase64: string) => {
      if (!isAutoTranslateEnabledRef.current) {
        return null;
      }

      setIsTranslating(true);

      try {
        // Step 1: Transcribe
        const sttResult = await api.speechToText(audioBase64, sourceLang);
        const text = sttResult.text;

        if (!text || text.trim().length === 0) {
          setIsTranslating(false);
          return null;
        }

        // Call transcription callback
        if (onTranscription) {
          onTranscription(text);
        }

        // Step 2: Translate
        const translateResult = await api.language.translateText(
          text,
          sourceLang === "auto" ? "en" : sourceLang,
          targetLang
        );

        const result: TranslationResult = {
          originalText: text,
          translatedText: translateResult.translated_text,
          sourceLang: translateResult.source_lang,
          targetLang: translateResult.target_lang,
        };

        setLastResult(result);

        // Call translation callback
        if (onTranslation) {
          onTranslation(result);
        }

        return result;
      } catch (error) {
        console.error("Auto-translate error:", error);
        return null;
      } finally {
        setIsTranslating(false);
      }
    },
    [sourceLang, targetLang, onTranscription, onTranslation]
  );

  // Handle interim transcription (for real-time display)
  const handleInterimTranscript = useCallback((text: string) => {
    setInterimTranscript(text);

    // Clear existing timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Set new timer for auto-translate
    if (isAutoTranslateEnabledRef.current && text.trim().length > 0) {
      silenceTimerRef.current = setTimeout(() => {
        // Speech paused, finalize transcript
        setFinalTranscript(text);
        setInterimTranscript("");
      }, autoTranslateDelay);
    }
  }, [autoTranslateDelay]);

  // Handle final transcription
  const handleFinalTranscript = useCallback(async (audioBase64: string, text: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setFinalTranscript(text);
    setInterimTranscript("");

    // Auto-translate if enabled
    if (isAutoTranslateEnabledRef.current) {
      await processAudio(audioBase64);
    }
  }, [processAudio]);

  // Clear results
  const clearResults = useCallback(() => {
    setLastResult(null);
    setFinalTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isTranslating,
    lastResult,
    interimTranscript,
    finalTranscript,
    isAutoTranslateEnabled: isAutoTranslateEnabledRef.current,
    enableAutoTranslate,
    disableAutoTranslate,
    toggleAutoTranslate,
    processAudio,
    handleInterimTranscript,
    handleFinalTranscript,
    clearResults,
  };
}
