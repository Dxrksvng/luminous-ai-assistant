"use client";

import { Languages, Volume2, Mic, Keyboard, Cpu } from "lucide-react";

export function SettingsScreen() {
  return (
    <div className="px-9 py-6 flex flex-col gap-4.5 overflow-y-auto h-full">
      <div>
        <div
          className="font-display text-[11px] tracking-[0.3em] text-cyan-400/40 mb-2 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Settings
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Language Settings */}
        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-4 h-4" />
            <div
              className="font-ui text-[10px] tracking-[0.22em] uppercase text-cyan-400/40"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Language
            </div>
          </div>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Interface Language
                </div>
                <div className="text-[10px] text-[rgba(240,244,255,0.2)] font-ui mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Language for UI and menus
                </div>
              </div>
              <select className="bg-[rgba(5,18,24,0.8)] border border-[rgba(0,212,255,0.16)] rounded-lg px-2.5 py-1.5 font-ui text-[11.5px] text-white outline-none cursor-pointer transition-all focus:border-[rgba(0,212,255,0.4)] min-w-[130px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <option>🇹🇭 Thai</option>
                <option>🇺🇸 English</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  AI Response Language
                </div>
              </div>
              <select className="bg-[rgba(5,18,24,0.8)] border border-[rgba(0,212,255,0.16)] rounded-lg px-2.5 py-1.5 font-ui text-[11.5px] text-white outline-none cursor-pointer transition-all focus:border-[rgba(0,212,255,0.4)] min-w-[130px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <option>Auto-detect</option>
                <option>Thai</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-4 h-4" />
            <div
              className="font-ui text-[10px] tracking-[0.22em] uppercase text-cyan-400/40"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Voice
            </div>
          </div>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Text-to-Speech
                </div>
              </div>
              <div className="w-9.5 h-5.5 rounded-full bg-[rgba(0,212,255,0.28)] border border-cyan-400 relative cursor-pointer transition-all">
                <div className="absolute top-0.5 right-0 w-3.5 h-3.5 rounded-full bg-cyan-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Speech-to-Text
                </div>
              </div>
              <div className="w-9.5 h-5.5 rounded-full bg-[rgba(0,212,255,0.28)] border border-cyan-400 relative cursor-pointer transition-all">
                <div className="absolute top-0.5 right-0 w-3.5 h-3.5 rounded-full bg-cyan-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Voice Engine
                </div>
              </div>
              <select className="bg-[rgba(5,18,24,0.8)] border border-[rgba(0,212,255,0.16)] rounded-lg px-2.5 py-1.5 font-ui text-[11.5px] text-white outline-none cursor-pointer transition-all focus:border-[rgba(0,212,255,0.4)] min-w-[130px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <option>Edge TTS</option>
                <option>Whisper</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wake Word */}
        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-4 h-4" />
            <div
              className="font-ui text-[10px] tracking-[0.22em] uppercase text-cyan-400/40"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Wake Word
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Enable Wake Word
            </div>
            <div className="w-9.5 h-5.5 rounded-full bg-[rgba(123,94,167,0.28)] border border-[#7b5ea7] relative cursor-pointer transition-all">
              <div className="absolute top-0.5 left-0 w-3.5 h-3.5 rounded-full bg-[rgba(240,244,255,0.4)]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["Hey Luminous", "Lumi", "Jarvis"].map((phrase) => (
              <span
                key={phrase}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[rgba(240,244,255,0.07)] rounded-full font-ui text-[10px] text-[rgba(240,244,255,0.3)] cursor-pointer transition-all hover:bg-[rgba(123,94,167,0.2)] hover:border-[rgba(123,94,167,0.4)] hover:text-[#7b5ea7]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        {/* Hotkeys */}
        <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="w-4 h-4" />
            <div
              className="font-ui text-[10px] tracking-[0.22em] uppercase text-cyan-400/40"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Keyboard Shortcuts
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { action: "Toggle Voice Input", keys: ["⌘", "V"] },
              { action: "New Chat", keys: ["⌘", "N"] },
              { action: "Toggle HUD", keys: ["⌘", "H"] },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between py-1.5 border-b border-[rgba(240,244,255,0.07)] last:border-0"
              >
                <div className="text-[12px] text-[rgba(240,244,255,0.3)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.action}
                </div>
                <div className="flex gap-1">
                  {item.keys.map((key) => (
                    <span
                      key={key}
                      className="px-2 py-0.5 bg-[rgba(240,244,255,0.08)] border border-[rgba(240,244,255,0.07)] rounded font-ui text-[10px] text-[rgba(240,244,255,0.6)]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
