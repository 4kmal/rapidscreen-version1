"use client";

import React, { useRef, useState, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Lottie from 'lottie-react';
import globeAnimation from '@/public/globe.json';
import { ConnectorLines } from './flow/ConnectorLines';
import MySuaraCanvas from './flow/MySuaraCanvas';
import KrackedDevCanvas from './flow/KrackedDevCanvas';
import DitheredVideo from './flow/DitheredVideo';
import Earth from '@/components/ui/globe';
import { ScrambleHover } from '@/components/ui/scramble';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/components/shared/sound-context/SoundContext';

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
  const { playClick, playPop } = useSound();
  
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
      className="relative w-full bg-background-base text-accent-black overflow-hidden border-t-2 border-border-muted" 
      id="main-features"
    >
      {/* Full-height border lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="container mx-auto h-full max-w-[900px] border-x-2 border-border-muted border-dashed md:border-solid" />
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
              backgroundImage: 'radial-gradient(#D5D2CF 1px, transparent 1px)', 
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
        <div className="grid grid-cols-3 bg-background-base border-2 border-border-faint rounded-[10px] divide-x-2 divide-border-faint shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative z-20 mb-50 md:mb-86 overflow-visible">
           
           {/* Card 1: My Suara */}
           <div 
             ref={setRef('card-1')} 
             className={`group relative flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 pb-6 sm:pb-10 lg:pb-16 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 0 
                 ? 'bg-blue-500/5 ring-2 ring-blue-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => {
               playPop();
               setActiveCardIndex(0);
             }}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8 h-12 sm:h-20 lg:h-28 flex items-center justify-center">
                 <div className="w-10 h-12 sm:w-16 sm:h-20 lg:w-24 lg:h-28 relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                   {/* Hex Icon Sun */}
                   <svg 
                     viewBox="0 0 42 50" 
                     className="w-full h-full block"
                     style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
                   >
                     <path 
                       d="M19,1 Q21,0,23,1 L39,10 Q41.5,11,42,14 L42,36 Q41.5,39,39,40 L23,49 Q21,50,19,49 L3,40 Q0.5,39,0,36 L0,14 Q0.5,11,3,10 L19,1" 
                       fill="#3B82F6"
                       className="transition-colors duration-300 group-hover:fill-blue-400"
                     />
                     <circle cx="21" cy="25" r="8" stroke="#fff" strokeWidth="2" fill="none" />
                     <circle cx="21" cy="25" r="12" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="2,7.4">
                       <animateTransform 
                         attributeName="transform" 
                         attributeType="XML" 
                         type="rotate" 
                         from="0 21 25" 
                         to="360 21 25" 
                         dur="3.5s" 
                         repeatCount="indefinite" 
                       />
                     </circle>
                   </svg>
                 </div>
              </div>
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 uppercase tracking-wider ${
                activeCardIndex === 0 ? 'text-blue-500' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>My Suara</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5] min-h-[48px] sm:min-h-[60px] lg:min-h-[72px] flex items-start justify-center">
                 Malaysia's SOTA TTS model that understands native accents and dialects
              </p>
              {/* Go to website button */}
              <Link 
                href="http://mysuara.ai/" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 hover:bg-blue-600 text-white text-[8px] sm:text-[10px] lg:text-xs font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap z-30"
              >
                Visit Site
              </Link>
           </div>

           {/* Card 2: Kracked Dev */}
           <div 
             ref={setRef('card-2')} 
             className={`group relative flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 pb-6 sm:pb-10 lg:pb-16 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 1 
                 ? 'bg-green-500/5 ring-2 ring-green-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => {
               playPop();
               setActiveCardIndex(1);
             }}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8 h-12 sm:h-20 lg:h-28 flex items-center justify-center">
                 <div className="relative w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 flex items-center justify-center">
                   <div className="relative w-full h-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border border-border-faint shadow-sm group-hover:shadow-md group-hover:border-green-500/30 transition-all duration-500">
                     <Image 
                       src="/kd.jpg"
                       alt="Kracked Dev"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                     />
                   </div>
                 </div>
              </div>
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 uppercase tracking-wider ${
                activeCardIndex === 1 ? 'text-green-500' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>Kracked Dev</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5] min-h-[48px] sm:min-h-[60px] lg:min-h-[72px] flex items-start justify-center">
                 The number 1 online developer community in Malaysia for both freelancers and recruiters
              </p>
              {/* Go to website button */}
              <Link 
                href="http://krackeddevs.com/" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 hover:bg-green-600 text-white text-[8px] sm:text-[10px] lg:text-xs font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap z-30"
              >
                Visit Site
              </Link>
           </div>

           {/* Card 3: I.G.M.E */}
           <div 
             ref={setRef('card-3')} 
             className={`group relative flex flex-col items-center text-center p-3 sm:p-6 lg:p-12 pb-6 sm:pb-10 lg:pb-16 transition-all duration-500 cursor-pointer ${
               activeCardIndex === 2 
                 ? 'bg-orange-500/5 ring-2 ring-orange-500/30 ring-inset' 
                 : 'hover:bg-black-alpha-2'
             }`}
             onClick={() => {
               playPop();
               setActiveCardIndex(2);
             }}
           >
              <div className="mb-3 sm:mb-6 lg:mb-8 h-12 sm:h-20 lg:h-28 flex items-center justify-center">
                 <div className="relative w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 flex items-center justify-center rounded-full overflow-hidden">
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
              <h3 className={`text-[11px] sm:text-[16px] lg:text-[20px] font-bold mb-1 sm:mb-3 transition-colors duration-300 uppercase tracking-wider ${
                activeCardIndex === 2 ? 'text-heat-100' : 'text-accent-black'
              }`} style={{ fontFamily: "'Departure Mono', monospace" }}>I.G.M.E</h3>
              <p className="text-[9px] sm:text-[13px] lg:text-[16px] text-black-alpha-64 leading-[1.4] sm:leading-[1.5] min-h-[48px] sm:min-h-[60px] lg:min-h-[72px] flex items-start justify-center">
              Innovative Government, Military & Enterprise Solutions
              </p>
              {/* Go to website button */}
              <Link 
                href="https://mypeta.ai/" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 sm:px-3 py-0.5 sm:py-1 bg-heat-100 hover:bg-orange-600 text-white text-[8px] sm:text-[10px] lg:text-xs font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap z-30"
              >
                Visit Site
              </Link>
           </div>

        </div>

        {/* Bottom Canvas - Dynamic Content Based on Active Card */}
        <div 
          ref={setRef('bottom-node')} 
          className={`relative z-20 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-background-base border rounded-lg sm:rounded-[10px] p-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)] h-[220px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden transition-all duration-500 ${
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
