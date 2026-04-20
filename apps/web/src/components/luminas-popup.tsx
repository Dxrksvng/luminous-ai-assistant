"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackgroundVoice } from "@/hooks/useBackgroundVoice";
import { Mic, MicOff, Volume2, Languages, X, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn, generateId } from "@/lib/utils";
import { api } from "@/lib/api";

interface PopupMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  translated?: string;
  timestamp: number;
}

interface LuminasPopupProps {
  className?: string;
}

export function LuminasPopup({ className }: LuminasPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<PopupMessage[]>([]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sourceLang, setSourceLang] = useState<"th" | "en">("auto" as any);
  const [targetLang, setTargetLang] = useState<"th" | "en">("en");
  const [lastTranslation, setLastTranslation] = useState<{ original: string; translated: string } | null>(null);

  // Background voice service - ALWAYS LISTENING
  const {
    isActive,
    isListening,
    lastWakeWord,
    confidence,
    status,
  } = useBackgroundVoice({
    wakeWords: ["ลูมินัส", "Luminas", "Hey Luminas", "เฮย์ ลูมินัส"],
    language: sourceLang === "en" ? "en-US" : "th-TH",
    autoTranslate: true,
    onWake: (word) => {
      console.log("Wake word detected, showing popup:", word);
      setIsVisible(true);
      setIsExpanded(true);
    },
    onTranscript: (transcript) => {
      setInput(transcript);
    },
    onTranslation: async (original, translated) => {
      setLastTranslation({ original, translated });

      // Add to messages
      const newMessage: PopupMessage = {
        id: generateId(),
        type: "user",
        content: original,
        translated,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);

      // Speak if voice enabled
      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(translated);
        utterance.lang = targetLang === "en" ? "en-US" : "th-TH";
        window.speechSynthesis.speak(utterance);
      }
    },
  });

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      // Translate
      const result = await api.language.translateText(
        input,
        sourceLang === "auto" ? "en" : sourceLang,
        targetLang
      );

      // Add user message
      const userMsg: PopupMessage = {
        id: generateId(),
        type: "user",
        content: input,
        translated: result.translated_text,
        timestamp: Date.now(),
      };

      // Get AI response
      const aiResponse = await api.chat(input, undefined, targetLang);

      // Add AI message
      const aiMsg: PopupMessage = {
        id: generateId(),
        type: "assistant",
        content: aiResponse.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);

      // Speak AI response
      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.message);
        utterance.lang = targetLang === "en" ? "en-US" : "th-TH";
        window.speechSynthesis.speak(utterance);
      }

      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Close popup
  const handleClose = () => {
    setIsVisible(false);
    setIsExpanded(false);
  };

  // Minimize popup
  const handleMinimize = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating indicator - always shows if listening */}
      <AnimatePresence>
        {isListening && !isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div
              className="flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 cursor-pointer hover:bg-primary/30 transition-all"
              onClick={() => {
                setIsVisible(true);
                setIsExpanded(true);
              }}
            >
              {isListening ? (
                <Mic className="h-4 w-4 text-primary animate-pulse" />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Luminas พร้อมฟัง</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wake word popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center",
              className
            )}
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={cn(
                "bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl max-w-lg w-full mx-4",
                isExpanded ? "max-h-[80vh]" : "max-h-[300px]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full hologram-circle flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h2 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Luminas
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {lastWakeWord ? `พูดว่า "${lastWakeWord}"` : "ฉันอยู่ที่นี่ครับ"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isExpanded ? handleMinimize : () => setIsExpanded(true)}
                  >
                    {isExpanded ? <Brain className="h-4 w-4" /> : <Brain className="h-4 w-4 rotate-180" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20">
                <Badge className={cn(isListening ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                  {isListening ? "🎧 ฟังอยู่" : "🔇 หยุดฟัง"}
                </Badge>
                <Badge variant="outline">
                  {sourceLang} → {targetLang}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="h-6"
                >
                  {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <Volume2 className="h-3 w-3 opacity-50" />}
                </Button>
              </div>

              {/* Messages (only when expanded) */}
              <AnimatePresence>
                {isExpanded && messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-primary/20"
                  >
                    <ScrollArea className="h-[300px] p-4">
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2",
                              message.type === "user" ? "justify-end" : "justify-start"
                            )}
                          >
                            {message.type === "assistant" && (
                              <div className="h-8 w-8 rounded-full hologram-circle flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">🤖</span>
                              </div>
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg p-3",
                                message.type === "user"
                                  ? "bg-primary/20 border border-primary/30"
                                  : "bg-card/50 border border-primary/20"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              {message.translated && (
                                <>
                                  <div className="w-full h-px bg-primary/20 my-2" />
                                  <p className="text-sm text-primary">{message.translated}</p>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Last Translation */}
              <AnimatePresence>
                {lastTranslation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 border-b border-primary/20 bg-primary/5"
                  >
                    <div className="flex items-start gap-2">
                      <Languages className="h-4 w-4 text-primary mt-1" />
                      <div className="flex-1 space-y-1">
                        <div>
                          <span className="text-xs text-muted-foreground">Original: </span>
                          <span className="text-sm">{lastTranslation.original}</span>
                        </div>
                        <div>
                          <span className="text-xs text-primary">Translated: </span>
                          <span className="text-sm font-medium">{lastTranslation.translated}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input (only when expanded) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4"
                  >
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="พูดหรือพิมพ์..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          className="pr-10"
                        />
                        {isListening && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                      <Button onClick={handleSend} disabled={!input.trim()}>
                        <Languages className="h-4 w-4 mr-1" />
                        แปล
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer - Always visible */}
              <div className="p-4 text-center text-xs text-muted-foreground">
                พูด "ลูมินัส" หรือ "Luminas" เพื่อเรียก | Say "Luminas" to summon
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
