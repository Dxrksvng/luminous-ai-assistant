"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "cyan" | "purple" | "blue" | "green";
}

const colorClasses = {
  cyan: "text-primary",
  purple: "text-accent",
  blue: "text-blue-400",
  green: "text-green-400",
};

export function StatusCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  color = "cyan",
}: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hologram-card overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icon className="h-16 w-16" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold hologram-text mb-2">{value}</div>
          {change && (
            <div
              className={`text-xs ${
                trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {change}
            </div>
          )}
        </CardContent>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-500/20 to-${color}-500/60`}
        />
      </Card>
    </motion.div>
  );
}
