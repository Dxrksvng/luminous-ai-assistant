"use client";

import { useState, useEffect } from "react";
import { BootScreen } from "@/components/boot-screen";
import { ParticleBackground } from "@/components/particle-background";
import { TopBar } from "@/components/top-bar";
import { NavTabs, type TabId } from "@/components/nav-tabs";
import { HudSidebar } from "@/components/hud-sidebar";
import { ChatScreen } from "@/components/screens/chat-screen";
import { VoiceTranslateScreen } from "@/components/screens/voice-translate-screen";
import { LanguageScreen } from "@/components/screens/language-screen";
import { ModelsScreen } from "@/components/screens/models-screen";
import { SystemScreen } from "@/components/screens/system-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [hudVisible, setHudVisible] = useState(true);

  useEffect(() => {
    // Check if boot already completed (in case of hot reload)
    const hasBooted = sessionStorage.getItem("luminous-booted");
    if (hasBooted) {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    sessionStorage.setItem("luminous-booted", "true");
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "chat":
        return <ChatScreen />;
      case "voice":
        return <VoiceTranslateScreen />;
      case "language":
        return <LanguageScreen />;
      case "models":
        return <ModelsScreen />;
      case "system":
        return <SystemScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <>
      {/* Boot Screen */}
      {!bootComplete && <BootScreen onComplete={handleBootComplete} />}

      {/* Particle Background */}
      <ParticleBackground />

      {/* Main App */}
      <div
        className={`fixed inset-0 grid grid-rows-[56px_40px_1fr] grid-cols-[1fr] transition-opacity duration-[900ms] delay-50 ${
          bootComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Bar */}
        <TopBar
          onToggleHud={() => setHudVisible((prev) => !prev)}
          onToggleTweaks={() => console.log("Tweaks")}
          hudVisible={hudVisible}
        />

        {/* Navigation Tabs */}
        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex overflow-hidden relative z-1">
          {/* Screen Content */}
          <div className="flex-1 flex overflow-hidden">
            {renderScreen()}
          </div>

          {/* HUD Sidebar */}
          <HudSidebar visible={hudVisible} />
        </div>
      </div>
    </>
  );
}
