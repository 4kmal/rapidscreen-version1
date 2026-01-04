"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useFontContext, FontChoice } from "../font-context/FontContext";
import { useTitleStyleContext, TitleStyle } from "../title-style-context/TitleStyleContext";
import { useLEDContext, LEDFont, LEDTransform } from "../led-context/LEDContext";
import { useAvatarContext, ANIMATIONS, ANIMATION_LABELS } from "../avatar-context/AvatarContext";
import { useFooterEffectContext, EFFECTS, EFFECT_LABELS } from "../footer-effect-context/FooterEffectContext";
import { cn } from "@/utils/cn";

const fontOptions: { id: FontChoice; label: string }[] = [
  { id: "default", label: "SuisseIntl" },
  { id: "departure-mono", label: "Departure Mono" },
  { id: "space-grotesk", label: "Space Grotesk" },
];

import Image from "next/image";

const titleStyleOptions: { id: TitleStyle; label: string; preview: React.ReactNode }[] = [
  { 
    id: "default", 
    label: "Default",
    preview: (
      <Image 
        src="/RS-1.png" 
        alt="RapidScreen" 
        width={60} 
        height={12}
        className="h-[10px] w-auto"
      />
    )
  },
  { 
    id: "metal", 
    label: "Metal",
    preview: (
      <span className="text-[10px] tracking-tighter">
        <span className="italic font-normal" style={{ color: 'oklch(0.7 0.2 250)' }}>RAPID</span>
        <span className="font-extrabold" style={{ 
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>SCREEN</span>
      </span>
    )
  },
  { 
    id: "chrome", 
    label: "Chrome",
    preview: (
      <span className="text-[10px] font-bold" style={{ 
        background: 'linear-gradient(to bottom, #0D49B9 27%, #0099FF 40%, #FFFFFF 52%, #E9B422 71%, #F8ED75 75%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        RAPID
      </span>
    )
  },
  { 
    id: "pixel", 
    label: "Pixel Art",
    preview: (
      <span className="flex gap-[2px]">
        {['#2c77a9', '#46a6cc', '#83c5da', '#d96235', '#e08337', '#e8a74c'].map((color, i) => (
          <span key={i} className="w-[3px] h-[8px] rounded-[1px]" style={{ backgroundColor: color }} />
        ))}
      </span>
    )
  },
];

// Background music URL
const MUSIC_URL = "https://dl.dropboxusercontent.com/scl/fi/kiioubd8rrkikem985ogn/the-shape-of-absence.mp3?rlkey=cy8jobnee3bocnlk1o9c2mjv8&dl=1";

// Volume icon pattern for dot matrix (7x7)
const VOLUME_ICON = [
  [0, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, 0],
];

// Dot Matrix Volume Control Component
function DotMatrixVolumeControl({ 
  value, 
  onChange,
  isDark 
}: { 
  value: number; 
  onChange: (value: number) => void;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const COLS = 10;
  const ROWS = 20;
  
  const drawControl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const cellWidth = width / COLS;
    const cellHeight = height / ROWS;
    const dotRadius = Math.min(cellWidth, cellHeight) * 0.35;
    const fillHeight = height * (value / 100);
    
    const bgColor = isDark ? "#333" : "#ddd";
    const fgColor = isDark ? "#ffffff" : "#222";
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        
        // Check if this dot is part of the icon
        let isIcon = false;
        const iconRows = VOLUME_ICON.length;
        const iconCols = VOLUME_ICON[0].length;
        const iconStartRow = Math.floor(ROWS * 0.6) - Math.floor(iconRows / 2);
        const iconStartCol = Math.floor((COLS - iconCols) / 2);
        
        if (row >= iconStartRow && row < iconStartRow + iconRows && 
            col >= iconStartCol && col < iconStartCol + iconCols) {
          const iconRow = row - iconStartRow;
          const iconCol = col - iconStartCol;
          if (iconRow < iconRows && iconCol < iconCols && VOLUME_ICON[iconRow][iconCol] === 1) {
            isIcon = true;
          }
        }
        
        // Check if this dot should be filled based on volume level
        const isFilled = (height - y) <= fillHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        
        // Icon dots have inverted colors when filled
        if (isIcon) {
          ctx.fillStyle = isFilled ? bgColor : fgColor;
        } else {
          ctx.fillStyle = isFilled ? fgColor : bgColor;
        }
        
        ctx.fill();
      }
    }
  }, [value, isDark]);
  
  useEffect(() => {
    drawControl();
  }, [drawControl]);
  
  useEffect(() => {
    const handleResize = () => drawControl();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawControl]);
  
  const updateFromPosition = useCallback((clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
    onChange(Math.round(percentage * 100));
  }, [onChange]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.clientY);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.touches[0].clientY);
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateFromPosition(e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateFromPosition(e.touches[0].clientY);
    };
    
    const handleEnd = () => {
      setIsDragging(false);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, updateFromPosition]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-[50px] h-[100px] cursor-pointer select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

function PreciseSlider({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  unit = "", 
  onChange 
}: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  unit?: string; 
  onChange: (val: number) => void;
}) {
  const displayValue = unit === "%" ? Math.round(value * 100) : value;
  
  const increment = () => {
    const newVal = Math.min(max, value + step);
    onChange(Number(newVal.toFixed(3)));
  };
  
  const decrement = () => {
    const newVal = Math.max(min, value - step);
    onChange(Number(newVal.toFixed(3)));
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-mono text-black-alpha-40 flex justify-between">
        {label} <span>{displayValue}{unit}</span>
      </label>
      <div className="flex items-center gap-6">
        <button 
          onClick={decrement}
          className="w-20 h-20 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-4 text-black-alpha-48 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-3 bg-black-alpha-8 rounded-full appearance-none cursor-pointer accent-heat-100"
        />
        <button 
          onClick={increment}
          className="w-20 h-20 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-4 text-black-alpha-48 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { selectedFont, setSelectedFont, dismissOnboarding } = useFontContext();
  const { selectedStyle, setSelectedStyle } = useTitleStyleContext();
  const { settings: ledSettings, setSettings: setLedSettings } = useLEDContext();
  
  // Try to use avatar context, with fallback
  let avatarContext: ReturnType<typeof useAvatarContext> | null = null;
  try {
    avatarContext = useAvatarContext();
  } catch {
    // Avatar context not available
  }
  
  // Try to use footer effect context, with fallback
  let footerEffectContext: ReturnType<typeof useFooterEffectContext> | null = null;
  try {
    footerEffectContext = useFooterEffectContext();
  } catch {
    // Footer effect context not available
  }
  
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      
      // Load saved state
      const savedVolume = localStorage.getItem("app-volume");
      const savedPlaying = localStorage.getItem("app-music-playing");
      
      if (savedVolume) {
        const vol = parseInt(savedVolume);
        setVolume(vol);
        audioRef.current.volume = vol / 100;
      } else {
        // Set default volume to 10% if no saved state
        audioRef.current.volume = 0.1;
      }
      
      // Autoplay by default on first user interaction (browser restriction)
      // If no saved state exists or if saved state was playing, attempt autoplay
      const shouldAutoplay = savedPlaying === null || savedPlaying === "true";
      
      if (shouldAutoplay) {
        const attemptPlay = () => {
          audioRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        };
        document.addEventListener("click", attemptPlay, { once: true });
        document.addEventListener("keydown", attemptPlay, { once: true });
        document.addEventListener("touchstart", attemptPlay, { once: true });
      }
    }
    
    setMounted(true);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    localStorage.setItem("app-volume", volume.toString());
  }, [volume]);

  // Save playing state
  useEffect(() => {
    localStorage.setItem("app-music-playing", isPlaying.toString());
  }, [isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Audio play failed:", err);
        });
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFontChange = (fontId: FontChoice) => {
    setSelectedFont(fontId);
    dismissOnboarding();
  };

  const currentTheme = theme === "system" ? "system" : theme;
  const isDarkResolved = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <div className="w-36 h-36 rounded-8 bg-black-alpha-4" />
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-36 h-36 flex items-center justify-center rounded-8 transition-colors duration-200",
          isOpen ? "bg-black-alpha-12" : "bg-black-alpha-4 hover:bg-black-alpha-8"
        )}
        whileTap={{ scale: 0.92 }}
        aria-label="Open settings"
        aria-expanded={isOpen}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-accent-black transition-transform duration-300",
            isOpen && "rotate-90"
          )}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[280px] z-50"
          >
            <div className="bg-background-base border border-border-faint rounded-12 shadow-2xl overflow-hidden max-h-[70vh] flex flex-col">
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-black-alpha-20 scrollbar-track-transparent">
              {/* Font Section */}
              <div className="border-b border-border-faint">
                <div className="px-16 py-12">
                  <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                    </svg>
                    <span>Font</span>
                  </div>
                  
                  <div className="space-y-1">
                    {fontOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFontChange(option.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-12 py-10 rounded-8 text-left transition-all duration-150",
                          selectedFont === option.id
                            ? "bg-black-alpha-8 text-accent-black"
                            : "text-black-alpha-64 hover:bg-black-alpha-4 hover:text-accent-black"
                        )}
                      >
                        <span className="text-[13px]">{option.label}</span>
                        {selectedFont === option.id && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-heat-100">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title Style Section */}
              <div className="border-b border-border-faint">
                <div className="px-16 py-12">
                  <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span>Title Style</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {titleStyleOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedStyle(option.id)}
                        className={cn(
                          "flex flex-col items-center justify-center px-8 py-10 rounded-8 text-center transition-all duration-150 min-h-[60px]",
                          selectedStyle === option.id
                            ? "bg-black-alpha-8 text-accent-black ring-1 ring-heat-100/50"
                            : "text-black-alpha-64 hover:bg-black-alpha-4 hover:text-accent-black"
                        )}
                      >
                        <div className="mb-2 h-[12px] flex items-center justify-center">
                          {option.preview}
                        </div>
                        <span className="text-[10px]">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar Section */}
              {avatarContext && (
                <div className="border-b border-border-faint">
                  <div className="px-16 py-12">
                    <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                      </svg>
                      <span>Avatar Animation</span>
                    </div>
                    
                    {/* Navigation Arrows and Current */}
                    <div className="flex items-center justify-between mb-8">
                      <button
                        onClick={avatarContext.handlePrevious}
                        className="w-28 h-28 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-6 transition-colors"
                        aria-label="Previous avatar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                      <span className="text-[12px] font-medium text-accent-black">
                        {ANIMATION_LABELS[avatarContext.currentAnimation]}
                      </span>
                      <button
                        onClick={avatarContext.handleNext}
                        className="w-28 h-28 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-6 transition-colors"
                        aria-label="Next avatar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-2">
                      {ANIMATIONS.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => avatarContext?.setCurrentIndex(index)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === avatarContext.currentIndex
                              ? "bg-heat-100 scale-125"
                              : "bg-black-alpha-20 hover:bg-black-alpha-40"
                          )}
                          aria-label={`Select ${ANIMATION_LABELS[ANIMATIONS[index]]}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Effect Section */}
              {footerEffectContext && (
                <div className="border-b border-border-faint">
                  <div className="px-16 py-12">
                    <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                        <path d="M12 22V12" />
                      </svg>
                      <span>Footer Effect</span>
                    </div>
                    
                    {/* Navigation Arrows and Current */}
                    <div className="flex items-center justify-between mb-8">
                      <button
                        onClick={footerEffectContext.handlePrevious}
                        className="w-28 h-28 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-6 transition-colors"
                        aria-label="Previous effect"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                      <span className="text-[12px] font-medium text-accent-black">
                        {EFFECT_LABELS[footerEffectContext.currentEffect]}
                      </span>
                      <button
                        onClick={footerEffectContext.handleNext}
                        className="w-28 h-28 flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-8 rounded-6 transition-colors"
                        aria-label="Next effect"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Effect Options */}
                    <div className="grid grid-cols-3 gap-2">
                      {EFFECTS.map((effect) => (
                        <button
                          key={effect}
                          onClick={() => footerEffectContext?.setCurrentEffect(effect)}
                          className={cn(
                            "px-8 py-6 rounded-6 text-[10px] font-medium transition-all duration-150 text-center",
                            footerEffectContext.currentEffect === effect
                              ? "bg-black-alpha-8 text-accent-black ring-1 ring-heat-100/50"
                              : "text-black-alpha-48 hover:bg-black-alpha-4 hover:text-accent-black"
                          )}
                        >
                          {EFFECT_LABELS[effect]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LED Section */}
              <div className="border-b border-border-faint">
                <div className="px-16 py-12">
                  <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M6 10h12v4H6z" />
                    </svg>
                    <span>LED Display</span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Text Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-black-alpha-40">Text</label>
                      <input 
                        type="text" 
                        value={ledSettings.text}
                        onChange={(e) => setLedSettings({ text: e.target.value })}
                        className="w-full bg-black-alpha-4 border border-border-faint rounded-6 px-8 py-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-heat-100/50"
                      />
                    </div>

                    {/* Animation Mode Toggle */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-black-alpha-40">Animation</label>
                      <div className="flex bg-black-alpha-4 rounded-8 p-1">
                        <button
                          onClick={() => setLedSettings({ isStatic: false })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-4 px-8 py-6 rounded-6 text-[11px] transition-all duration-150",
                            !ledSettings.isStatic
                              ? "bg-background-base text-accent-black shadow-sm"
                              : "text-black-alpha-48 hover:text-accent-black"
                          )}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                          Scroll
                        </button>
                        <button
                          onClick={() => setLedSettings({ isStatic: true })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-4 px-8 py-6 rounded-6 text-[11px] transition-all duration-150",
                            ledSettings.isStatic
                              ? "bg-background-base text-accent-black shadow-sm"
                              : "text-black-alpha-48 hover:text-accent-black"
                          )}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <line x1="9" y1="12" x2="15" y2="12"/>
                          </svg>
                          Static
                        </button>
                      </div>
                    </div>

                    {/* Font and Case selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-black-alpha-40">Font</label>
                        <select 
                          value={ledSettings.font}
                          onChange={(e) => setLedSettings({ font: e.target.value as LEDFont })}
                          className="w-full bg-black-alpha-4 border border-border-faint rounded-6 px-4 py-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-heat-100/50 appearance-none cursor-pointer text-accent-black [&>option]:bg-background-base [&>option]:text-accent-black"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23888888\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                        >
                          <option value="departure-mono">Departure Mono</option>
                          <option value="suisse-intl">SuisseIntl</option>
                          <option value="space-grotesk">Space Grotesk</option>
                          <option value="teko">Teko</option>
                          <option value="orbitron">Orbitron</option>
                          <option value="vt323">VT323</option>
                          <option value="press-start-2p">Press Start 2P</option>
                          <option value="wallpoet">Wallpoet</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-black-alpha-40">Case</label>
                        <select 
                          value={ledSettings.textTransform}
                          onChange={(e) => setLedSettings({ textTransform: e.target.value as LEDTransform })}
                          className="w-full bg-black-alpha-4 border border-border-faint rounded-6 px-4 py-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-heat-100/50 appearance-none cursor-pointer text-accent-black [&>option]:bg-background-base [&>option]:text-accent-black"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23888888\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                        >
                          <option value="none">Sentence case</option>
                          <option value="lowercase">lowercase</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="capitalize">Capitalize Each Word</option>
                        </select>
                      </div>
                    </div>

                    {/* Text Color Picker */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-black-alpha-40 flex justify-between">
                        Text Color <span style={{ color: ledSettings.textColor }}>{ledSettings.textColor}</span>
                      </label>
                      <div className="flex items-center gap-8">
                        <input 
                          type="color" 
                          value={ledSettings.textColor}
                          onChange={(e) => setLedSettings({ textColor: e.target.value })}
                          className="w-32 h-24 bg-transparent border border-border-faint rounded-6 cursor-pointer"
                        />
                        <div className="flex gap-4 flex-1">
                          {["#CCFF00", "#FF6B35", "#00FFFF", "#FF00FF", "#FFFFFF", "#FFD700"].map((color) => (
                            <button
                              key={color}
                              onClick={() => setLedSettings({ textColor: color })}
                              className={cn(
                                "w-20 h-20 rounded-full border-2 transition-all",
                                ledSettings.textColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-4">
                      {/* Hue Slider */}
                      <PreciseSlider 
                        label="Hue"
                        value={ledSettings.hue}
                        min={0}
                        max={359}
                        step={1}
                        onChange={(hue) => setLedSettings({ hue })}
                      />

                      {/* Duration Slider */}
                      <PreciseSlider 
                        label="Speed"
                        value={ledSettings.duration}
                        min={1}
                        max={30}
                        step={0.5}
                        unit="s"
                        onChange={(duration) => setLedSettings({ duration })}
                      />

                      {/* BG Lightness Slider */}
                      <PreciseSlider 
                        label="Glow"
                        value={ledSettings.bgLight}
                        min={0}
                        max={1}
                        step={0.01}
                        unit="%"
                        onChange={(bgLight) => setLedSettings({ bgLight })}
                      />

                      {/* Scale Slider */}
                      <PreciseSlider 
                        label="Scale"
                        value={ledSettings.scale}
                        min={0.5}
                        max={2}
                        step={0.1}
                        unit="x"
                        onChange={(scale) => setLedSettings({ scale })}
                      />

                      {/* Font Size Slider */}
                      <PreciseSlider 
                        label="Text Size"
                        value={ledSettings.fontSize}
                        min={24}
                        max={96}
                        step={2}
                        unit="px"
                        onChange={(fontSize) => setLedSettings({ fontSize })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div className="border-b border-border-faint">
                <div className="px-16 py-12">
                  <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-8">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    <span>Theme</span>
                  </div>
                  
                  <div className="flex bg-black-alpha-4 rounded-8 p-1">
                    {[
                      { id: "light", label: "Light", icon: "" },
                      { id: "dark", label: "Dark", icon: "" },
                      { id: "system", label: "Auto", icon: "" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 px-8 py-6 rounded-6 text-[12px] transition-all duration-150",
                          currentTheme === option.id
                            ? "bg-background-base text-accent-black shadow-sm"
                            : "text-black-alpha-48 hover:text-accent-black"
                        )}
                      >
                        <span className="text-[10px]">{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Section */}
              <div>
                <div className="px-16 py-12">
                  <div className="flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-black-alpha-40 mb-12">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    <span>Music</span>
                  </div>
                  
                  {/* Dot Matrix Volume Control + Play Button */}
                  <div className="flex items-center gap-16">
                    {/* Dot Matrix Control */}
                    <div className="flex flex-col items-center">
                      <DotMatrixVolumeControl 
                        value={volume} 
                        onChange={setVolume}
                        isDark={isDarkResolved}
                      />
                      <div className="text-[10px] font-mono uppercase tracking-wider text-black-alpha-40 mt-4">
                        Volume
                      </div>
                      <div className="text-[10px] font-mono text-heat-100">
                        {volume}%
                      </div>
                    </div>
                    
                    {/* Play/Pause + Info */}
                    <div className="flex-1 flex flex-col gap-8">
                      <button
                        onClick={toggleMusic}
                        className={cn(
                          "w-full flex items-center justify-center gap-8 px-12 py-10 rounded-8 transition-all duration-150",
                          isPlaying
                            ? "bg-heat-100 text-white"
                            : "bg-black-alpha-8 text-accent-black hover:bg-black-alpha-12"
                        )}
                      >
                        {isPlaying ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                            <span className="text-[12px] font-medium">Pause</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span className="text-[12px] font-medium">Play</span>
                          </>
                        )}
                      </button>
                      
                      {/* Music info */}
                      {isPlaying && (
                        <div className="flex items-center gap-6 text-[10px] text-black-alpha-32">
                          <div className="flex gap-1">
                            <span className="w-1 h-3 bg-heat-100 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-3 bg-heat-100 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-3 bg-heat-100 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span>Now Playing</span>
                        </div>
                      )}
                      
                      {/* Quick presets */}
                      <div className="flex gap-4">
                        {[0, 10, 50, 100].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setVolume(preset)}
                            className={cn(
                              "flex-1 py-4 rounded-4 text-[10px] font-mono transition-all duration-150",
                              volume === preset
                                ? "bg-heat-100 text-white"
                                : "bg-black-alpha-4 text-black-alpha-48 hover:bg-black-alpha-8 hover:text-accent-black"
                            )}
                          >
                            {preset === 0 ? "Mute" : `${preset}%`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Close Button */}
              <div className="border-t border-border-faint flex-shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-12 text-[13px] text-black-alpha-48 hover:text-accent-black hover:bg-black-alpha-4 transition-all duration-150"
                >
                  Close Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

