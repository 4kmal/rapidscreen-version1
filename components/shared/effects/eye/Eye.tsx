"use client";

import React, { useRef, useEffect, useCallback } from 'react';

interface EyeProps {
  size?: string;
  className?: string;
}

export default function Eye({ size = "200px", className = "" }: EyeProps) {
  const ballRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLSpanElement>(null);

  const updateEyePosition = useCallback((e: PointerEvent | MouseEvent) => {
    const ball = ballRef.current;
    const iris = irisRef.current;
    if (!ball || !iris) return;

    const rect = ball.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Use clientX/clientY for viewport-relative coordinates (matches getBoundingClientRect)
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate distance and angle from center of eye to cursor
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Maximum movement radius as percentage of eyeball size (iris can move up to 25% of container)
    const maxRadius = rect.width * 0.2;
    
    // Calculate actual movement (clamped to maxRadius)
    const clampedDistance = Math.min(distance, maxRadius * 5);
    const movementRatio = clampedDistance / (maxRadius * 5);
    const moveX = Math.cos(angle) * maxRadius * movementRatio;
    const moveY = Math.sin(angle) * maxRadius * movementRatio;
    
    // Calculate slight scale based on distance for "looking hard" effect
    const scaleY = 1 - (movementRatio * 0.1);
    
    iris.style.transform = `translate(${moveX}px, ${moveY}px) scaleY(${scaleY})`;
  }, []);

  useEffect(() => {
    // Set initial position to center
    const iris = irisRef.current;
    if (iris) {
      iris.style.transform = 'translate(0px, 0px) scaleY(1)';
    }

    window.addEventListener('pointermove', updateEyePosition, { passive: true });
    
    return () => {
      window.removeEventListener('pointermove', updateEyePosition);
    };
  }, [updateEyePosition]);

  return (
    <div 
      className={`eye-stage ${className}`}
      style={{ 
        width: size, 
        height: size,
        margin: '0 auto'
      }}
    >
      <div 
        ref={ballRef}
        className="eye-ball"
      >
        <span ref={irisRef} className="eye-iris"></span>
      </div>

      <style jsx>{`
        .eye-stage {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .eye-ball {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          margin: 0;
          border-radius: 50%;
          position: relative;
          background: radial-gradient(
            circle at 50% 40%,
            #fcfcfc,
            #efeff1 66%,
            #9b5050 100%
          );
          box-shadow: 
            0 0 40px rgba(155, 80, 80, 0.3),
            0 0 80px rgba(155, 80, 80, 0.15),
            inset 0 -10px 30px rgba(0, 0, 0, 0.1);
        }

        .eye-ball::after {
          content: "";
          position: absolute;
          top: 5%;
          left: 10%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.6) 14%,
            rgba(255, 255, 255, 0) 24%
          );
          transform: translateX(-27%) translateY(-30%) skewX(-20deg);
          pointer-events: none;
        }

        .eye-iris {
          width: 40%;
          height: 40%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            #ff4500 0%,
            #ff6b35 30%,
            #cc3700 100%
          );
          position: relative;
          transition: transform 0.05s ease-out;
          box-shadow: 
            inset 0 0 20px rgba(0, 0, 0, 0.3),
            0 0 15px rgba(255, 69, 0, 0.4);
        }

        .eye-iris::before {
          content: "";
          display: block;
          position: absolute;
          width: 37.5%;
          height: 37.5%;
          border-radius: 50%;
          top: 31.25%;
          left: 31.25%;
          background: radial-gradient(
            circle at 30% 30%,
            #1a1a1a,
            #000000
          );
          box-shadow: 
            0 0 10px rgba(0, 0, 0, 0.5),
            inset 0 0 5px rgba(255, 255, 255, 0.1);
        }

        /* Highlight reflection on pupil */
        .eye-iris::after {
          content: "";
          display: block;
          position: absolute;
          width: 12%;
          height: 12%;
          border-radius: 50%;
          top: 35%;
          left: 38%;
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}
