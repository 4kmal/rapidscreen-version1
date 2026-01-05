"use client"

import React, { useState, useEffect } from 'react';

interface MySuaraCanvasProps {
  className?: string;
}

const MySuaraCanvas: React.FC<MySuaraCanvasProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <style jsx>{`
        /* Base unit: 1vw ≈ 1% of viewport width - all sizes scale proportionally */
        .stack { 
          display: grid; 
          grid-template-areas: "stack"; 
          perspective: clamp(2000px, 100vw, 5000px); 
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
        .card-wrapper { grid-area: stack; position: relative; }
        
        /* Card size scales with viewport - clamp prevents too small/large */
        .card { 
          --easeInOutCirc: cubic-bezier(0.85, 0, 0.15, 1); 
          --card-size: clamp(60px, 16vw, 130px);
          transition: transform 4s ease; 
          width: var(--card-size); 
          height: var(--card-size); 
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
        
        /* Labels scale with viewport */
        .label { 
          position: absolute; 
          font-size: clamp(0.45rem, 1.2vw, 0.65rem); 
          font-weight: 600; 
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); 
          white-space: nowrap; 
          padding: clamp(0.15ch, 0.4vw, 0.35ch) clamp(0.4ch, 0.8vw, 0.75ch); 
          border-radius: 4ch; 
          opacity: 0; 
          transition: opacity 0.5s ease, transform 2s var(--easeInOutCirc); 
          background: rgba(59, 130, 246, 0.95); 
          font-family: system-ui, sans-serif; 
          color: white; 
          letter-spacing: 0.02em; 
          --easeInOutCirc: cubic-bezier(0.85, 0, 0.15, 1); 
          left: clamp(-58px, -13vw, -95px); 
          top: 50%; 
          transform: translateY(-50%) translateX(-10px); 
        }
        
        .stack.active .card { 
          transition-duration: 2s; 
          transition-timing-function: var(--easeInOutCirc); 
        }
        
        /* Transform values scale with viewport */
        .stack.active .card-wrapper:nth-child(1) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(clamp(55px, 16vw, 115px)) translateY(clamp(10px, 3vw, 22px)) translateX(clamp(10px, 3vw, 22px)); 
        }
        .stack.active .card-wrapper:nth-child(2) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(clamp(38px, 11vw, 80px)) translateY(clamp(12px, 3.3vw, 25px)) translateX(clamp(12px, 3.3vw, 25px)); 
        }
        .stack.active .card-wrapper:nth-child(3) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(clamp(20px, 6vw, 45px)) translateY(clamp(14px, 3.6vw, 28px)) translateX(clamp(14px, 3.6vw, 28px)); 
        }
        .stack.active .card-wrapper:nth-child(4) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(clamp(3px, 1vw, 8px)) translateY(clamp(16px, 4vw, 32px)) translateX(clamp(16px, 4vw, 32px)); 
        }
        .stack.active .card-wrapper:nth-child(5) .card { 
          transform: rotateX(45deg) rotate(45deg) translateZ(clamp(-14px, -3.5vw, -28px)) translateY(clamp(18px, 4.5vw, 36px)) translateX(clamp(18px, 4.5vw, 36px)); 
        }
        
        /* Label positions scale with viewport */
        .stack.active .card-wrapper:nth-child(1) .label { 
          top: clamp(-28px, -8vw, -58px); 
          left: clamp(-58px, -13vw, -95px); 
          transform: translateY(0) translateX(0); 
          opacity: 1; 
          transition-delay: 1.5s; 
        }
        .stack.active .card-wrapper:nth-child(2) .label { 
          top: clamp(-12px, -3.3vw, -25px); 
          left: clamp(-58px, -13vw, -95px); 
          transform: translateY(0) translateX(0); 
          opacity: 1; 
          transition-delay: 1.6s; 
        }
        .stack.active .card-wrapper:nth-child(3) .label { 
          top: clamp(4px, 1.1vw, 8px); 
          left: clamp(-58px, -13vw, -95px); 
          transform: translateY(0) translateX(0); 
          opacity: 1; 
          transition-delay: 1.7s; 
        }
        .stack.active .card-wrapper:nth-child(4) .label { 
          top: clamp(20px, 5.5vw, 40px); 
          left: clamp(-58px, -13vw, -95px); 
          transform: translateY(0) translateX(0); 
          opacity: 1; 
          transition-delay: 1.8s; 
        }
        .stack.active .card-wrapper:nth-child(5) .label { 
          top: clamp(36px, 10vw, 72px); 
          left: clamp(-58px, -13vw, -95px); 
          transform: translateY(0) translateX(0); 
          opacity: 1; 
          transition-delay: 1.9s; 
        }
        
        .card.content { 
          transition: border-color 4s ease, background-color 5s ease 2s, color 4s ease 0s, transform 4s ease 0s; 
          padding: clamp(5px, 1.4vw, 10px); 
          font-size: clamp(0.35rem, 0.9vw, 0.5rem); 
          line-height: 1.35; 
          background: rgb(255, 255, 255); 
          border: clamp(1.5px, 0.3vw, 2.5px) solid #3B82F6; 
          color: #1a1a2e; 
          font-family: system-ui, sans-serif; 
          overflow: hidden; 
        }
        .stack.active .card.content { 
          background: transparent; 
          color: white; 
          border-color: transparent; 
          transition: border-color 1s var(--easeInOutCirc) 0s, background-color 1s var(--easeInOutCirc) 0s, color 1s var(--easeInOutCirc) 0s, transform 2s var(--easeInOutCirc) 0s; 
        }
        
        .card.padding { background: transparent; transition-delay: 0.1s; }
        .card.padding::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          clip-path: polygon(0% 0%, 0% 100%, clamp(5px, 1.4vw, 10px) 100%, clamp(5px, 1.4vw, 10px) clamp(5px, 1.4vw, 10px), calc(100% - clamp(5px, 1.4vw, 10px)) clamp(5px, 1.4vw, 10px), calc(100% - clamp(5px, 1.4vw, 10px)) calc(100% - clamp(5px, 1.4vw, 10px)), clamp(5px, 1.4vw, 10px) calc(100% - clamp(5px, 1.4vw, 10px)), clamp(5px, 1.4vw, 10px) 100%, 100% 100%, 100% 0%); 
          background: repeating-linear-gradient(-45deg, #60A5FA, #60A5FA 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) clamp(3px, 0.6vw, 5px)); 
        }
        
        .card.border { background: transparent; transition-delay: 0.2s; }
        .card.border::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          clip-path: polygon(0% 0%, 0% 100%, clamp(1.5px, 0.3vw, 2.5px) 100%, clamp(1.5px, 0.3vw, 2.5px) clamp(1.5px, 0.3vw, 2.5px), calc(100% - clamp(1.5px, 0.3vw, 2.5px)) clamp(1.5px, 0.3vw, 2.5px), calc(100% - clamp(1.5px, 0.3vw, 2.5px)) calc(100% - clamp(1.5px, 0.3vw, 2.5px)), clamp(1.5px, 0.3vw, 2.5px) calc(100% - clamp(1.5px, 0.3vw, 2.5px)), clamp(1.5px, 0.3vw, 2.5px) 100%, 100% 100%, 100% 0%); 
          background: linear-gradient(135deg, #3B82F6, #60A5FA); 
        }
        
        .card.background { transition: background-color 4s ease 0.3s, transform 4s ease 0.3s; }
        .stack.active .card.background { 
          background: white; 
          transition: background-color 2s var(--easeInOutCirc) 0.3s, transform 2s var(--easeInOutCirc) 0.2s; 
        }
        
        .card.box-shadow { 
          background: transparent; 
          transition: box-shadow 4s ease 0.4s, transform 4s ease 0.4s; 
          box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07); 
        }
        .stack.active .card.box-shadow { 
          box-shadow: 0 -1px 25px rgba(59, 130, 246, 0.3), 0 7.6px 6.1px rgba(0, 0, 0, 0.051), 0 14.3px 11.5px rgba(0, 0, 0, 0.059), 0 25.5px 20.5px rgba(0, 0, 0, 0.07), 0 47.6px 38.4px rgba(0, 0, 0, 0.094), 0 114px 92px rgba(0, 0, 0, 0.19); 
        }
        
        .suara-logo { 
          font-weight: 700; 
          font-size: clamp(0.5rem, 1.3vw, 0.75rem); 
          margin-bottom: clamp(2px, 0.5vw, 4px); 
          display: flex; 
          align-items: baseline; 
          gap: 1px; 
        }
        .suara-logo .ai { 
          font-size: clamp(0.3rem, 0.7vw, 0.45rem); 
          color: #3B82F6; 
          font-weight: 600; 
        }
        .stack.active .suara-logo .ai { color: #60A5FA; }
        
        .langs { 
          font-size: clamp(0.25rem, 0.65vw, 0.38rem); 
          opacity: 0.6; 
          margin-top: clamp(2px, 0.5vw, 4px); 
          line-height: 1.25; 
        }
        
        .content-text {
          margin: 0; 
          opacity: 0.8; 
          font-size: clamp(0.25rem, 0.7vw, 0.4rem); 
          line-height: 1.35;
        }
      `}</style>
      <div className={`stack ${isActive ? 'active' : ''}`} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)} onClick={() => setIsActive(!isActive)}>
        <div className="card-wrapper">
          <div className="card content">
            <div className="suara-logo">Suara<span className="ai">.ai</span></div>
            <p className="content-text">Cutting-edge voice AI for Malaysians. Multilingual understanding across Malay, English, Mandarin & Tamil.</p>
            <div className="langs">Apa khabar • Nǐ hǎo • வணக்கம்</div>
          </div>
          <span className="label">Voice Inference</span>
        </div>
        <div className="card-wrapper"><div className="card padding"></div><span className="label">Deep Processing</span></div>
        <div className="card-wrapper"><div className="card border"></div><span className="label">Dialect Recognition</span></div>
        <div className="card-wrapper"><div className="card background"></div><span className="label">Native Accent</span></div>
        <div className="card-wrapper"><div className="card box-shadow"></div><span className="label">Cross-Platform</span></div>
      </div>
    </div>
  );
};

export default MySuaraCanvas;
