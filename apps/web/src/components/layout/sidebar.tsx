"use client";

import { cn } from "@/lib/utils";
import { Home, MessageSquare, Activity, Settings, Brain, Zap, Mic, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "voice-translate", label: "Voice Translate", icon: Languages, href: "/voice-translate" },
  { id: "hands-free", label: "🎤 Hands-Free", icon: Mic, href: "/hands-free" },
  { id: "monitor", label: "Monitor", icon: Activity },
  { id: "agents", label: "Agents", icon: Brain },
  { id: "analytics", label: "Analytics", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 h-full border-r border-primary/20 bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="p-4">
        <div className="hologram-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full hologram-circle flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <div className="font-semibold">Luminous</div>
              <div className="text-xs text-muted-foreground">Personal AI</div>
            </div>
          </div>
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 animate-pulse" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Operational: 75% capacity
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          const button = (
            <Button
              variant={isActive ? "hologram" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );

          if ((item as any).href) {
            return (
              <Link key={item.id} href={(item as any).href} className="block">
                {button}
              </Link>
            );
          }

          return (
            <Button
              key={item.id}
              variant={isActive ? "hologram" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="hologram-card p-3 text-xs">
          <div className="data-stream mb-2">
            SYSTEM STATUS: NORMAL
          </div>
          <div className="data-stream mb-2">
            AI MODEL: CLAUDE-4.5
          </div>
          <div className="data-stream">
            VERSION: 1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
}
