"use client";

import { HandsFreeAssistant } from "@/components/hands-free-assistant";

export default function TrueHandsFreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/10 to-background flex flex-col overflow-hidden">
      {/* Full Screen Hands-Free Assistant */}
      <HandsFreeAssistant />
    </div>
  );
}
