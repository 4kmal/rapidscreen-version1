"use client"

import React, { useState, useEffect } from 'react';

interface MySuaraCanvasProps {
  className?: string;
}

const MySuaraCanvas: React.FC<MySuaraCanvasProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false);

  // Auto-animate on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <style jsx>{`
        .stack {
          display: grid;
          grid-template-areas: "stack";
          perspective: 5000px;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-items: center;
        }
        
        .stack::before {
          content: "";
          position: absolute;
          inset: 0;
          background: ${isActive ? 'rgb(15, 23, 42)' : 'rgb(245, 245, 250)'};
          transition: background 2s ease;
          pointer-events: none;
        }

        .card-wrapper {
          grid-area: stack;
          position: relative;
        }

        .card {
          --z-offset: 0;
          --easeInOutCirc: cubic-bezier(0.85, 0, 0.15, 1);
          --bg-opacity: 0%;
          transition: transform 4s ease;
          width: 160px;
          height: 160px;
          box-sizing: border-box;
          color: white;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .card-wrapper:nth-child(1) { z-index: 5; }
        .card-wrapper:nth-child(2) { z-index: 4; }
        .card-wrapper:nth-child(3) { z-index: 3; }
        .card-wrapper:nth-child(4) { z-index: 2; }
        .card-wrapper:nth-child(5) { z-index: 1; }

        /* Label styling */
        .label {
          position: absolute;
          font-size: 0.75rem;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          padding: 0.4ch 0.9ch;
          border-radius: 4ch;
          opacity: 0;
          transition: opacity 0.5s ease, transform 2s var(--easeInOutCirc);
          background: rgba(59, 130, 246, 0.95);
          font-family: system-ui, sans-serif;
          color: white;
          letter-spacing: 0.02em;
          --easeInOutCirc: cubic-bezier(0.85, 0, 0.15, 1);
        }

        /* Initial label positioning (stacked at center) */
        .card-wrapper .label { 
          left: -130px; 
          top: 50%;
          transform: translateY(-50%) translateX(-10px);
        }

        /* Active state - labels spread to match layer heights */
        .stack.active .card-wrapper:nth-child(1) .label { 
          top: -80px;
          left: -130px;
          transform: translateY(0) translateX(0);
        }
        .stack.active .card-wrapper:nth-child(2) .label { 
          top: -35px;
          left: -130px;
          transform: translateY(0) translateX(0);
        }
        .stack.active .card-wrapper:nth-child(3) .label { 
          top: 10px;
          left: -130px;
          transform: translateY(0) translateX(0);
        }
        .stack.active .card-wrapper:nth-child(4) .label { 
          top: 55px;
          left: -130px;
          transform: translateY(0) translateX(0);
        }
        .stack.active .card-wrapper:nth-child(5) .label { 
          top: 100px;
          left: -130px;
          transform: translateY(0) translateX(0);
        }

        /* Active state styles */
        .stack.active .card {
          --bg-opacity: 5%;
          transition-duration: 2s;
          transition-timing-function: var(--easeInOutCirc);
        }

        .stack.active .card-wrapper:nth-child(1) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(160px) translateY(30px) translateX(30px); 
        }
        .stack.active .card-wrapper:nth-child(2) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(110px) translateY(35px) translateX(35px); 
        }
        .stack.active .card-wrapper:nth-child(3) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(60px) translateY(40px) translateX(40px); 
        }
        .stack.active .card-wrapper:nth-child(4) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(10px) translateY(45px) translateX(45px); 
        }
        .stack.active .card-wrapper:nth-child(5) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(-40px) translateY(50px) translateX(50px); 
        }

        .stack.active .label {
          opacity: 1;
        }

        .stack.active .card-wrapper:nth-child(1) .label { transition-delay: 1.5s; }
        .stack.active .card-wrapper:nth-child(2) .label { transition-delay: 1.6s; }
        .stack.active .card-wrapper:nth-child(3) .label { transition-delay: 1.7s; }
        .stack.active .card-wrapper:nth-child(4) .label { transition-delay: 1.8s; }
        .stack.active .card-wrapper:nth-child(5) .label { transition-delay: 1.9s; }

        /* Content card */
        .card.content {
          transition: 
            border-color 4s ease,
            background-color 5s ease 2s,
            color 4s ease 0s,
            transform 4s ease 0s;
          padding: 14px;
          font-size: 0.65rem;
          line-height: 1.4;
          background: rgb(255, 255, 255);
          border: 3px solid #3B82F6;
          color: #1a1a2e;
          font-family: system-ui, sans-serif;
          overflow: hidden;
        }

        .stack.active .card.content {
          background: transparent;
          color: white;
          border-color: transparent;
          transition: 
            border-color 1s var(--easeInOutCirc) 0s,
            background-color 1s var(--easeInOutCirc) 0s,
            color 1s var(--easeInOutCirc) 0s,
            transform 2s var(--easeInOutCirc) 0s;
        }

        /* Padding card */
        .card.padding {
          background: transparent;
          transition-delay: 0.1s;
        }

        .card.padding::before {
          content: "";
          position: absolute;
          inset: 0;
          clip-path: polygon(
            0% 0%, 0% 100%, 
            14px 100%, 14px 14px, 
            calc(100% - 14px) 14px, 
            calc(100% - 14px) calc(100% - 14px), 
            14px calc(100% - 14px), 14px 100%, 
            100% 100%, 100% 0%
          );
          background: repeating-linear-gradient(
            -45deg, 
            #60A5FA, #60A5FA 1px, 
            rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 6px
          );
        }

        /* Border card */
        .card.border {
          background: transparent;
          transition-delay: 0.2s;
        }

        .card.border::before {
          content: "";
          position: absolute;
          inset: 0;
          clip-path: polygon(
            0% 0%, 0% 100%, 
            3px 100%, 3px 3px, 
            calc(100% - 3px) 3px, 
            calc(100% - 3px) calc(100% - 3px), 
            3px calc(100% - 3px), 3px 100%, 
            100% 100%, 100% 0%
          );
          background: linear-gradient(135deg, #3B82F6, #60A5FA);
        }

        /* Background card */
        .card.background {
          transition: 
            background-color 4s ease 0.3s,
            transform 4s ease 0.3s;
        }

        .stack.active .card.background {
          background: white;
          transition: 
            background-color 2s var(--easeInOutCirc) 0.3s, 
            transform 2s var(--easeInOutCirc) 0.2s;
        }

        /* Box shadow card */
        .card.box-shadow {
          background: transparent;
          transition: 
            box-shadow 4s ease 0.4s,
            transform 4s ease 0.4s;
          box-shadow:
            0 2.8px 2.2px rgba(0, 0, 0, 0.02),
            0 6.7px 5.3px rgba(0, 0, 0, 0.028),
            0 12.5px 10px rgba(0, 0, 0, 0.035),
            0 22.3px 17.9px rgba(0, 0, 0, 0.042),
            0 41.8px 33.4px rgba(0, 0, 0, 0.05),
            0 100px 80px rgba(0, 0, 0, 0.07);
        }

        .stack.active .card.box-shadow {
          box-shadow:
            0 -1px 25px rgba(59, 130, 246, 0.3),
            0 7.6px 6.1px rgba(0, 0, 0, 0.051),
            0 14.3px 11.5px rgba(0, 0, 0, 0.059),
            0 25.5px 20.5px rgba(0, 0, 0, 0.07),
            0 47.6px 38.4px rgba(0, 0, 0, 0.094),
            0 114px 92px rgba(0, 0, 0, 0.19);
        }

        .stack.active .card.padding { transition-delay: 0.1s; }
        .stack.active .card.border { transition-delay: 0.2s; }
        .stack.active .card.box-shadow { transition-delay: 0.4s; }

        .suara-logo {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 6px;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .suara-logo .ai {
          font-size: 0.6rem;
          color: #3B82F6;
          font-weight: 600;
        }

        .stack.active .suara-logo .ai {
          color: #60A5FA;
        }

        .langs {
          font-size: 0.5rem;
          opacity: 0.6;
          margin-top: 6px;
          line-height: 1.3;
        }
      `}</style>

      <div 
        className={`stack ${isActive ? 'active' : ''}`}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={() => setIsActive(!isActive)}
      >
        <div className="card-wrapper">
          <div className="card content">
            <div className="suara-logo">
              Suara<span className="ai">.ai</span>
            </div>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.55rem', lineHeight: 1.4 }}>
              Cutting-edge voice AI for Malaysians. Multilingual understanding across Malay, English, Mandarin & Tamil.
            </p>
            <div className="langs">
              Apa khabar • Nǐ hǎo • வணக்கம்
            </div>
          </div>
          <span className="label">Voice Inference</span>
        </div>
        <div className="card-wrapper">
          <div className="card padding"></div>
          <span className="label">Deep Processing</span>
        </div>
        <div className="card-wrapper">
          <div className="card border"></div>
          <span className="label">Dialect Recognition</span>
        </div>
        <div className="card-wrapper">
          <div className="card background"></div>
          <span className="label">Native Accent</span>
        </div>
        <div className="card-wrapper">
          <div className="card box-shadow"></div>
          <span className="label">Cross-Platform</span>
        </div>
      </div>
    </div>
  );
};

export default MySuaraCanvas;
