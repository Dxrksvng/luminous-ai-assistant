"use client";

import { useEffect, useState, useRef } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const bootLines = [
  { text: "Initializing Luminous Core...", type: "normal" },
  { text: "Loading neural pathways...", type: "normal" },
  { text: "Connecting to synaptic network...", type: "normal" },
  { text: "Loading language models (Typhoon v2, Qwen, LLaMA)...", type: "normal" },
  { text: "Voice recognition modules: READY", type: "accent" },
  { text: "Text-to-speech engine: READY", type: "accent" },
  { text: "Memory systems: ONLINE", type: "accent" },
  { text: "WAKE WORD DETECTION: ACTIVE", type: "accent" },
  { text: "Je — I am Luminous. I am ready.", type: "accent" },
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let currentIndex = 0;

    const showNextLine = () => {
      if (currentIndex < bootLines.length) {
        setVisibleLines((prev) => prev + 1);
        currentIndex++;
        const delay = currentIndex === bootLines.length ? 800 : 200;
        timeoutRef.current = setTimeout(showNextLine, delay);
      } else {
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 800);
        }, 500);
      }
    };

    timeoutRef.current = setTimeout(showNextLine, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onComplete]);

  return (
    <div className={`boot-screen ${isComplete ? "fade-out" : ""}`}>
      <div className="boot-logo">LUMINOUS SYSTEM v2.0</div>
      <div className="boot-lines">
        {bootLines.map((line, index) => (
          <div
            key={index}
            className={`${
              index < visibleLines
                ? "boot-line-visible"
                : "boot-line-hidden"
            } ${line.type === "accent" ? "boot-line-accent" : ""} ${
              line.type === "dim" ? "boot-line-dim" : ""
            }`}
          >
            {line.text}
            {index === visibleLines - 1 && !isComplete && (
              <span className="boot-cursor" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
