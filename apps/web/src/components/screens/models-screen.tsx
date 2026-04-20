"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

interface Model {
  id: string;
  name: string;
  badge: "primary" | "fallback" | "local" | "offline";
  apiStatus: "ok" | "warn" | "off";
  thaiSupport: "ok" | "warn" | "off";
  contextWindow: string;
  latency: "fast" | "med" | "slow";
  avgLatency: string;
}

export function ModelsScreen() {
  const [selectedModel, setSelectedModel] = useState("claude");

  const models: Model[] = [
    {
      id: "claude",
      name: "Claude Sonnet 4.5",
      badge: "primary",
      apiStatus: "ok",
      thaiSupport: "ok",
      contextWindow: "200K",
      latency: "fast",
      avgLatency: "~1.2s",
    },
    {
      id: "gpt",
      name: "GPT-4o",
      badge: "fallback",
      apiStatus: "warn",
      thaiSupport: "ok",
      contextWindow: "128K",
      latency: "fast",
      avgLatency: "~1.0s",
    },
    {
      id: "ollama",
      name: "Ollama (Local)",
      badge: "local",
      apiStatus: "ok",
      thaiSupport: "warn",
      contextWindow: "8K",
      latency: "med",
      avgLatency: "~2.5s",
    },
    {
      id: "web",
      name: "Web Search",
      badge: "fallback",
      apiStatus: "warn",
      thaiSupport: "ok",
      contextWindow: "∞",
      latency: "slow",
      avgLatency: "~3.0s",
    },
  ];

  const getBadgeClass = (badge: Model["badge"]) => {
    switch (badge) {
      case "primary":
        return "bg-[rgba(0,212,255,0.2)] border-[rgba(0,212,255,0.3)] text-cyan-400";
      case "fallback":
        return "bg-[rgba(240,244,255,0.04)] border-[rgba(240,244,255,0.07)] text-[rgba(240,244,255,0.3)]";
      case "local":
        return "bg-[rgba(0,229,160,0.1)] border-[rgba(0,229,160,0.25)] text-green-400";
      case "offline":
        return "bg-[rgba(255,77,109,0.08)] border-[rgba(255,77,109,0.2)] text-red-400";
    }
  };

  const getStatusDot = (status: "ok" | "warn" | "off") => {
    switch (status) {
      case "ok":
        return <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(0,229,160,1)]" />;
      case "warn":
        return <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />;
      case "off":
        return <div className="w-1.5 h-1.5 rounded-full bg-red-400" />;
    }
  };

  const getLatencyClass = (latency: Model["latency"]) => {
    switch (latency) {
      case "fast":
        return "bg-gradient-to-r from-green-400 to-green-300";
      case "med":
        return "bg-gradient-to-r from-amber-400 to-orange-300";
      case "slow":
        return "bg-gradient-to-r from-orange-400 to-red-400";
    }
  };

  return (
    <div className="px-9 py-7 flex flex-col gap-5.5 overflow-y-auto h-full">
      {/* Title */}
      <div>
        <div
          className="font-display text-[11px] tracking-[0.3em] text-cyan-400/40 mb-1.5 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          AI Model Management
        </div>
        <div
          className="text-[12.5px] text-[rgba(240,244,255,0.3)] font-ui"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Automatic fallback chain — Lumi selects the best available model
        </div>
      </div>

      {/* Fallback Chain */}
      <div className="flex items-center gap-0 px-6 py-4.5 bg-[rgba(240,244,255,0.04)] border border-[rgba(240,244,255,0.07)] rounded-[12px]">
        {[
          { num: "01", name: "Claude", status: "ok", statusText: "PRIMARY" },
          { num: "02", name: "GPT-4o", status: "warn", statusText: "FALLBACK" },
          { num: "03", name: "Ollama", status: "ok", statusText: "LOCAL" },
          { num: "04", name: "Web Search", status: "warn", statusText: "FALLBACK" },
        ].map((node, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="font-display text-[10px] text-cyan-400/40 tracking-[0.1em]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {node.num}
            </div>
            <div
              className="font-ui text-[12px] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {node.name}
            </div>
            <div
              className={`text-[9px] font-ui ${
                node.status === "ok"
                  ? "text-green-400"
                  : node.status === "warn"
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ● {node.statusText}
            </div>
            {index < 3 && (
              <div className="text-[rgba(240,244,255,0.1)] text-lg -mt-1">→</div>
            )}
          </div>
        ))}
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`model-card relative overflow-hidden ${
              selectedModel === model.id ? "model-card-active" : ""
            }`}
          >
            {/* Background gradient for active */}
            {selectedModel === model.id && (
              <div className="absolute inset-0 opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/6 to-transparent rounded-[12px]" />
              </div>
            )}

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="font-ui text-[13px] font-semibold tracking-[0.06em] text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {model.name}
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full font-ui text-[9px] tracking-[0.1em] uppercase border ${getBadgeClass(model.badge)}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {model.badge}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  {getStatusDot(model.apiStatus)}
                  <span
                    className="text-[11.5px] text-[rgba(240,244,255,0.3)] flex-1 font-ui"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    API Status
                  </span>
                  <span
                    className="text-[11px] text-cyan-400 font-display"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {model.apiStatus === "ok" ? "OK" : model.apiStatus === "warn" ? "WARN" : "OFF"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusDot(model.thaiSupport)}
                  <span
                    className="text-[11.5px] text-[rgba(240,244,255,0.3)] flex-1 font-ui"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Thai Support
                  </span>
                  <span
                    className="text-[11px] text-cyan-400 font-display"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {model.thaiSupport === "ok" ? "Excellent" : model.thaiSupport === "warn" ? "Good" : "Limited"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusDot(model.apiStatus)}
                  <span
                    className="text-[11.5px] text-[rgba(240,244,255,0.3)] flex-1 font-ui"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Context Window
                  </span>
                  <span
                    className="text-[11px] text-cyan-400 font-display"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {model.contextWindow}
                  </span>
                </div>
              </div>

              {/* Latency Bar */}
              <div className="h-0.5 bg-[rgba(240,244,255,0.08)] rounded overflow-hidden mt-2.5">
                <div
                  className={`h-full rounded transition-all duration-[600ms] ${getLatencyClass(model.latency)}`}
                  style={{ width: model.latency === "fast" ? "30%" : model.latency === "med" ? "60%" : "90%" }}
                />
              </div>
              <div
                className="font-ui text-[9px] text-[rgba(240,244,255,0.3)] mt-1 tracking-[0.08em]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Avg. latency: {model.avgLatency}
              </div>

              {/* Select Button */}
              <button
                className={`w-full mt-3 px-0 py-1.5 border rounded-lg font-ui text-[10px] tracking-[0.12em] uppercase transition-all ${
                  selectedModel === model.id
                    ? "bg-[rgba(0,212,255,0.15)] border-[rgba(0,212,255,0.16)] text-cyan-400"
                    : "border-[rgba(240,244,255,0.07)] bg-transparent text-[rgba(240,244,255,0.3)] hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.16)] hover:text-cyan-400"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {selectedModel === model.id ? "✓ Active Model" : "Select Model"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
