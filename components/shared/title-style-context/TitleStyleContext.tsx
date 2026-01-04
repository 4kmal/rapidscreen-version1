"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TitleStyle = "default" | "metal" | "chrome" | "pixel";

interface TitleStyleContextType {
  selectedStyle: TitleStyle;
  setSelectedStyle: (style: TitleStyle) => void;
  styleLabel: string;
}

const TitleStyleContext = createContext<TitleStyleContextType | undefined>(undefined);

const styleLabels: Record<TitleStyle, string> = {
  "default": "Default",
  "metal": "Metal",
  "chrome": "Chrome",
  "pixel": "Pixel Art",
};

const DEFAULT_STYLE: TitleStyle = "default";

export function TitleStyleProvider({ children }: { children: ReactNode }) {
  const [selectedStyle, setSelectedStyle] = useState<TitleStyle>(DEFAULT_STYLE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Apply style class to document for CSS targeting
    document.documentElement.dataset.titleStyle = selectedStyle;
    
    // Save preference to localStorage
    if (isInitialized) {
      localStorage.setItem("title-style-preference", selectedStyle);
    }
  }, [selectedStyle, isInitialized]);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("title-style-preference") as TitleStyle | null;
    
    if (saved && ["default", "metal", "chrome", "pixel"].includes(saved)) {
      setSelectedStyle(saved);
    } else {
      setSelectedStyle(DEFAULT_STYLE);
      document.documentElement.dataset.titleStyle = DEFAULT_STYLE;
    }
    
    setIsInitialized(true);
  }, []);

  return (
    <TitleStyleContext.Provider
      value={{
        selectedStyle,
        setSelectedStyle,
        styleLabel: styleLabels[selectedStyle],
      }}
    >
      {children}
    </TitleStyleContext.Provider>
  );
}

export function useTitleStyleContext() {
  const context = useContext(TitleStyleContext);
  if (!context) {
    throw new Error("useTitleStyleContext must be used within a TitleStyleProvider");
  }
  return context;
}

