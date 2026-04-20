"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "สวัสดีครับ Je — ผมคือ Luminous ผู้ช่วยส่วนตัวของคุณ วันนี้ผมช่วยอะไรคุณได้บ้างครับ?\n\nHi Je — I'm Luminous, your personal AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand. Let me help you with that... (This is a demo response)",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    setIsMicActive((prev) => !prev);
    // TODO: Implement voice recognition
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-5 px-0" style={{ scrollbarWidth: "thin" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.role === "user" ? "message-row-je" : "message-row-lumi"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8.5 h-8.5 flex-shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  L
                </span>
              </div>
            )}
            <div
              className={`bubble ${msg.role === "user" ? "bubble-je" : "bubble-lumi"}`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              <div
                className={`text-[9.5px] tracking-[0.15em] uppercase mb-1 font-ui ${
                  msg.role === "assistant" ? "text-cyan-400" : "text-purple-400/75 text-right"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {msg.role === "assistant" ? "Luminous" : "Je"}
              </div>
              <div className="text-[14px] leading-[1.65]">{msg.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row message-row-lumi">
            <div className="w-8.5 h-8.5 flex-shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                L
              </span>
            </div>
            <div className="typing-dots">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-8 py-3.5 pb-5.5">
        <div className="flex items-center gap-2.5 glass backdrop-blur-[24px] border border-[rgba(0,212,255,0.16)] rounded-[14px] p-2.5 px-4 transition-all focus-within:border-[rgba(0,212,255,0.45)] focus-within:shadow-[0_0_24px_rgba(0,212,255,0.09)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความ… / Message Lumi…"
            rows={1}
            className="flex-1 border-none outline-none bg-transparent text-[13.5px] text-white resize-none max-h-[110px] min-h-[20px] leading-[1.5] font-body"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <button
            onClick={toggleMic}
            className={`w-8.5 h-8.5 flex-shrink-0 rounded-lg border ${
              isMicActive
                ? "bg-[rgba(123,94,167,0.2)] border-[rgba(123,94,167,0.4)] text-[#7b5ea7]"
                : "bg-[rgba(240,244,255,0.04)] border-[rgba(240,244,255,0.07)] text-[rgba(240,244,255,0.3)]"
            } transition-all hover:bg-[rgba(123,94,167,0.2)] hover:border-[rgba(123,94,167,0.4)] hover:text-[#7b5ea7]`}
            title="Voice Input"
          >
            <Mic className="w-[14px] h-[14px]" />
          </button>
          <button
            onClick={handleSend}
            className="w-8.5 h-8.5 flex-shrink-0 bg-gradient-to-br from-cyan-400 to-[#00aadd] border-none rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_22px_rgba(0,212,255,0.5)] shadow-[0_0_14px_rgba(0,212,255,0.28)]"
          >
            <Send className="w-3.5 h-3.5" fill="#0a0e1a" />
          </button>
        </div>
      </div>
    </div>
  );
}
