"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Animation types
export type AnimationType = 
  | 'eye'
  | 'sphere-scan'
  | 'crystalline-refraction'
  | 'sonar-sweep'
  | 'helix-scanner'
  | 'interconnecting-waves'
  | 'cylindrical-analysis'
  | 'voxel-matrix-morph'
  | 'phased-array-emitter'
  | 'crystalline-cube-refraction';

export const ANIMATION_LABELS: Record<AnimationType, string> = {
  'eye': 'Eye Tracker',
  'sphere-scan': '3D Sphere Scan',
  'crystalline-refraction': 'Crystalline Refraction',
  'sonar-sweep': 'Sonar Sweep',
  'helix-scanner': 'Helix Scanner',
  'interconnecting-waves': 'Interconnecting Waves',
  'cylindrical-analysis': 'Cylindrical Analysis',
  'voxel-matrix-morph': 'Voxel Matrix Morph',
  'phased-array-emitter': 'Phased Array Emitter',
  'crystalline-cube-refraction': 'Crystalline Cube Refraction',
};

export const ANIMATIONS: AnimationType[] = [
  'sphere-scan',
  'eye',
  'crystalline-refraction',
  'sonar-sweep',
  'helix-scanner',
  'interconnecting-waves',
  'cylindrical-analysis',
  'voxel-matrix-morph',
  'phased-array-emitter',
  'crystalline-cube-refraction',
];

interface AvatarContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentAnimation: AnimationType;
  handleNext: () => void;
  handlePrevious: () => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

const STORAGE_KEY = "avatar-animation-index";
const DEFAULT_INDEX = 0; // sphere-scan is default

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndexState] = useState<number>(DEFAULT_INDEX);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsedIndex = parseInt(saved, 10);
        if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < ANIMATIONS.length) {
          setCurrentIndexState(parsedIndex);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, currentIndex.toString());
    }
  }, [currentIndex, isInitialized]);

  const setCurrentIndex = useCallback((index: number) => {
    if (index >= 0 && index < ANIMATIONS.length) {
      setCurrentIndexState(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndexState((prev) => (prev + 1) % ANIMATIONS.length);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndexState((prev) => (prev - 1 + ANIMATIONS.length) % ANIMATIONS.length);
  }, []);

  const currentAnimation = ANIMATIONS[currentIndex];

  return (
    <AvatarContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        currentAnimation,
        handleNext,
        handlePrevious,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error("useAvatarContext must be used within an AvatarProvider");
  }
  return context;
}

