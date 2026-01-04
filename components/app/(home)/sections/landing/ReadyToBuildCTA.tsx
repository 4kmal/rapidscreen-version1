import React from "react";

export default function ReadyToBuildCTA() {
  return (
    <section className="relative w-full bg-accent-white overflow-hidden py-24 border-y border-border-faint">
      {/* Background Grid System */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Horizontal Lines (already handled by main section border-y, adding intermediates if needed) */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1200px]">
        {/* Content Wrapper with Grid Borders */}
        <div className="mx-auto max-w-4xl relative">
          
          {/* Vertical Grid Lines for the central content area */}
          <div className="absolute top-[-96px] bottom-[-96px] left-0 w-px bg-border-faint hidden md:block"></div>
          <div className="absolute top-[-96px] bottom-[-96px] right-0 w-px bg-border-faint hidden md:block"></div>
          
          {/* Decorative Corner Brackets on the main content box grid intersection */}
          {/* Top Left */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 hidden md:block z-20">
            <CornerBracket className="rotate-0" />
          </div>
          {/* Top Right */}
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hidden md:block z-20">
            <CornerBracket className="rotate-90" />
          </div>
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 hidden md:block z-20">
            <CornerBracket className="-rotate-90" />
          </div>
           {/* Bottom Right */}
           <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 hidden md:block z-20">
            <CornerBracket className="rotate-180" />
          </div>

          {/* Side Animated Patterns (Desktop Only) */}
          <div className="hidden md:block absolute top-0 bottom-0 -left-[180px] w-[180px] overflow-hidden opacity-30 pointer-events-none">
             <AnimatedDataStream direction="up" />
          </div>
          <div className="hidden md:block absolute top-0 bottom-0 -right-[180px] w-[180px] overflow-hidden opacity-30 pointer-events-none">
             <AnimatedDataStream direction="down" />
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col items-center text-center px-4 py-8 md:py-16">
            
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">🏗️</span>
              <span className="text-sm font-medium text-black-alpha-64">Start recruiting</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-[56px] leading-[1.1] font-bold text-accent-black mb-6 tracking-tight">
              Ready to recruit?
            </h2>

            {/* Description */}
            <p className="text-lg text-black-alpha-64 max-w-xl mb-10 leading-relaxed font-normal">
              Get qualified workers in under an hour. Start with 5 free placements – no credit card needed.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a 
                href="mailto:danial@tryrapidscreen.com" 
                className="bg-heat-100 text-white px-6 py-3 rounded-lg font-medium text-base hover:opacity-90 transition-opacity active:scale-[0.98] duration-150 inline-flex items-center justify-center min-w-[140px]"
              >
                Recruit now
              </a>
              <a 
                href="#pricing"
                className="bg-black-alpha-4 text-accent-black px-6 py-3 rounded-lg font-medium text-base hover:bg-black-alpha-8 transition-colors active:scale-[0.98] duration-150 inline-flex items-center justify-center min-w-[140px]"
              >
                See pricing
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// Decorative Corner Component
// Using SVG to replicate the "curvy-rect" corner markers seen in the design 
function CornerBracket({ className }: { className?: string }) {
  return (
    <svg 
      width="11" 
      height="11" 
      viewBox="0 0 11 11" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 1H4C7.86599 1 11 4.13401 11 8V11" 
        stroke="#E0E0E0" 
        strokeWidth="1"
        fill="none"
      />
      {/* Background filler to hide line intersections underneath if needed, though stroke usually suffices */}
      <path d="M0 0H5V5H0V0Z" fill="white" className="absolute -z-10" style={{ display: 'none' }} /> 
    </svg>
  );
}

// Animated Data Stream Component
// Simulates the "matrix" or "data rain" effect seen in the screenshots
function AnimatedDataStream({ direction = 'down' }: { direction?: 'up' | 'down' }) {
    // Generate a static grid of dots/characters to animate over
    // In a real implementation this might be more complex, but a repeating pattern works well for background noise
    
    // We use a CSS animation to move a mask or the content itself
    return (
      <div className="w-full h-full relative font-mono text-[10px] leading-[14px] text-accent-black select-none opacity-40">
        <div 
            className={`absolute inset-0 flex flex-col ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}
             style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '16px 24px',
                opacity: 0.2
             }}
        >
             {/* Fallback pattern if CSS gradient isn't enough - simple repeated dots */}
        </div>
        
        {/* Overlay gradient to fade out edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-white via-transparent to-accent-white z-10"></div>
      </div>
    );
  }
