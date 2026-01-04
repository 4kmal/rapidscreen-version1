"use client";

import React, { useRef, useState, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Lottie from 'lottie-react';
import globeAnimation from '@/public/globe.json';
import { ConnectorLines } from './flow/ConnectorLines';
import ForceGraph from './flow/ForceGraph';
import MySuaraCanvas from './flow/MySuaraCanvas';
import KrackedDevCanvas from './flow/KrackedDevCanvas';
import DitheredVideo from './flow/DitheredVideo';
import Earth from '@/components/ui/globe';
import { ScrambleHover } from '@/components/ui/scramble';
import { AnimatePresence, motion } from 'framer-motion';

// Dynamically import AvatarSelector to avoid SSR issues
const AvatarSelector = dynamic(
  () => import('@/components/shared/effects/avatar-selector/AvatarSelector'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-heat-100 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

// Card names for the cycle
const CARD_NAMES = ['My Suara', 'Kracked Dev', 'My Peta'];
const CYCLE_INTERVAL = 15000; // 15 seconds per card
const INTERACTION_PAUSE_DURATION = 6000; // 6 seconds pause after GameBoy interaction

export default function MainFeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Active card state (0 = My Suara, 1 = Kracked Dev, 2 = My Peta)
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Pause cycling state - timestamp of last interaction
  const lastInteractionRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Registry to store DOM elements for line drawing
  const elementRegistry = useRef<Map<string, HTMLElement>>(new Map()).current;
  const refCallbacks = useRef<Map<string, (el: HTMLElement | null) => void>>(new Map()).current;
  
  // State to force re-render of lines when refs are ready
  const [, setTick] = useState(0);

  // Handle GameBoy interaction - pause cycling for 6 seconds
  const handleGameBoyInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setIsPaused(true);
    
    // Resume after INTERACTION_PAUSE_DURATION
    setTimeout(() => {
      // Only resume if no new interactions happened
      if (Date.now() - lastInteractionRef.current >= INTERACTION_PAUSE_DURATION - 100) {
        setIsPaused(false);
      }
    }, INTERACTION_PAUSE_DURATION);
  }, []);

  // Cycle through cards (only when not paused)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % 3);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Helper to register ref safely without causing infinite loops
  const setRef = (id: string) => {
    if (!refCallbacks.has(id)) {
      refCallbacks.set(id, (el: HTMLElement | null) => {
        if (el) {
          if (!elementRegistry.has(id)) {
            elementRegistry.set(id, el);
            // Trigger a re-render only if it's a new element to ensure lines draw
            setTick(t => t + 1);
          }
        } else {
          elementRegistry.delete(id);
        }
      });
    }
    return refCallbacks.get(id)!;
  };

  // Updated connections with cardIndex for highlighting
  const connections = [
    { start: 'top-node', end: 'card-1', color: '#FFFFFF', cardIndex: 0 },      // My Suara - White
    { start: 'top-node', end: 'card-2', color: '#FFFFFF', cardIndex: 1 },      // Kracked Dev - White
    { start: 'top-node', end: 'card-3', color: '#FFFFFF', cardIndex: 2 },      // My Peta - White
    { start: 'card-1', end: 'bottom-node', color: '#FFFFFF', cardIndex: 0 },   // My Suara - White
    { start: 'card-2', end: 'bottom-node', color: '#FFFFFF', cardIndex: 1 },   // Kracked Dev - White
    { start: 'card-3', end: 'bottom-node', color: '#FFFFFF', cardIndex: 2 },   // My Peta - White
  ];

  // Render canvas content based on active card
  const renderCanvasContent = () => {
    return (
      <AnimatePresence mode="wait">
        {activeCardIndex === 0 && (
          <motion.div
            key="mysuara"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <MySuaraCanvas />
          </motion.div>
        )}
        {activeCardIndex === 1 && (
          <motion.div
            key="krackeddev"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <KrackedDevCanvas onInteraction={handleGameBoyInteraction} />
          </motion.div>
        )}
        {activeCardIndex === 2 && (
          <motion.div
            key="mypeta"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <DitheredVideo />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background-base text-accent-black overflow-hidden" 
      id="main-features"
    >
      {/* Full-height border lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="container mx-auto h-full max-w-[900px] border-x border-border-faint border-dashed md:border-solid" />
      </div>

      {/* SVG Layer for Lines */}
      <ConnectorLines 
        containerRef={containerRef}
        connections={connections}
        elementRegistry={elementRegistry}
        activeCardIndex={activeCardIndex}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-[900px] py-24 md:py-32">
        
        {/* Background Dot Pattern - contained within container width */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.6] overflow-hidden" aria-hidden="true">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              backgroundImage: 'radial-gradient(#E0E0E0 1px, transparent 1px)', 
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
          />
        </div>
        {/* Section Marker */}
        <div className="absolute left-6 md:left-12 top-0 md:top-24 hidden xl:block">
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider transform -translate-x-[calc(100%+24px)]">
            <span className="w-0.5 h-3 bg-heat-100 inline-block" />
            <span className="text-heat-100 font-bold">01</span>
            <span className="text-black-alpha-40">/ 02</span>
            <span className="text-black-alpha-40 ml-2 uppercase">OUR PORTFOLIO</span>
          </div>
        </div>

        {/* Content Header (Moved Top) */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-4xl md:text-[48px] font-bold leading-[1.15] text-accent-black mb-5 tracking-tight">
            Rapid<span className="text-heat-100"> <ScrambleHover text="Advanced" /></span> Technologies
          </h2>
          
          <p className="text-[16px] md:text-[18px] text-black-alpha-64 leading-[1.6] font-normal max-w-lg">
            We have 3 software solutions that we provide
          </p>
        </div>

        {/* Avatar Selector with Animations */}
        <div ref={setRef('top-node')} className="relative w-full flex justify-center mb-50 md:mb-96 z-20">
          <AvatarSelector size="180px" />
        </div>

        {/* Features Card Grid - Always 3 columns */}
        <div className="grid grid-cols-3 bg-background-base border border-border-faint rounded-[10px] divide-x divide-border-faint shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative z-20 mb-50 md:mb-86">
           
           {/* Card 1: My Suara */}
           <div 
             ref={setRef('card-1')} 
             className={`group flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 0 
                 ? 'bg-blue-500/5 ring-2 ring-blue-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => setActiveCardIndex(0)}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8">
                 <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 relative flex items-center justify-center rounded-xl sm:rounded-2xl bg-black-alpha-2 border border-border-faint overflow-hidden group-hover:border-heat-100/30 transition-colors duration-500">
                   {/* Animated Orb Background */}
                   <div className="absolute inset-0 scale-150 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                     <video
                       src="https://www.apple.com/105/media/us/siri/2018/ee7c4c16_aae5_4678_9cdd_7ca813baf929/films/siri_orb_large.mp4"
                       muted
                       loop
                       autoPlay
                       playsInline
                       className="w-full h-full object-cover mix-blend-screen"
                     />
                   </div>
                   <div className="flex items-center gap-1 h-8 sm:h-12 relative z-10">
                     {[0.4, 0.7, 1.0, 0.8, 0.5].map((opacity, i) => (
                       <div
                         key={i}
                         className="w-1 sm:w-2 bg-heat-100 rounded-full animate-pulse"
                         style={{
                           height: `${40 + Math.sin(i * 1.5) * 40}%`,
                           animationDelay: `${i * 0.1}s`,
                           opacity
                         }}
                       />
                     ))}
                   </div>
                 </div>
              </div>
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 ${
                activeCardIndex === 0 ? 'text-blue-500' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>My Suara</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5]">
                 Malaysia's SOTA TTS model that understands native accents and dialects
              </p>
           </div>

           {/* Card 2: Kracked Dev */}
           <div 
             ref={setRef('card-2')} 
             className={`group flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 1 
                 ? 'bg-green-500/5 ring-2 ring-green-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => setActiveCardIndex(1)}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8">
                 <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 flex items-center justify-center">
                   <div className="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl overflow-hidden border border-border-faint shadow-sm group-hover:shadow-md group-hover:border-heat-100/30 transition-all duration-500">
                     <Image 
                       src="/kd.jpg"
                       alt="Kracked Dev"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                     />
                   </div>
                 </div>
              </div>
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 ${
                activeCardIndex === 1 ? 'text-green-500' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>Kracked Dev</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5]">
                 The number 1 online developer community in Malaysia for both freelancers and recruiters
              </p>
           </div>

           {/* Card 3: I.G.M.E */}
           <div 
             ref={setRef('card-3')} 
             className={`group flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 2 
                 ? 'bg-orange-500/5 ring-2 ring-orange-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => setActiveCardIndex(2)}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8">
                 <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden">
                   <Suspense
                     fallback={
                       <div className="w-full h-full bg-black-alpha-2 animate-pulse rounded-full flex items-center justify-center">
                         <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-2 border-heat-100 border-t-transparent rounded-full animate-spin" />
                       </div>
                     }
                   >
                     <Earth 
                       className="w-full h-full"
                       baseColor={[0.906, 0.541, 0.325]} 
                       glowColor={[0.906, 0.541, 0.325]}
                       markerColor={[0, 0, 0]}
                       dark={0}
                       scale={1.2}
                     />
                   </Suspense>
                 </div>
              </div>
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 ${
                activeCardIndex === 2 ? 'text-heat-100' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>I.G.M.E</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5]">
              Innovative Government, Military & Enterprise Solutions
              </p>
           </div>

        </div>

        {/* Bottom Canvas - Dynamic Content Based on Active Card */}
        <div 
          ref={setRef('bottom-node')} 
          className={`relative z-20 w-full max-w-[200px] sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto bg-background-base border rounded-lg sm:rounded-[10px] p-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)] h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden transition-all duration-500 ${
            activeCardIndex === 0 
              ? 'border-blue-500/30' 
              : activeCardIndex === 1 
              ? 'border-green-500/30'
              : 'border-orange-500/30'
          }`}
        >
          {renderCanvasContent()}
        </div>

      </div>
    </section>
  );
}
