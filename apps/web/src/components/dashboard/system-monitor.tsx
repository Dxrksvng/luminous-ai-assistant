"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, Network, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  icon: React.ElementType;
  color: string;
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: "CPU Usage", value: 23, max: 100, icon: Cpu, color: "cyan" },
    { label: "Memory", value: 47, max: 100, icon: HardDrive, color: "purple" },
    { label: "Network", value: 12, max: 100, icon: Network, color: "blue" },
    { label: "Power", value: 89, max: 100, icon: Zap, color: "green" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(5, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 10)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case "cyan":
        return "bg-primary";
      case "purple":
        return "bg-accent";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="hologram-card">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">System Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = (metric.value / metric.max) * 100;

          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary/70" />
                  <span className="text-sm">{metric.label}</span>
                </div>
                <span className="text-sm font-mono text-primary">{metric.value.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getColorClass(metric.color)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
