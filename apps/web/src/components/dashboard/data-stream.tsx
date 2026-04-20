"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataStream() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateLog = () => {
      const logTypes = [
        "INFO",
        "DEBUG",
        "SCAN",
        "ANALYSIS",
        "THINKING",
      ];

      const messages = [
        "Processing user input...",
        "Retrieving from knowledge base...",
        "Analyzing context...",
        "Searching external sources...",
        "Generating response...",
        "Updating memory...",
        "Running diagnostics...",
        "Voice recognition active...",
        "Vision system standby...",
        "Agent coordination...",
      ];

      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });

      return `[${timestamp}] ${type}: ${message}`;
    };

    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs((prev) => {
        const updated = [...prev, newLog];
        if (updated.length > 50) {
          updated.shift();
        }
        return updated;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="hologram-card">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          System Log Stream
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="h-48 overflow-y-auto font-mono text-xs space-y-1"
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className="text-primary/70 hover:text-primary/100 transition-colors"
            >
              {log}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
