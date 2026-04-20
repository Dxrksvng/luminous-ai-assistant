"use client";

import { useState } from "react";
import { Mic } from "lucide-react";

export function VoiceTranslateScreen() {
  const [srcLang, setSrcLang] = useState("th");
  const [tgtLang, setTgtLang] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [pipelineStage, setPipelineStage] = useState(0);

  const languages = [
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
  ];

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setTranscript("สวัสดีครับ วันนี้อากาศดีมาก");
        setTranslation("Hello, the weather is very nice today.");
        setPipelineStage(4);
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start px-10 py-8 gap-6 overflow-y-auto h-full">
      {/* Title */}
      <div className="text-center">
        <div
          className="font-display text-[11px] tracking-[0.3em] text-cyan-400/40 mb-1.5 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Voice Translation
        </div>
        <div
          className="text-[13px] text-[rgba(240,244,255,0.3)] font-ui"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Speech → AI → Output — พูดแล้วแปลทันที
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex items-center gap-3.5 bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] px-5 py-2.5">
        <select
          value={srcLang}
          onChange={(e) => setSrcLang(e.target.value)}
          className="bg-transparent border-none outline-none font-ui text-[13px] text-white cursor-pointer p-0.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#0d1224]">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <div className="text-cyan-400 text-lg opacity-70">⇌</div>

        <select
          value={tgtLang}
          onChange={(e) => setTgtLang(e.target.value)}
          className="bg-transparent border-none outline-none font-ui text-[13px] text-white cursor-pointer p-0.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#0d1224]">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-[rgba(240,244,255,0.07)] mx-1.5" />

        <div className="flex items-center gap-2">
          <div className="w-4 h-2.5 rounded-full bg-cyan-400/28 border border-cyan-400 relative cursor-pointer">
            <div className="absolute top-0.5 right-0 w-3.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <span
            className="font-ui text-[11px] text-[rgba(240,244,255,0.3)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Auto
          </span>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="flex items-center gap-0 w-full max-w-[780px]">
        {[
          { icon: "🎤", label: "Microphone" },
          { icon: "🔊", label: "Whisper STT" },
          { icon: "🧠", label: "Claude AI" },
          { icon: "🗣", label: "Edge TTS" },
          { icon: "📢", label: "Output" },
        ].map((stage, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 relative">
            <div
              className={`w-13 h-13 rounded-[14px] border border-[rgba(240,244,255,0.07)] bg-[rgba(240,244,255,0.04)] flex items-center justify-center text-2xl transition-all relative ${
                isRecording && index === 0
                  ? "border-cyan-400 bg-[rgba(0,212,255,0.15)] shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                  : ""
              } ${pipelineStage > index ? "border-green-400 bg-[rgba(0,229,160,0.1)]" : ""}`}
            >
              {stage.icon}
            </div>
            <div
              className="font-ui text-[9px] tracking-[0.15em] uppercase text-[rgba(240,244,255,0.3)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {stage.label}
            </div>
            {index < 4 && (
              <div className="absolute left-0 top-0 w-10 h-0.5 bg-[rgba(240,244,255,0.07)] -translate-x-1/2 mt-[-28px]">
                <div
                  className={`absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent ${
                    isRecording && index < 2 ? "animate-pipeline" : ""
                  }`}
                  style={{ width: pipelineStage > index ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Big Mic Button */}
      <div className="flex flex-col items-center gap-2.5">
        <button
          onClick={toggleRecording}
          className={`w-25 h-25 rounded-full bg-[rgba(240,244,255,0.04)] border-2 border-[rgba(0,212,255,0.16)] flex items-center justify-center cursor-pointer text-4xl transition-all relative ${
            isRecording
              ? "bg-[rgba(0,212,255,0.15)] border-cyan-400 shadow-[0_0_40px_rgba(0,212,255,0.25)]"
              : "hover:bg-[rgba(0,212,255,0.15)] hover:border-cyan-400"
          }`}
        >
          <Mic className="w-10 h-10" />
          {isRecording && (
            <>
              <div className="absolute inset-[-10px] rounded-full border border-cyan-400 opacity-0 animate-mic-ring" />
              <div className="absolute inset-[-22px] rounded-full border border-cyan-400 opacity-0 animate-mic-ring2" />
            </>
          )}
        </button>
        <div
          className="font-ui text-[10px] tracking-[0.2em] uppercase text-[rgba(240,244,255,0.3)]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {isRecording ? "Listening..." : "กดเพื่อเริ่ม / Tap to speak"}
        </div>
      </div>

      {/* Output Panels */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[780px]">
        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-4">
          <div
            className="font-ui text-[9px] tracking-[0.22em] uppercase text-cyan-400/40 mb-2.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            🎙 Transcript (Original)
          </div>
          <div
            className={`text-[14px] leading-[1.65] min-h-[60px] ${
              transcript ? "text-white" : "text-[rgba(240,244,255,0.3)]"
            }`}
          >
            {transcript || "Waiting for speech…"}
          </div>
          <div
            className="font-ui text-[9px] text-[rgba(240,244,255,0.3)] tracking-[0.1em] mt-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Source: {languages.find((l) => l.code === srcLang)?.name}
          </div>
        </div>

        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-4">
          <div
            className="font-ui text-[9px] tracking-[0.22em] uppercase text-cyan-400/40 mb-2.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ✨ Translation (Output)
          </div>
          <div
            className={`text-[14px] leading-[1.65] min-h-[60px] ${
              translation ? "text-white" : "text-[rgba(240,244,255,0.3)]"
            }`}
          >
            {translation || "Translation will appear here…"}
          </div>
          <div
            className="font-ui text-[9px] text-[rgba(240,244,255,0.3)] tracking-[0.1em] mt-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Target: {languages.find((l) => l.code === tgtLang)?.name}
          </div>
        </div>
      </div>
    </div>
  );
}
