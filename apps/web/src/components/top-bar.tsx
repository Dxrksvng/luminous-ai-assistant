"use client";

import { Settings, Layers } from "lucide-react";

interface TopBarProps {
  onToggleHud?: () => void;
  onToggleTweaks?: () => void;
  hudVisible?: boolean;
}

export function TopBar({ onToggleHud, onToggleTweaks, hudVisible = true }: TopBarProps) {
  return (
    <div className="h-14 relative z-20 flex items-center justify-between px-6 border-b border-[rgba(0,212,255,0.16)] bg-[rgba(10,14,26,0.92)] backdrop-blur-[24px]">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-xl font-bold tracking-widest text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          LUMI<span className="text-cyan-400">N</span>OUS
          <span className="ml-2 text-xs opacity-40 tracking-[0.1em]">v2.0</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,1)] animate-pulse" />
          <span className="font-ui text-[10px] tracking-[0.15em] uppercase text-cyan-400/65" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleHud}
            className={`w-8 h-8 rounded-lg border ${hudVisible ? 'border-[rgba(0,212,255,0.16)] bg-[rgba(0,212,255,0.15)] text-cyan-400' : 'border-[rgba(240,244,255,0.07)] bg-[rgba(240,244,255,0.04)] text-[rgba(240,244,255,0.3)]'} transition-all hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.16)] hover:text-cyan-400`}
            title="HUD"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTweaks}
            className="w-8 h-8 rounded-lg border border-[rgba(240,244,255,0.07)] bg-[rgba(240,244,255,0.04)] text-[rgba(240,244,255,0.3)] transition-all hover:bg-[rgba(123,94,167,0.2)] hover:border-[rgba(123,94,167,0.4)] hover:text-[#7b5ea7]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
