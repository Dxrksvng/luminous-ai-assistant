"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Languages, Sparkles, X, CheckCircle, Loader2, Play, Pause } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface HandsFreeAssistantProps {
  className?: string;
}

type StatusType = "idle" | "listening" | "processing" | "ready";

export function HandsFreeAssistant({ className }: HandsFreeAssistantProps) {
  // State
  const [isActive, setIsActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastWakeWord, setLastWakeWord] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState<StatusType>("idle");
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState<{ text: string; timestamp: number } | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // User context
  const userName = "เจ";
  const userGender = "female";

  // TTS with friendly female persona
  const { speak: ttsSpeak, isSpeaking } = useTextToSpeech({
    language: "th-TH",
    persona: "friendly",
    userName,
  });

  // Initialize on mount
  useEffect(() => {
    initVoiceRecognition();
    initAudioContext();

    // Request microphone permission immediately
    requestMicrophone();

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
        channelCount: 1,
      });

      const source = audioContextRef.current.createMediaStreamSource(stream);
      audioContextRef.current.resume();

      setIsActive(true);
      setIsListening(true);
      setStatus("listening");

      console.log("✅ Microphone connected");
    } catch (error) {
      console.error("Microphone error:", error);
      setIsActive(false);
      setStatus("idle");
    }
  };

  const initVoiceRecognition = useCallback(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "th-TH";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setStatus("listening");
        console.log("🎤 Started listening");
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if still active
        if (isActive) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log("Auto-restart:", e);
            }
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
            interimTranscript = transcript;
          }
        }

        const fullText = finalTranscript || interimTranscript;
        setTranscript(fullText);

        // Check for wake words
        checkWakeWords(fullText.toLowerCase());
      };

      recognition.onerror = (event: any) => {
        // Don't log normal lifecycle events as errors
        if (event.error !== "aborted" && event.error !== "no-speech") {
          console.error("Speech recognition error:", event.error);
        }
        if (event.error === "not-allowed") {
          console.warn("⚠️ Microphone permission denied");
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  }, [isActive]);

  const initAudioContext = useCallback(() => {
    if (typeof window !== "undefined" && "AudioContext" in window) {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    }
  }, []);

  const checkWakeWords = useCallback((text: string) => {
    const wakeWords = ["ลูมินัส", "luminas", "hey luminas", "เฮย์ ลูมินัส"];

    for (const word of wakeWords) {
      if (text.includes(word)) {
        // Calculate confidence based on position
        const index = text.indexOf(word);
        const confidence = text.endsWith(word) ? 1.0 : 0.8;

        setLastWakeWord(word);
        setConfidence(confidence);
        setIsProcessing(true);
        setStatus("ready");

        console.log("✨ Wake word detected:", word);

        // Auto-open UI
        setTimeout(() => {
          setShowSettings(true);
          setIsProcessing(false);
        }, 500);

        break;
      }
    }
  }, []);

  const handleAssistantResponse = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    setStatus("processing");

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: transcript,
          conversation_id: null,
          language: "th",
          user_context: {
            name: userName,
            gender: userGender,
            language: "thai",
            relationship: "friendly",
          },
          system_prompt: `คุณคือ Rumi ผู้ช่วย AI มิตรภาพที่พูดคุยกับ ${userName} ซึ่งเป็นผู้หญิง ตอบอย่างเป็นธรรมชาติ เหมือนพูดกับเพื่อนสนิท ใช้คำสุภาพแบบสาวสมัยใหม่ ไม่ใช้คำยกย่องแบบเจ้านาย เช่น ไม่ต้องเรียก "คุณเจ" หรือ "เจ้" เรียกสั้นๆ ว่า "เจ" หรือพูดแบบเป็นกันเอง ห้ามใช้คำที่ดูเป็นทางการเกินไป`,
        }),
      });

      const data = await response.json();

      setLastResponse({
        text: data.message,
        timestamp: Date.now(),
      });

      // Speak response with natural female voice
      if (isVoiceEnabled) {
        ttsSpeak(data.message);
      }

    } catch (error) {
      console.error("Assistant error:", error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setStatus("ready");
      }, 1000);
    }
  }, [isVoiceEnabled, ttsSpeak, userName, userGender]);

  // Auto-process when wake word detected
  useEffect(() => {
    if (lastWakeWord && transcript && status === "ready") {
      // Auto-send to Luminas
      handleAssistantResponse(transcript);
      setLastWakeWord("");
      setTranscript("");
    }
  }, [lastWakeWord, transcript, status, handleAssistantResponse]);

  // Manual message send (for button clicks)
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    setIsProcessing(true);
    setStatus("processing");
    setTranscript(message);

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversation_id: null,
          language: "th",
          user_context: {
            name: userName,
            gender: userGender,
            language: "thai",
            relationship: "friendly",
          },
          system_prompt: `คุณคือ Rumi ผู้ช่วย AI มิตรภาพที่พูดคุยกับ ${userName} ซึ่งเป็นผู้หญิง ตอบอย่างเป็นธรรมชาติ เหมือนพูดกับเพื่อนสนิท ใช้คำสุภาพแบบสาวสมัยใหม่ ไม่ใช้คำยกย่องแบบเจ้านาย เช่น ไม่ต้องเรียก "คุณเจ" หรือ "เจ้" เรียกสั้นๆ ว่า "เจ" หรือพูดแบบเป็นกันเอง ห้ามใช้คำที่ดูเป็นทางการเกินไป`,
        }),
      });

      const data = await response.json();

      setLastResponse({
        text: data.message,
        timestamp: Date.now(),
      });

      // Speak response with natural female voice
      if (isVoiceEnabled) {
        ttsSpeak(data.message);
      }

    } catch (error) {
      console.error("Assistant error:", error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setStatus("listening");
        setTranscript("");
      }, 1000);
    }
  }, [isVoiceEnabled, ttsSpeak, userName, userGender]);

  const startListening = useCallback(() => {
    requestMicrophone();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        setStatus("idle");
      } catch (e) {
        console.error("Error stopping:", e);
      }
    }
  }, []);

  return (
    <div className={className}>
      {/* Floating Wake Word Indicator */}
      <AnimatePresence>
        {isListening && !showSettings && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className="bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <div className="text-sm font-medium">พูดได้เลย</div>
                  <div className="text-xs text-muted-foreground">
                    {transcript ? `กำลัง: ${transcript}` : "พูดทีละ..."}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interface */}
      <AnimatePresence>
        {!showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="max-w-md w-full mx-4"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full hologram-circle flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold hologram-text">
                      <Sparkles className="inline h-8 w-8 text-primary" />
                      Luminas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      พูด "ลูมินัส" เพื่อเริ่มคุย
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {isListening ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      <span className="text-sm">กำลังฟัง...</span>
                    </div>
                  ) : status === "processing" ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-sm">กำลังดำเนิน...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-500">พร้อมคุย</span>
                    </div>
                  )}
                </div>

                <div className="h-px w-px bg-primary/20" />

                <div className="flex items-center gap-2">
                  {isVoiceEnabled ? (
                    <button className="h-10 w-10 rounded-full hologram-circle flex items-center justify-center hover:scale-105 transition-transform" onClick={() => setIsVoiceEnabled(false)}>
                      <Volume2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <button className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:scale-105 transition-transform" onClick={() => setIsVoiceEnabled(true)}>
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowSettings(true)}
                  className="h-10 w-10 rounded-full hologram-circle flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Last Response */}
              <AnimatePresence>
                {lastResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card/50 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 mb-4"
                  >
                    <div className="space-y-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(lastResponse.timestamp).toLocaleTimeString("th-TH")}
                      </div>
                      <div className="text-sm leading-relaxed">
                        {lastResponse.text}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => ttsSpeak(lastResponse.text)}
                          className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input */}
              <div className="bg-card/50 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์ข้อความที่นี่..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && transcript.trim()) {
                        handleSendMessage(transcript);
                      }
                    }}
                    className="flex-1 bg-background/50 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={() => handleSendMessage(transcript)}
                    disabled={!transcript.trim() || isProcessing}
                    className="h-10 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    ส่ง
                  </button>
                </div>
              </div>

              {/* Wake Words - Demo Buttons */}
              <div className="grid grid-cols-2 gap-3 text-center mb-6">
                {["สวัสดีเจนะ", "ช่วยเจที", "Luminas", "เฮย์ ลูมินัส"].map((word) => (
                  <button
                    key={word}
                    onClick={() => handleSendMessage(word)}
                    disabled={isProcessing}
                    className={`p-4 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-xl hover:border-primary/50 transition-all ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'
                    }`}
                  >
                    <div className="text-sm font-medium">{word}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      กดเพื่อทักทาย
                    </div>
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="text-center text-xs text-muted-foreground">
                <p className="mb-2">💬 พิมพ์ข้อความหรือกดปุ่มด้านล่าง</p>
                <p className="mb-2">🎤 พูดคุยกับ Rumi ได้เลย</p>
                <p className="mb-2">✨ Rumi จะตอบเป็นผู้หญิงธรรมชาติ</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle State */}
      <AnimatePresence>
        {showSettings && status === "idle" && !isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-card/50 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full hologram-circle flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Luminas พร้อม</h3>
                  <p className="text-sm text-muted-foreground">
                    คลิกหรือพูด wake word
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
