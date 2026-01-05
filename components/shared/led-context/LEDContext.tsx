"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LEDFont = 
  | "departure-mono" 
  | "suisse-intl" 
  | "space-grotesk" 
  | "teko" 
  | "orbitron" 
  | "vt323" 
  | "press-start-2p" 
  | "wallpoet";
export type LEDTransform = "none" | "uppercase" | "lowercase" | "capitalize";

interface LEDSettings {
  hue: number;
  duration: number;
  bgLight: number;
  scale: number;
  text: string;
  font: LEDFont;
  textTransform: LEDTransform;
  fontSize: number;
  textColor: string;
  isStatic: boolean;
}

interface LEDContextType {
  settings: LEDSettings;
  setSettings: (settings: Partial<LEDSettings>) => void;
}

const LEDContext = createContext<LEDContextType | undefined>(undefined);

export function LEDProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<LEDSettings>({
    hue: 111,
    duration: 12.5,
    bgLight: 0.15,
    scale: 1,
    text: "Innovate, Execute, Iterate",
    font: "space-grotesk",
    textTransform: "capitalize",
    fontSize: 40,
    textColor: "#FF6B35",
    isStatic: false,
  });

  const setSettings = (newSettings: Partial<LEDSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("led-settings");
    if (saved) {
      try {
        setSettingsState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to parse led-settings", e);
      }
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem("led-settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <LEDContext.Provider value={{ settings, setSettings }}>
      {children}
    </LEDContext.Provider>
  );
}

export function useLEDContext() {
  const context = useContext(LEDContext);
  if (context === undefined) {
    throw new Error("useLEDContext must be used within a LEDProvider");
  }
  return context;
}

