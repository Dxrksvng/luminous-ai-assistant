"use client";

import { MessageSquare, Mic, Languages, Brain, Monitor, Settings as SettingsIcon } from "lucide-react";

type TabId = "chat" | "voice" | "language" | "models" | "system" | "settings";

interface NavTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "voice", label: "Voice Translate", icon: Mic },
  { id: "language", label: "Language", icon: Languages },
  { id: "models", label: "Models", icon: Brain },
  { id: "system", label: "System", icon: Monitor },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  return (
    <div className="h-10 relative z-15 flex items-center gap-0.5 px-6 border-b border-[rgba(240,244,255,0.07)] bg-[rgba(10,14,26,0.7)] backdrop-blur-[12px]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? "nav-tab-active" : ""}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
