"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ScrambleHover } from "@/components/ui/scramble";
import FooterFlame from "@/components/shared/effects/flame/footer-flame";
import FooterHeroFlame from "@/components/shared/effects/flame/footer-hero-flame";
import { AsciiExplosion } from "@/components/shared/effects/flame/ascii-explosion";
import { SubtleExplosion } from "@/components/shared/effects/flame/subtle-explosion";
import SubtleWave from "@/components/shared/effects/flame/subtle-wave/subtle-wave";
import { CoreFlame } from "@/components/shared/effects/flame/core-flame";
import { useFooterEffectContext, FooterEffectType } from "@/components/shared/footer-effect-context/FooterEffectContext";

// Blinking Ovo Component
function BlinkingOvo() {
  return (
    <>
      <style jsx>{`
        @keyframes blink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
      `}</style>
      <div className="text-5xl sm:text-6xl font-bold text-heat-100 tracking-tight mb-2">
        <span 
          className="inline-block" 
          style={{ 
            animation: 'blink 4s ease-in-out infinite',
            transformOrigin: 'center center'
          }}
        >
          0
        </span>
        <span className="text-accent-black">v</span>
        <span 
          className="inline-block" 
          style={{ 
            animation: 'blink 4s ease-in-out infinite', 
            animationDelay: '0.1s',
            transformOrigin: 'center center'
          }}
        >
          0
        </span>
      </div>
    </>
  );
}

// Dynamic effect renderer
function FooterEffect({ effect }: { effect: FooterEffectType }) {
  switch (effect) {
    case 'flame':
      return <FooterFlame />;
    case 'hero-flame':
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <FooterHeroFlame />
        </div>
      );
    case 'explosion':
      return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <AsciiExplosion 
            className="opacity-40 !w-[900px] !max-w-full" 
            style={{ width: '900px' }} 
          />
        </div>
      );
    case 'subtle-explosion':
      return <SubtleExplosion opacity={0.15} />;
    case 'subtle-wave':
      return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <SubtleWave className="text-heat-100/30" />
        </div>
      );
    case 'core-flame':
      return <CoreFlame className="left-1/2 -translate-x-1/2" />;
    case 'none':
    default:
      return null;
  }
}

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  
  // Try to use context, fallback to default if not available
  let currentEffect: FooterEffectType = 'flame';
  try {
    const context = useFooterEffectContext();
    currentEffect = context.currentEffect;
  } catch {
    // Context not available, use default
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-background-base text-accent-black font-sans border-t border-border-faint">
      <div className="container mx-auto max-w-[900px] border-x border-border-faint">
        
        {/* Main Branding Section - Centered */}
        <div className="flex justify-center relative min-h-[400px] overflow-hidden">
          {/* ASCII Effect Background - Full Width */}
          {mounted && <FooterEffect effect={currentEffect} />}
          
          <div className="p-10 sm:p-16 pt-12 sm:pt-20 pb-16 sm:pb-24 flex flex-col justify-center items-center text-center w-full max-w-[600px] relative z-10">
            <div className="flex flex-col items-center">
              {/* Blinking 0v0 */}
              <BlinkingOvo />
              
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight uppercase" style={{ fontFamily: "'Departure Mono', monospace" }}>
                  <span className="text-heat-100"><ScrambleHover text="Rapid" /></span><ScrambleHover text="screen" />
                </span>
              </Link>
              <p className="text-2xl sm:text-3xl font-medium leading-snug max-w-sm mx-auto">
                Innovate, Execute, Iterate.
              </p>
              <p className="text-base text-black-alpha-64 mt-3">
              Level 6, Menara Darussalam, 12, Jalan Pinang, Kuala Lumpur, 50450
              </p>
            </div>
          </div>
        </div>

        {/* Footer Base */}
        <div className="p-8 md:px-10 md:py-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 bg-background-base border-t border-border-faint">
          <div className="text-small text-black-alpha-64">
            © 2025 Rapidscreen. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-small text-black-alpha-64">
            <Link href="/terms" className="hover:text-accent-black transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-accent-black transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
