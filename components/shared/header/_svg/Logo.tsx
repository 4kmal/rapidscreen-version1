"use client";

import { useTitleStyleContext, TitleStyle } from "@/components/shared/title-style-context/TitleStyleContext";
import { useEffect, useState } from "react";
import Image from "next/image";

// Default logo style - using image
function DefaultLogo() {
  return (
    <Image 
      src="/RS-1.png" 
      alt="RapidScreen" 
      width={180} 
      height={36}
      className="h-[32px] w-auto"
    />
  );
}

// Metal gradient style (white to transparent gradient)
function MetalLogo() {
  return (
    <span className="text-[18px] tracking-tighter">
      <span 
        className="italic font-normal"
        style={{ 
          color: 'oklch(0.7 0.2 250)'
        }}
      >
        RAPID
      </span>
      <span
        className="font-extrabold"
        style={{ 
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        SCREEN
      </span>
    </span>
  );
}

// Chrome/Spotlight metallic style
function ChromeLogo() {
  return (
    <span className="title-style-chrome">
      RAPIDSCREEN
    </span>
  );
}

// Pixel art style with CSS box-shadow characters
function PixelLogo() {
  const letters = [
    { char: "R", className: "char-r" },
    { char: "A", className: "char-a" },
    { char: "P", className: "char-p" },
    { char: "I", className: "char-i" },
    { char: "D", className: "char-d" },
    { char: "S", className: "char-s" },
    { char: "C", className: "char-c" },
    { char: "R", className: "char-r" },
    { char: "E", className: "char-e" },
    { char: "E", className: "char-e" },
    { char: "N", className: "char-n" },
  ];

  return (
    <div className="title-style-pixel">
      {letters.map((letter, index) => (
        <div key={index} className={`pixel-char ${letter.className}`} />
      ))}
    </div>
  );
}

export default function Logo() {
  const [mounted, setMounted] = useState(false);
  
  // Try to use context, but handle case where it might not be available
  let selectedStyle: TitleStyle = "default";
  try {
    const context = useTitleStyleContext();
    selectedStyle = context.selectedStyle;
  } catch {
    // Context not available, use default
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show default during SSR to prevent hydration mismatch
  if (!mounted) {
    return <DefaultLogo />;
  }

  switch (selectedStyle) {
    case "metal":
      return <MetalLogo />;
    case "chrome":
      return <ChromeLogo />;
    case "pixel":
      return <PixelLogo />;
    default:
      return <DefaultLogo />;
  }
}
