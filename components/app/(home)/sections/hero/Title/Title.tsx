"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Scramble effect characters
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Scrambles text based on progress (0 to 1)
 */
export function encryptText(
  text: string,
  progress: number,
  { randomizeChance = 0.3 }: { randomizeChance?: number } = {}
) {
  const chars = SCRAMBLE_CHARS;
  const length = text.length;
  const revealCount = Math.floor(length * progress);

  return text
    .split("")
    .map((char, i) => {
      if (char === " " || char === "\n" || char === "\r" || char === "\t") return char;
      
      // If we are past the reveal count, scramble
      if (i >= revealCount) {
        return chars[Math.floor(Math.random() * chars.length)];
      }

      // Even if revealed, occasionally flicker a random character if we're not at 100% progress
      if (progress < 1 && Math.random() < randomizeChance * (1 - progress)) {
        return chars[Math.floor(Math.random() * chars.length)];
      }

      return char;
    })
    .join("");
}

// The three cycling words
const CYCLING_WORDS = ["INNOVATE", "EXECUTE", "ITERATE"];

export default function HomeHeroTitle() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(CYCLING_WORDS[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const getRandomChar = useCallback(() => {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }, []);

  const scrambleToWord = useCallback((targetWord: string, onComplete?: () => void) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    
    const scrambleIterations = 12;
    const speed = 0.9;
    const step = 2;
    
    // Initialize scramble state
    const state: number[] = targetWord.split("").map((char) => char === " " ? 0 : scrambleIterations);
    let revealIndex = 0;

    let lastTime = 0;
    const frameInterval = 1000 / (60 * speed);

    const animate = (time: number) => {
      if (time - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      // Reveal characters progressively
      for (let i = 0; i < step; i++) {
        if (revealIndex < targetWord.length) {
          if (targetWord[revealIndex] !== " ") {
            state[revealIndex] = Math.max(0, state[revealIndex] - 1);
          }
          revealIndex++;
        }
      }

      // Build display text
      let result = "";
      let allDone = true;
      for (let i = 0; i < targetWord.length; i++) {
        const char = targetWord[i];
        const remaining = state[i];
        if (char === " ") {
          result += char;
        } else if (remaining > 0) {
          result += getRandomChar();
          allDone = false;
          state[i] = remaining - 1;
        } else {
          result += char;
        }
      }

      setDisplayText(result);

      if (allDone) {
        setDisplayText(targetWord);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [getRandomChar]);

  // Initial scramble animation and cycling
  useEffect(() => {
    // Start initial animation
    scrambleToWord(CYCLING_WORDS[0]);
    
    // Set up cycling every 3 seconds
    const startCycling = () => {
      cycleTimeoutRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          const nextIndex = (prev + 1) % CYCLING_WORDS.length;
          scrambleToWord(CYCLING_WORDS[nextIndex]);
          return nextIndex;
        });
      }, 3000);
    };
    
    // Start cycling after initial animation settles
    const initialDelay = setTimeout(startCycling, 1500);
    
    return () => {
      clearTimeout(initialDelay);
      if (cycleTimeoutRef.current) {
        clearInterval(cycleTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrambleToWord]);

  // Mouse enter triggers immediate scramble to next word
  const handleMouseEnter = useCallback(() => {
    if (!isAnimating) {
      setCurrentWordIndex((prev) => {
        const nextIndex = (prev + 1) % CYCLING_WORDS.length;
        scrambleToWord(CYCLING_WORDS[nextIndex]);
        return nextIndex;
      });
    }
  }, [isAnimating, scrambleToWord]);

  return (
    <div 
      className="text-title-h1 mx-auto text-center [&_span]:text-heat-100 mt-12 lg:mt-16 mb-12 lg:mb-16 cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative">
        <span className="text-heat-100">{displayText}</span>
      </div>
    </div>
  );
}
