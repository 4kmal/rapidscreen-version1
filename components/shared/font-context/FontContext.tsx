"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FontChoice = "default" | "departure-mono" | "space-grotesk";

interface FontContextType {
  selectedFont: FontChoice;
  setSelectedFont: (font: FontChoice) => void;
  fontLabel: string;
  showOnboarding: boolean;
  dismissOnboarding: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const fontLabels: Record<FontChoice, string> = {
  "default": "SuisseIntl",
  "departure-mono": "Departure Mono",
  "space-grotesk": "Space Grotesk",
};

// Default font is now Departure Mono
const DEFAULT_FONT: FontChoice = "departure-mono";

export function FontProvider({ children }: { children: ReactNode }) {
  const [selectedFont, setSelectedFont] = useState<FontChoice>(DEFAULT_FONT);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Apply font class to document for CSS targeting
    document.documentElement.dataset.titleFont = selectedFont;
    
    // Save preference to localStorage
    if (isInitialized) {
      localStorage.setItem("title-font-preference", selectedFont);
    }
  }, [selectedFont, isInitialized]);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("title-font-preference") as FontChoice | null;
    const hasSeenOnboarding = localStorage.getItem("font-onboarding-seen");
    
    if (saved && ["default", "departure-mono", "space-grotesk"].includes(saved)) {
      setSelectedFont(saved);
    } else {
      // First visit - set default and show onboarding
      setSelectedFont(DEFAULT_FONT);
      document.documentElement.dataset.titleFont = DEFAULT_FONT;
    }
    
    // Show onboarding if user hasn't seen it
    if (!hasSeenOnboarding) {
      // Delay onboarding to let page load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    setIsInitialized(true);
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("font-onboarding-seen", "true");
    setIsInitialized(true);
  };

  return (
    <FontContext.Provider
      value={{
        selectedFont,
        setSelectedFont,
        fontLabel: fontLabels[selectedFont],
        showOnboarding,
        dismissOnboarding,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

export function useFontContext() {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFontContext must be used within a FontProvider");
  }
  return context;
}

