"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2, VolumeX, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn, generateId } from "@/lib/utils";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { api } from "@/lib/api";
import type { Message } from "@luminous/shared";

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "สวัสดีเจ้ ผมคือ Luminous — AI ส่วนตัวของเจ้ วันนี้เจ้อยากคุยเรื่องอะไร?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice recognition
  const {
    isListening,
    transcript,
    isSupported: sttSupported,
    toggleListening,
    setTranscript,
  } = useVoiceRecognition({
    language: "th-TH",
    onResult: (text) => {
      setInput(text);
    },
  });

  // Text to speech
  const { speak, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({
    language: "th-TH",
    onEnd: () => {
      // Ready for next input
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, transcript]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = input;
    setInput("");
    setTranscript("");
    setIsTyping(true);

    try {
      // Call API
      const response = await api.chat(userText, undefined, "th");

      const aiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
        metadata: {
          model: response.model,
          provider: response.provider,
        },
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak response if voice is enabled
      if (voiceEnabled && ttsSupported) {
        speak(response.message);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "ขอโทษครับ มีข้อผิดพลาดในการเชื่อมต่อ API กรุณาลองใหม่หรือตรวจสอบว่า backend ทำงานอยู่",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (!sttSupported) {
      alert("Browser does not support speech recognition");
      return;
    }
    toggleListening();
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const replayAudio = (text: string) => {
    if (ttsSupported) {
      speak(text);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Luminous Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className={cn(
              "h-8 px-2",
              !voiceEnabled && "opacity-50"
            )}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Badge variant="hologram">TH/EN Bilingual</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full hologram-circle flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-card/50 border border-primary/20"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {message.role === "assistant" && ttsSupported && voiceEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => replayAudio(message.content)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full hologram-circle flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-card/50 border border-primary/20 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-primary/20">
        {isListening && (
          <div className="mb-2 text-xs text-primary animate-pulse">
            🎧 กำลังฟัง... {transcript}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicClick}
            className={cn(
              isListening && "bg-primary/20 border-primary animate-pulse"
            )}
            title={sttSupported ? "Voice input" : "Voice not supported"}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Image input (coming soon)">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            placeholder="พิมพ์ข้อความหรือกดปุ่มไมค์เพื่อพูด..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="hologram-glow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import motion for animations
import { motion } from "framer-motion";
