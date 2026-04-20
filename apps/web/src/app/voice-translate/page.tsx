"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { VoiceOverlay } from "@/components/voice-overlay";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useWakeWord } from "@/hooks/useWakeWord";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { api } from "@/lib/api";
import { Mic, Languages, Sparkles, Volume2, Play, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationHistory {
  id: string;
  originalText: string;
  translatedText: string;
  timestamp: number;
}

export default function VoiceTranslatePage() {
  const [currentView, setCurrentView] = useState("voice-translate");

  // Settings
  const [sourceLang, setSourceLang] = useState<"th" | "en" | "auto">("auto");
  const [targetLang, setTargetLang] = useState<"th" | "en">("th");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Translation history
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Wake word detection
  const {
    isListening: wakeWordListening,
    lastDetectedWord,
    toggleListening: toggleWakeWord,
  } = useWakeWord({
    wakeWords: ["Hey Luminas", "ลูมินัส", "Luminas", "Hey ลูมินัส"],
    language: sourceLang === "en" ? "en-US" : "th-TH",
    onWake: (word) => {
      console.log("Wake word detected:", word);
      // Auto-enable auto-translate when wake word detected
      enableAutoTranslate();
    },
  });

  // Voice recognition for input
  const {
    isListening: sttListening,
    transcript,
    toggleListening: toggleSTT,
    setTranscript,
  } = useVoiceRecognition({
    language: sourceLang === "en" ? "en-US" : "th-TH",
    continuous: true,
    onResult: (text) => {
      if (autoTranslateEnabled) {
        handleAutoTranslate(text);
      }
    },
  });

  // Auto-translate
  const {
    isTranslating,
    lastResult,
    isAutoTranslateEnabled,
    enableAutoTranslate,
    disableAutoTranslate,
    toggleAutoTranslate,
    clearResults,
  } = useAutoTranslate({
    sourceLang,
    targetLang,
    onTranslation: (result) => {
      // Add to history
      const newEntry: TranslationHistory = {
        id: generateId(),
        originalText: result.originalText,
        translatedText: result.translatedText,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 50));

      // Speak if voice enabled
      if (voiceEnabled) {
        speak(result.translatedText);
      }
    },
  });

  // Text to speech
  const { speak, isSpeaking } = useTextToSpeech({
    language: targetLang === "en" ? "en-US" : "th-TH",
  });

  // Handle auto-translate
  const handleAutoTranslate = async (text: string) => {
    // Check if we need to transcribe first
    // For now, assume text comes from recognition
  };

  // Manual translate
  const handleManualTranslate = async () => {
    if (!transcript.trim()) return;

    try {
      const result = await api.language.translateText(
        transcript,
        sourceLang === "auto" ? "en" : sourceLang,
        targetLang
      );

      const newEntry: TranslationHistory = {
        id: generateId(),
        originalText: transcript,
        translatedText: result.translated_text,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 50));

      if (voiceEnabled) {
        speak(result.translated_text);
      }

      setTranscript("");
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    clearResults();
  };

  // Switch languages
  const swapLanguages = () => {
    if (sourceLang !== "auto") {
      setSourceLang(targetLang);
      setTargetLang(sourceLang as "th" | "en");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto hologram-grid p-6 relative">
          {/* Voice Overlay */}
          <VoiceOverlay
            isListening={wakeWordListening}
            isAutoTranslateEnabled={isAutoTranslateEnabled}
            isTranslating={isTranslating}
            lastDetectedWord={lastDetectedWord}
            lastTranslation={lastResult ? {
              originalText: lastResult.originalText,
              translatedText: lastResult.translatedText,
            } : undefined}
            wakeWordDetected={!!lastDetectedWord}
            onToggleAutoTranslate={toggleAutoTranslate}
            onToggleListening={() => {
              toggleWakeWord();
              if (!wakeWordListening) {
                toggleSTT();
              } else {
                // Stop both
                disableAutoTranslate();
              }
            }}
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold hologram-text flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                  Voice Translate
                </h1>
                <p className="text-muted-foreground mt-2">
                  พูดแล้วแปลภาษาอัตโนมัติ | Speak and auto-translate
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={cn(
                    "h-8",
                    !voiceEnabled && "opacity-50"
                  )}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Language Settings */}
            <Card className="hologram-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Source</Badge>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value as any)}
                      className="bg-transparent border border-primary/30 rounded px-3 py-1.5 text-sm"
                    >
                      <option value="auto">Auto Detect</option>
                      <option value="th">ไทย (Thai)</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={swapLanguages}
                    disabled={sourceLang === "auto"}
                  >
                    <Languages className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Badge variant="hologram">Target</Badge>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value as "th" | "en")}
                      className="bg-transparent border border-primary/30 rounded px-3 py-1.5 text-sm"
                    >
                      <option value="th">ไทย (Thai)</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAutoTranslateEnabled && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      Auto-translate ON
                    </Badge>
                  )}
                  {wakeWordListening && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      Wake word active
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Live Transcript */}
            <Card className="hologram-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  Live Transcript
                </h2>
                {sttListening && (
                  <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                    Recording...
                  </Badge>
                )}
              </div>
              <div className="min-h-[100px] bg-background/50 rounded-lg p-4">
                <p className="text-lg">
                  {transcript || (
                    <span className="text-muted-foreground">
                      กดปุ่มไมค์หรือพูด "Hey Luminas" เพื่อเริ่ม...
                      <br />
                      Click mic or say "Hey Luminas" to start...
                    </span>
                  )}
                </p>
                <AnimatePresence>
                  {sttListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-1 mt-3"
                    >
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant={sttListening ? "destructive" : "default"}
                  onClick={toggleSTT}
                  className={cn(
                    "rounded-full",
                    !sttListening && "hologram-glow"
                  )}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {sttListening ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleManualTranslate}
                  disabled={!transcript.trim() || isTranslating}
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </Button>
              </div>
            </Card>

            {/* Translation History */}
            <Card className="hologram-card">
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <h2 className="font-semibold flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  Translation History
                </h2>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <ScrollArea className="max-h-[400px]">
                <div className="p-4 space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Languages className="h-12 w-12 mx-auto mb-4 text-primary/30" />
                      <p>ยังไม่มีประวัติการแปล</p>
                      <p className="text-sm">No translation history yet</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background/50 rounded-lg p-3"
                      >
                        <div className="space-y-2">
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              Original
                            </Badge>
                            <p className="text-sm">{item.originalText}</p>
                          </div>
                          <div className="w-full h-px bg-primary/20" />
                          <div>
                            <Badge variant="hologram" className="text-xs mb-1">
                              Translated
                            </Badge>
                            <p className="text-sm text-primary font-medium">
                              {item.translatedText}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString("th-TH", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => speak(item.translatedText)}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleCopy(item.translatedText, item.id)}
                              >
                                {copiedId === item.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
