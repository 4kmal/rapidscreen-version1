"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/utils/cn";

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface HoverScrambleTextProps {
  children: string;
  className?: string;
  /** Speed multiplier for the animation (default: 0.8) */
  speed?: number;
  /** Number of scramble iterations per character (default: 8) */
  scrambleIterations?: number;
  /** Step size for revealing characters (default: 2) */
  step?: number;
  /** Whether to show glitch CSS effect (RGB split) on hover (default: true) */
  showGlitch?: boolean;
  /** Characters to ignore during scrambling (default: [" "]) */
  ignoreChars?: string[];
  /** Custom scramble character set */
  scrambleChars?: string;
}

/**
 * HoverScrambleText - A text component that scrambles on hover
 * Inspired by AWGE-style glitch effects
 */
export default function HoverScrambleText({
  children,
  className,
  speed = 0.8,
  scrambleIterations = 8,
  step = 2,
  showGlitch = true,
  ignoreChars = [" "],
  scrambleChars = SCRAMBLE_CHARS,
}: HoverScrambleTextProps) {
  const text = children;
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrambleStateRef = useRef<number[]>([]);
  const revealIndexRef = useRef(0);

  const getRandomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const shouldIgnore = useCallback(
    (char: string) => ignoreChars.includes(char),
    [ignoreChars]
  );

  const startScramble = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsScrambling(true);
    
    // Initialize scramble state - each index holds remaining scramble iterations
    scrambleStateRef.current = text.split("").map((char) =>
      shouldIgnore(char) ? 0 : scrambleIterations
    );
    revealIndexRef.current = 0;

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
        if (revealIndexRef.current < text.length) {
          const currentIndex = revealIndexRef.current;
          if (!shouldIgnore(text[currentIndex])) {
            scrambleStateRef.current[currentIndex] = Math.max(
              0,
              scrambleStateRef.current[currentIndex] - 1
            );
          }
          revealIndexRef.current++;
        }
      }

      // Build display text
      let result = "";
      let allDone = true;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const remaining = scrambleStateRef.current[i];

        if (shouldIgnore(char)) {
          result += char;
        } else if (remaining > 0) {
          result += getRandomChar();
          allDone = false;
          // Decrement remaining scramble iterations
          scrambleStateRef.current[i] = remaining - 1;
        } else {
          result += char;
        }
      }

      setDisplayText(result);

      if (allDone) {
        setIsScrambling(false);
        setDisplayText(text);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [text, speed, scrambleIterations, step, getRandomChar, shouldIgnore]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    startScramble();
  }, [startScramble]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update display text when children change
  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(text);
    }
  }, [text, isScrambling]);

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-block cursor-pointer transition-all duration-100",
        showGlitch && isHovering && "hover-glitch-active",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-text={text}
      style={{
        position: "relative",
      }}
    >
      {displayText}
      
      {/* CSS Glitch layers */}
      {showGlitch && (
        <>
          <style jsx>{`
            .hover-glitch-active {
              animation: textGlitchShake 0.3s ease-in-out;
            }
            
            .hover-glitch-active::before,
            .hover-glitch-active::after {
              content: attr(data-text);
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0.8;
              pointer-events: none;
            }
            
            .hover-glitch-active::before {
              animation: glitchBefore 0.3s infinite;
              color: #F45555;
              z-index: -1;
              clip-path: inset(0 0 50% 0);
            }
            
            .hover-glitch-active::after {
              animation: glitchAfter 0.3s infinite;
              color: #395CC9;
              z-index: -2;
              clip-path: inset(50% 0 0 0);
            }
            
            @keyframes textGlitchShake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-2px) skew(1deg); }
              40% { transform: translateX(-1px) skew(-1deg); }
              60% { transform: translateX(2px) skew(1deg); }
              80% { transform: translateX(1px) skew(-1deg); }
            }
            
            @keyframes glitchBefore {
              0% { transform: translateX(0); }
              20% { transform: translateX(-3px); }
              40% { transform: translateX(-2px); }
              60% { transform: translateX(3px); }
              80% { transform: translateX(2px); }
              100% { transform: translateX(0); }
            }
            
            @keyframes glitchAfter {
              0% { transform: translateX(0); }
              20% { transform: translateX(3px); }
              40% { transform: translateX(2px); }
              60% { transform: translateX(-3px); }
              80% { transform: translateX(-2px); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </span>
  );
}

