"use client";

import React, { useState, useEffect } from "react";
import { useLEDContext } from "@/components/shared/led-context/LEDContext";
import { cn } from "@/utils/cn";

export default function TrustedBySection() {
  const { settings } = useLEDContext();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check screen size for responsive font
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 996);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <section className="w-full bg-background-base border-b lg:border-t-0 border-t border-border-faint min-h-[120px]" />
    );
  }

  const { hue, duration, bgLight, scale, text, font, textTransform, fontSize, textColor, isStatic } = settings;

  // Use responsive font size: 30px for mobile (<996px), 40px for desktop
  // If user has customized fontSize (not default 40), use their custom value
  const isDefaultFontSize = fontSize === 40;
  const responsiveFontSize = isDefaultFontSize 
    ? (isMobile ? 30 : 40) 
    : fontSize;

  const getFontFamily = () => {
    switch (font) {
      case "departure-mono": return "'Departure Mono', monospace";
      case "suisse-intl": return "'SuisseIntl', sans-serif";
      case "space-grotesk": return "'Space Grotesk', sans-serif";
      case "teko": return "'Teko', sans-serif";
      case "orbitron": return "'Orbitron', sans-serif";
      case "vt323": return "'VT323', monospace";
      case "press-start-2p": return "'Press Start 2P', cursive";
      case "wallpoet": return "'Wallpoet', cursive";
      default: return "'Departure Mono', monospace";
    }
  };

  const getTransformText = (t: string) => {
    if (textTransform === "capitalize") {
      return t.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    return t;
  };

  const displayTransform = textTransform === "capitalize" ? "none" : textTransform;

  return (
    <section className="w-full bg-background-base border-b lg:border-t-0 border-t border-border-faint py-20 flex justify-center items-center overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Press+Start+2P&family=Teko:wght@300..700&family=VT323&family=Wallpoet&display=swap');

        .board-container {
          position: relative;
          border: 2px solid hsl(0 0% 16%);
          border-radius: 4px;
          transform: scale(${scale});
          transition: transform 0.3s ease;
          background: #000;
        }

        .board-container::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: linear-gradient(-68deg, #0000 63% 69.5%, #fff 70% 80%, #0000 80.5% 82.5%, #fff 82% 86.5%, #0000 87% 100%);
          z-index: 3;
          opacity: 0.12;
          mix-blend-mode: plus-lighter;
          pointer-events: none;
        }

        .rivets {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }

        .rivet {
          background: hsl(0 0% 10%);
          position: absolute;
          width: 8px;
          aspect-ratio: 1;
          border-radius: 50%;
          box-shadow: 0.5px 0.5px 0px hsl(0 0% 100% / 0.2) inset;
        }

        .rivet::after {
          content: '';
          height: 1.5px;
          width: 80%;
          border-radius: 10px;
          background: hsl(0 0% 0%);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          box-shadow: 0 -1px hsl(0 0% 100% / 0.2) inset;
        }

        .rivet:nth-of-type(1) { left: calc(100% + 4px); bottom: calc(100% + 4px); }
        .rivet:nth-of-type(2) { right: calc(100% + 4px); bottom: calc(100% + 4px); }
        .rivet:nth-of-type(3) { right: calc(100% + 4px); top: calc(100% + 4px); }
        .rivet:nth-of-type(4) { left: calc(100% + 4px); top: calc(100% + 4px); }

        .board {
          --size: 4px;
          font-family: ${getFontFamily()};
          font-size: ${responsiveFontSize}px;
          font-weight: 300;
          letter-spacing: 0.035em;
          text-transform: ${displayTransform};
          white-space: nowrap;
          width: 900px;
          max-width: 90vw;
          padding-block: 0.75rem;
          line-height: 1;
          overflow: hidden;
          background: oklch(0.5 0.18 ${hue} / ${bgLight});
          position: relative;
          filter: contrast(2) brightness(1.5) saturate(2);
          transform: translateZ(0);
        }

        .board::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          mix-blend-mode: plus-lighter;
          filter: brightness(1.1);
          background: radial-gradient(circle at center, hsl(0 0% 20%) 1px, transparent 4px) 50% 50% / var(--size) var(--size);
          transform: translateZ(0);
          pointer-events: none;
        }

        .board__content {
          filter: blur(1px) contrast(1.2) brightness(1) saturate(1.6);
          color: ${textColor};
          height: 100%;
          width: 100%;
          mask: radial-gradient(circle at center, #000 1px, #0000 1px) 50% 50% / var(--size) var(--size);
          transform: translateZ(0);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: ${isStatic ? 'center' : 'flex-start'};
        }
        
        .text-track {
          display: flex;
          width: ${isStatic ? 'auto' : 'max-content'};
          animation: ${isStatic ? 'none' : `slide ${duration}s linear infinite`};
          will-change: ${isStatic ? 'auto' : 'transform'};
          color: ${textColor};
          filter: blur(0.5px) contrast(1) saturate(1) hue-rotate(0deg) brightness(1);
          transform: translateZ(0);
          justify-content: ${isStatic ? 'center' : 'flex-start'};
        }
        
        .text {
          flex-shrink: 0;
          padding-right: ${isStatic ? '0' : '900px'};
          filter: blur(1px) drop-shadow(0 0 2px oklch(0.1 0.4383 ${hue} / 0.8)) contrast(3) brightness(1.4);
          text-align: center;
          text-shadow: 0 0 2px white;
          transform: translateZ(0);
        }

        @keyframes slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="board-container">
        <div className="rivets">
          <div className="rivet"></div>
          <div className="rivet"></div>
          <div className="rivet"></div>
          <div className="rivet"></div>
        </div>
        <div className="board">
          <div className="board__content">
            <div className="text-track">
              <div className="text">{getTransformText(text)}</div>
              {!isStatic && <div className="text text--clone">{getTransformText(text)}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
