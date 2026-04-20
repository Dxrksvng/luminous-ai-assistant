"use client";

import { Activity, Cpu, Database, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function Header() {
  const [time, setTime] = useState<Date | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 0,
    memory: 0,
    network: true,
  });

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setSystemStatus({
        cpu: Math.random() * 30 + 10, // Simulate 10-40%
        memory: Math.random() * 20 + 40, // Simulate 40-60%
        network: Math.random() > 0.1, // 90% uptime
      });
    }, 2000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <header className="h-16 border-b border-primary/20 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent animate-pulse-glow" />
          <h1 className="text-xl font-bold hologram-text">LUMINOUS</h1>
        </div>
        <Badge variant="hologram" className="ml-4">
          <span className="blink">●</span> ONLINE
        </Badge>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-primary/70">
            <Cpu className="h-4 w-4" />
            <span>CPU: {systemStatus.cpu.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2 text-primary/70">
            <Database className="h-4 w-4" />
            <span>MEM: {systemStatus.memory.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2 text-primary/70">
            <Wifi
              className={`h-4 w-4 ${systemStatus.network ? "text-green-400" : "text-red-400"}`}
            />
            <span>{systemStatus.network ? "CONNECTED" : "OFFLINE"}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-mono font-light hologram-text">
            {time?.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }) ?? "--:--:--"}
          </div>
          <div className="text-xs text-muted-foreground">
            {time?.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }) ?? "Loading..."}
          </div>
        </div>
      </div>
    </header>
  );
}
