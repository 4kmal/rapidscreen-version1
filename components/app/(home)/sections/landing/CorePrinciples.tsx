import React from 'react';

export default function CorePrinciplesSection() {
  return (
    <section className="relative w-full bg-background-base border-b border-border-faint text-accent-black overflow-hidden font-sans">
      <div className="container mx-auto max-w-[900px] px-6 md:px-12 relative border-l border-r border-border-faint min-h-screen md:min-h-0">
        
        {/* Section Marker */}
        <div className="absolute top-0 -left-[1px] md:left-0 z-20 flex items-center gap-2 pl-4 md:pl-0 -translate-y-1/2 md:-translate-y-full md:pt-4">
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono tracking-wider text-black-alpha-40 select-none">
            <span className="w-0.5 h-3 md:h-4 bg-heat-100 inline-block" />
            02 / 07
            <span className="text-black-alpha-24">|</span>
            OUR DIFFERENCES
          </div>
        </div>

        {/* Decorative Grid Lines */ }
        <div className="absolute top-0 left-0 w-full h-px bg-border-faint z-10" />
        
        {/* Curvy Rects Decorations for Grid Intersections */}
        {/* Top Left */}
        <div className="absolute -top-[1px] -left-[1px] w-3 h-3 z-20 pointer-events-none text-heat-100">
           <svg width="100%" height="100%" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 rotate-180">
              <path d="M11 1.5V11H1V6C1 3.23858 3.23858 1 6 1H11V1.5Z" fill="#F9F9F9" stroke="#EDEDED" strokeWidth="1"/>
           </svg>
        </div>
        {/* Top Right */}
        <div className="absolute -top-[1px] -right-[1px] w-3 h-3 z-20 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 -rotate-90">
              <path d="M10 10H0V11H11V0H10V5C10 7.76142 7.76142 10 5 10H0V10Z" fill="#F9F9F9" stroke="#EDEDED" strokeWidth="1"/>
           </svg>
        </div>

        {/* Header Content */}
        <div className="flex flex-col items-center justify-center pt-24 pb-20 md:pt-32 md:pb-24 text-center border-b border-border-faint relative z-10">
          {/* Heading */}
          <h2 className="mb-6 max-w-[800px] text-4xl md:text-6xl font-bold tracking-tight text-accent-black leading-[1.1]">
            We take the inefficiencies <br className="hidden md:block" />
            out of <span className="text-heat-100">agency workflows</span>
          </h2>
          
          {/* Subheading */}
          <p className="max-w-[500px] text-lg text-black-alpha-64 font-normal leading-relaxed">
            World-class recruitment tech expertise with passion & care for every placement.
          </p>
          
          {/* Grid Background Pattern for Header */}
           <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.4]" 
                style={{ 
                  backgroundImage: 'radial-gradient(#E0E0E0 1px, transparent 1px)', 
                  backgroundSize: '24px 24px' 
                }}>
           </div>
        </div>

        {/* Two Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:divide-x divide-border-faint w-full relative">
          
          {/* Left Column - Other Agencies */}
          <div className="group relative flex flex-col p-8 md:p-12 border-b md:border-b-0 border-border-faint bg-black-alpha-2 hover:bg-black-alpha-4 transition-colors duration-300">
            {/* Label */}
            <div className="flex items-center gap-2.5 mb-8 text-black-alpha-56">
              <XIcon className="size-4 text-red-500" />
              <span className="text-xs font-medium uppercase tracking-wide">Other Agencies</span>
            </div>
            
            {/* Text Content */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-accent-black">Traditional Problems</h3>
              <p className="text-black-alpha-64 leading-relaxed text-[15px]">
                Typical recruitment agencies struggle with outdated methods and high costs.
              </p>
            </div>

            {/* Problem List */}
            <div className="mt-auto space-y-4 w-full">
              {[
                "Overpromise workers",
                "Take weeks to source",
                "Manual verifications",
                "High margin = Low worker pay",
                "Expensive",
                "Outdated Methods",
                "Just Another Client"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                    <XIcon className="size-3 text-red-500" />
                  </div>
                  <span className="text-sm text-black-alpha-64">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Rapidscreen */}
          <div className="group relative flex flex-col p-8 md:p-12 bg-accent-white/50 hover:bg-accent-white transition-colors duration-300">
             {/* Label */}
             <div className="flex items-center gap-2.5 mb-8 text-black-alpha-56">
              <CheckIcon className="size-4 text-heat-100" />
              <span className="text-xs font-medium uppercase tracking-wide">Rapidscreen</span>
            </div>

            {/* Text Content */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-accent-black">Our Solution</h3>
              <p className="text-black-alpha-64 leading-relaxed text-[15px]">
                AI-powered recruitment that delivers qualified workers rapidly at lower cost.
              </p>
            </div>

            {/* Solution List */}
            <div className="mt-auto space-y-4 w-full">
              {[
                "5 Free placements",
                "1000s of workers called instantly",
                "Worker visualisation",
                "High worker pay = Retention",
                "Cheaper than your best agency quote",
                "World-class Recruitment Tech Expertise",
                "Passion & Care"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-heat-40/20">
                    <CheckIcon className="size-3 text-heat-100" />
                  </div>
                  <span className="text-sm font-medium text-accent-black">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Decorative Grid Line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-border-faint z-10" />

        {/* Bottom Corner Decors */}
         {/* Bottom Left */}
         <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 z-20 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 -rotate-90 scale-y-[-1]">
              <path d="M10 10H0V11H11V0H10V5C10 7.76142 7.76142 10 5 10H0V10Z" fill="#F9F9F9" stroke="#EDEDED" strokeWidth="1"/>
           </svg>
        </div>
        {/* Bottom Right */}
        <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 z-20 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 -rotate-180 scale-x-[-1]">
              <path d="M10 10H0V11H11V0H10V5C10 7.76142 7.76142 10 5 10H0V10Z" fill="#F9F9F9" stroke="#EDEDED" strokeWidth="1"/>
           </svg>
        </div>

      </div>
    </section>
  );
}

// Simple Icon Components
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
