"use client";

import { Cpu, HardDrive, Wifi, Activity, Zap } from "lucide-react";

export function SystemScreen() {
  return (
    <div className="px-9 py-6 flex flex-col gap-4.5 overflow-y-auto h-full">
      <div>
        <div
          className="font-display text-[11px] tracking-[0.3em] text-cyan-400/40 mb-2 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          System Health
        </div>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Activity, value: "100%", label: "Uptime", color: "text-green-400" },
          { icon: Cpu, value: "45%", label: "CPU Usage", color: "text-cyan-400" },
          { icon: HardDrive, value: "62%", label: "Memory", color: "text-cyan-400" },
          { icon: Wifi, value: "OK", label: "Network", color: "text-green-400" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-4 text-center"
          >
            <card.icon className={`w-6 h-6 mx-auto mb-2 ${card.color}`} />
            <div
              className={`font-display text-[22px] font-bold text-white leading-none ${card.color}`}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {card.value}
            </div>
            <div
              className="font-ui text-[9.5px] tracking-[0.12em] uppercase text-[rgba(240,244,255,0.3)] mt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Endpoints Table */}
      <div className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2.5 border-b border-[rgba(240,244,255,0.07)]">
          <div
            className="font-ui text-[9px] tracking-[0.18em] uppercase text-cyan-400/35"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Endpoint
          </div>
          <div
            className="font-ui text-[9px] tracking-[0.18em] uppercase text-cyan-400/35"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Method
          </div>
          <div
            className="font-ui text-[9px] tracking-[0.18em] uppercase text-cyan-400/35"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Status
          </div>
          <div
            className="font-ui text-[9px] tracking-[0.18em] uppercase text-cyan-400/35"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Latency
          </div>
        </div>
        {[
          { endpoint: "/api/chat", method: "POST", status: "ok", latency: "145ms" },
          { endpoint: "/api/voice/transcribe", method: "POST", status: "ok", latency: "892ms" },
          { endpoint: "/api/voice/synthesize", method: "POST", status: "ok", latency: "234ms" },
          { endpoint: "/api/models/status", method: "GET", status: "ok", latency: "12ms" },
        ].map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2.75 border-b border-[rgba(240,244,255,0.07)] items-center transition-colors hover:bg-[rgba(240,244,255,0.04)]"
          >
            <div
              className="font-ui text-[12px] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {row.endpoint}
            </div>
            <div>
              <span
                className="font-ui text-[9px] tracking-[0.08em] px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "rgba(0,212,255,0.12)",
                  color: "#00d4ff",
                }}
              >
                POST
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  row.status === "ok"
                    ? "bg-green-400 shadow-[0_0_5px_rgba(0,229,160,1)]"
                    : row.status === "warn"
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
              />
              <span
                className="font-ui text-[10px]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color:
                    row.status === "ok"
                      ? "#00e5a0"
                      : row.status === "warn"
                      ? "#ffc450"
                      : "#ff4d6d",
                }}
              >
                {row.status.toUpperCase()}
              </span>
            </div>
            <div
              className="font-display text-[11px] text-cyan-400/60"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {row.latency}
            </div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Requests Today", value: "47" },
          { title: "Avg Response", value: "1.2s" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px] p-3.5 px-4"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="font-ui text-[10px] tracking-[0.14em] uppercase text-[rgba(240,244,255,0.3)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.title}
              </div>
              <div
                className="font-display text-[13px] text-cyan-400"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {item.value}
              </div>
            </div>
            <div className="h-11 bg-[rgba(5,8,18,0.5)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
