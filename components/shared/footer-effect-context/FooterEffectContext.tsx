"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Available footer effect types
export type FooterEffectType = 
  | 'flame'           // FooterFlame - Original flame
  | 'hero-flame'      // HeroFlame - Hero flame effect
  | 'explosion'       // AsciiExplosion - Explosive animation
  | 'subtle-explosion' // SubtleExplosion - Subtle explosion
  | 'subtle-wave'     // SubtleWave - Wave animation
  | 'core-flame'      // CoreFlame - Core flame effect
  | 'none';           // No effect

export const EFFECT_LABELS: Record<FooterEffectType, string> = {
  'flame': 'Flame',
  'hero-flame': 'Hero Flame',
  'explosion': 'Explosion',
  'subtle-explosion': 'Subtle Explosion',
  'subtle-wave': 'Wave',
  'core-flame': 'Core Flame',
  'none': 'None',
};

export const EFFECTS: FooterEffectType[] = [
  'flame',
  'hero-flame',
  'explosion',
  'subtle-explosion',
  'subtle-wave',
  'core-flame',
  'none',
];

interface FooterEffectContextType {
  currentEffect: FooterEffectType;
  setCurrentEffect: (effect: FooterEffectType) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

const FooterEffectContext = createContext<FooterEffectContextType | undefined>(undefined);

const STORAGE_KEY = "footer-effect";
const DEFAULT_EFFECT: FooterEffectType = "hero-flame";

export function FooterEffectProvider({ children }: { children: ReactNode }) {
  const [currentEffect, setCurrentEffectState] = useState<FooterEffectType>(DEFAULT_EFFECT);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && EFFECTS.includes(saved as FooterEffectType)) {
        setCurrentEffectState(saved as FooterEffectType);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, currentEffect);
    }
  }, [currentEffect, isInitialized]);

  const setCurrentEffect = useCallback((effect: FooterEffectType) => {
    if (EFFECTS.includes(effect)) {
      setCurrentEffectState(effect);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentEffectState((prev) => {
      const currentIndex = EFFECTS.indexOf(prev);
      return EFFECTS[(currentIndex + 1) % EFFECTS.length];
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentEffectState((prev) => {
      const currentIndex = EFFECTS.indexOf(prev);
      return EFFECTS[(currentIndex - 1 + EFFECTS.length) % EFFECTS.length];
    });
  }, []);

  return (
    <FooterEffectContext.Provider
      value={{
        currentEffect,
        setCurrentEffect,
        handleNext,
        handlePrevious,
      }}
    >
      {children}
    </FooterEffectContext.Provider>
  );
}

export function useFooterEffectContext() {
  const context = useContext(FooterEffectContext);
  if (context === undefined) {
    throw new Error("useFooterEffectContext must be used within a FooterEffectProvider");
  }
  return context;
}

