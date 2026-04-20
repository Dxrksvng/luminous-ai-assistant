"use client";

import { useEffect, useState } from "react";
import { Cpu, HardDrive, Wifi, Cloud, Activity, Zap } from "lucide-react";

interface HudSidebarProps {
  visible?: boolean;
}

export function HudSidebar({ visible = true }: HudSidebarProps) {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(45);
  const [ram, setRam] = useState(62);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.round(30 + Math.random() * 40));
      setRam(Math.round(50 + Math.random() * 30));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`w-68 flex-shrink-0 border-l border-[rgba(0,212,255,0.16)] bg-[rgba(9,13,24,0.8)] backdrop-blur-[20px)] flex flex-col overflow-y-auto transition-all duration-[400ms] z-5 ${
        !visible ? "w-0 opacity-0 overflow-hidden" : ""
      }`}
      style={{ width: visible ? "272px" : "0" }}
    >
      {/* Clock Section */}
      <div className="px-4.5 py-4.5 pb-3.5 border-b border-[rgba(240,244,255,0.07)]">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          SYSTEM TIME
        </div>
        <div
          className="font-display text-[34px] font-bold tracking-[0.04em] text-white leading-none"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(0,212,255,0.2)",
          }}
        >
          {timeStr}
        </div>
        <div className="font-ui text-[10px] text-[rgba(240,244,255,0.3)] tracking-[0.08em] mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {dateStr}
        </div>
      </div>

      {/* System Monitor */}
      <div className="px-4.5 py-4.5 pb-3.5 border-b border-[rgba(240,244,255,0.07)]">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          SYSTEM MONITOR
        </div>

        {/* CPU */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="font-ui text-[9.5px] tracking-[0.08em] text-[rgba(240,244,255,0.35)] w-8.5 flex-shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CPU
          </div>
          <div className="flex-1 h-[2.5px] bg-[rgba(240,244,255,0.06)] rounded overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-[1500ms] relative"
              style={{ width: `${cpu}%` }}
            >
              <div className="absolute right-[-1px] top-[-1px] w-[5px] h-[5px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(0,212,255,1)]" />
            </div>
          </div>
          <div className="font-ui text-[9.5px] text-cyan-400/55 w-7 text-right flex-shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {cpu}%
          </div>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-2.5">
          <div className="font-ui text-[9.5px] tracking-[0.08em] text-[rgba(240,244,255,0.35)] w-8.5 flex-shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            RAM
          </div>
          <div className="flex-1 h-[2.5px] bg-[rgba(240,244,255,0.06)] rounded overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-[1500ms] relative"
              style={{ width: `${ram}%` }}
            >
              <div className="absolute right-[-1px] top-[-1px] w-[5px] h-[5px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(0,212,255,1)]" />
            </div>
          </div>
          <div className="font-ui text-[9.5px] text-cyan-400/55 w-7 text-right flex-shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {ram}%
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-4.5 py-4.5 pb-3.5 border-b border-[rgba(240,244,255,0.07)]">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          STATUS
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.18)] rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(0,212,255,1)]" />
          <span className="text-[10.5px] tracking-[0.05em] text-cyan-400 font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI Active
          </span>
        </div>
      </div>

      {/* Weather */}
      <div className="px-4.5 py-4.5 pb-3.5 border-b border-[rgba(240,244,255,0.07)]">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          WEATHER
        </div>
        <div className="flex items-center gap-3">
          <Cloud className="w-10 h-10 text-cyan-400" />
          <div>
            <div className="font-display text-[20px] font-normal text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              32°C
            </div>
            <div className="text-[10.5px] text-[rgba(240,244,255,0.3)] font-ui mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Partly Cloudy
            </div>
            <div className="text-[8.5px] tracking-[0.2em] text-cyan-400/35 uppercase font-ui mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              BANGKOK
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4.5 py-4.5 pb-3.5">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          QUICK ACTIONS
        </div>

        <button className="flex items-center gap-2.5 px-3 py-2 bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-lg mb-1.5 font-ui text-[11px] text-[rgba(240,244,255,0.3)] tracking-[0.04em] transition-all hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.16)] hover:text-cyan-400 w-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          Wake Word Setup
        </button>

        <button className="flex items-center gap-2.5 px-3 py-2 bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-lg font-ui text-[11px] text-[rgba(240,244,255,0.3)] tracking-[0.04em] transition-all hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.16)] hover:text-cyan-400 w-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <Activity className="w-3.5 h-3.5 flex-shrink-0" />
          View Activity Log
        </button>
      </div>

      {/* Network Status */}
      <div className="px-4.5 py-4.5 pb-3.5 mt-auto">
        <div className="font-ui text-[9px] tracking-[0.28em] uppercase text-cyan-400/35 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          NETWORK
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-[10.5px] text-[rgba(240,244,255,0.5)] font-ui" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}
