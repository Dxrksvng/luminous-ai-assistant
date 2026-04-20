"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Languages, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceOverlayProps {
  className?: string;
  isListening?: boolean;
  isAutoTranslateEnabled?: boolean;
  isTranslating?: boolean;
  lastDetectedWord?: string;
  lastTranslation?: {
    originalText: string;
    translatedText: string;
  };
  wakeWordDetected?: boolean;
  onToggleAutoTranslate?: () => void;
  onToggleListening?: () => void;
}

export function VoiceOverlay({
  className,
  isListening = false,
  isAutoTranslateEnabled = false,
  isTranslating = false,
  lastDetectedWord = "",
  lastTranslation,
  wakeWordDetected = false,
  onToggleAutoTranslate,
  onToggleListening,
}: VoiceOverlayProps) {
  const [showHint, setShowHint] = useState(true);

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-50", className)}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Status Bar */}
        <div className="flex items-center gap-3 bg-background/90 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 shadow-lg">
          {/* Listening Status */}
          <div className="flex items-center gap-2">
            {isListening ? (
              <div className="relative">
                <Mic className="h-4 w-4 text-primary" />
                <motion.span
                  className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            ) : (
              <MicOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isListening ? "ฟังอยู่" : "หยุดฟัง"}
            </span>
          </div>

          <div className="w-px h-4 bg-primary/20" />

          {/* Auto-Translate Status */}
          <div className="flex items-center gap-2">
            {isAutoTranslateEnabled ? (
              <div className="relative">
                <Languages className="h-4 w-4 text-primary" />
                <motion.span
                  className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            ) : (
              <Languages className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isAutoTranslateEnabled ? "Auto-translate" : "Manual"}
            </span>
          </div>

          <div className="w-px h-4 bg-primary/20" />

          {/* Translating Status */}
          {isTranslating && (
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">แปลอยู่...</span>
            </div>
          )}
        </div>

        {/* Wake Word Detected Animation */}
        <AnimatePresence>
          {wakeWordDetected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="flex items-center gap-2 bg-primary/20 border border-primary/50 rounded-full px-6 py-3"
            >
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {lastDetectedWord || "Wake Word Detected!"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Translation */}
        <AnimatePresence>
          {lastTranslation && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-card/90 backdrop-blur-md border border-primary/30 rounded-xl p-4 shadow-lg max-w-md"
            >
              <div className="space-y-2">
                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    Original
                  </Badge>
                  <p className="text-sm">{lastTranslation.originalText}</p>
                </div>
                <div className="w-full h-px bg-primary/20" />
                <div>
                  <Badge variant="hologram" className="text-xs mb-1">
                    Translated
                  </Badge>
                  <p className="text-sm text-primary">{lastTranslation.translatedText}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(lastTranslation.translatedText))}
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  เล่นเสียง
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoTranslateEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleAutoTranslate}
            className={cn(
              "rounded-full",
              isAutoTranslateEnabled && "hologram-glow"
            )}
          >
            <Languages className="h-4 w-4 mr-1" />
            Auto-Translate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleListening}
            className="rounded-full"
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground text-center"
            >
              <p>กด <kbd className="bg-muted px-1 rounded">Ctrl+L</kbd> เริ่ม/หยุดฟัง</p>
              <p>กด <kbd className="bg-muted px-1 rounded">Ctrl+Space</kbd> เรียก Luminas</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
