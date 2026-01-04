"use client";

import React, { useEffect, useState, useRef } from "react";
import "@/styles/ps2-startup.css";

interface PS2StartupScreenProps {
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export const PS2StartupScreen: React.FC<PS2StartupScreenProps> = ({
  onComplete,
  duration = 8000, // Default 8 seconds to match animation
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create and play PS2 startup sound
    audioRef.current = new Audio("/audio/ps2.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Fade out and stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      onComplete();
    }, duration);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  // Generate 112 box containers for the 3D grid effect
  const boxes = Array.from({ length: 112 }, (_, i) => (
    <div key={i} className="ps2-box-container">
      <div className="ps2-box">
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </div>
  ));

  return (
    <div className="ps2-screen">
      <div className="ps2-content">
        <p className="ps2-copyright">Kracked Computer Entertainment</p>
        <p className="ps2-branding">
          KrackedStation
          <span className="is-small">®</span>
          &nbsp;2
        </p>
      </div>
      <div className="ps2-inner">
        <div className="ps2-inner-bg"></div>
        <div className="ps2-particles">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {boxes}
      </div>
    </div>
  );
};

export default PS2StartupScreen;

