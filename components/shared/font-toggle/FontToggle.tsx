"use client";

import React, { useEffect, useState } from "react";
import { useFontContext, FontChoice } from "../font-context/FontContext";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const fontOptions: { id: FontChoice; label: string; shortLabel: string }[] = [
  { id: "default", label: "SuisseIntl", shortLabel: "1" },
  { id: "departure-mono", label: "Departure Mono", shortLabel: "2" },
  { id: "space-grotesk", label: "Space Grotesk", shortLabel: "3" },
];

export default function FontToggle() {
  const { selectedFont, setSelectedFont, showOnboarding, dismissOnboarding } = useFontContext();
  const [pulseIndex, setPulseIndex] = useState(0);

  // Animate through buttons during onboarding
  useEffect(() => {
    if (!showOnboarding) return;
    
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 3);
    }, 800);
    
    return () => clearInterval(interval);
  }, [showOnboarding]);

  const handleFontChange = (fontId: FontChoice) => {
    setSelectedFont(fontId);
    if (showOnboarding) {
      dismissOnboarding();
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Label */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-black-alpha-40 hidden lg:block">
        Font
      </span>
      
      {/* Toggle Buttons */}
      <div className="relative flex items-center bg-black-alpha-4 rounded-6 p-1 gap-0.5">
        {fontOptions.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleFontChange(option.id)}
            className={cn(
              "relative px-2.5 py-1 text-[11px] font-mono font-medium rounded-[4px] transition-all duration-200",
              "hover:text-accent-black",
              selectedFont === option.id
                ? "bg-background-base text-accent-black shadow-sm"
                : "text-black-alpha-48 hover:bg-black-alpha-4",
              showOnboarding && pulseIndex === index && "ring-2 ring-heat-100 ring-offset-1"
            )}
            title={option.label}
          >
            <span className="relative z-10">{option.shortLabel}</span>
            
            {/* Active indicator dot */}
            {selectedFont === option.id && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-heat-100 rounded-full" />
            )}
          </button>
        ))}
        
        {/* Onboarding pulse ring */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -inset-1 rounded-8 border-2 border-heat-100 pointer-events-none"
              style={{
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Current font name */}
      <span className="text-[10px] font-mono text-black-alpha-32 hidden xl:block min-w-[100px]">
        {fontOptions.find(f => f.id === selectedFont)?.label}
      </span>

      {/* Onboarding Tooltip */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="relative rounded-8 px-4 py-3 shadow-xl min-w-[220px]" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
              {/* Arrow pointing up */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent" style={{ borderBottomColor: '#1a1a1a' }} />
              
              <div className="flex items-start gap-3">
                {/* Animated icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-heat-100 mt-0.5 flex-shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7V4h16v3" />
                    <path d="M9 20h6" />
                    <path d="M12 4v16" />
                  </svg>
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-[13px] font-medium leading-tight mb-1">
                    Try Different Fonts!
                  </p>
                  <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Click 1, 2 or 3 to preview how titles look
                  </p>
                </div>
              </div>
              
              {/* Dismiss button */}
              <button
                onClick={dismissOnboarding}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-heat-100 hover:bg-heat-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

// Compact version for mobile
export function FontToggleCompact() {
  const { selectedFont, setSelectedFont } = useFontContext();
  
  const cycleFont = () => {
    const currentIndex = fontOptions.findIndex(f => f.id === selectedFont);
    const nextIndex = (currentIndex + 1) % fontOptions.length;
    setSelectedFont(fontOptions[nextIndex].id);
  };

  return (
    <button
      onClick={cycleFont}
      className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono bg-black-alpha-4 hover:bg-black-alpha-8 rounded-4 transition-colors"
      title={`Font: ${fontOptions.find(f => f.id === selectedFont)?.label}`}
    >
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="opacity-60"
      >
        <text x="2" y="18" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">A</text>
        <text x="12" y="18" fontSize="10" stroke="none" fill="currentColor">a</text>
      </svg>
      <span className="text-black-alpha-64">
        {fontOptions.findIndex(f => f.id === selectedFont) + 1}
      </span>
    </button>
  );
}
