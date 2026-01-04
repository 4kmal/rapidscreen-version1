import React from "react";

export default function HardStuffSection() {
  return (
    <section className="relative w-full bg-background-base border-b border-border-faint text-accent-black overflow-hidden font-sans">
      <div className="container mx-auto max-w-[900px] px-6 md:px-12 relative border-l border-r border-border-faint min-h-screen md:min-h-0 py-24 z-10">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Sidebar Label */}
            <div className="md:w-16 flex-shrink-0 pt-2 hidden md:block">
              <div className="flex items-center gap-3 text-[10px] font-mono text-black-alpha-40 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 md:[writing-mode:horizontal-tb] md:rotate-0 whitespace-nowrap">
                <span className="w-0.5 h-3 bg-heat-100 inline-block" />
                <span className="text-heat-100">03</span> / 04
                <span className="ml-2">BENEFITS</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Heading */}
              <h2 className="text-4xl md:text-[48px] font-bold text-accent-black leading-[1.1] md:leading-[1.2] tracking-tight mb-6">
                We handle the <span className="text-heat-100">hard stuff</span>
              </h2>

              {/* Subheading */}
              <p className="text-lg md:text-[18px] text-black-alpha-64 leading-[1.6] max-w-2xl">
                Automated phone calls, SMS engagement, worker verification, and instant candidate matching.
              </p>
            </div>
            
            {/* Right Spacer for balance */}
            <div className="md:w-16 hidden md:block" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-faint border border-border-faint rounded-xl overflow-hidden shadow-sm">
          {/* Card 1: Instant Calls */}
          <div className="bg-background-base p-8 md:p-12 group relative flex flex-col items-center md:items-start md:border-r border-border-faint">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-black-alpha-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs font-mono text-black-alpha-40 uppercase">Instant Outreach</span>
            </div>
            
            <h3 className="text-xl font-bold text-accent-black mb-3 text-center md:text-left">
              Automated Phone Calls. <span className="font-normal text-black-alpha-64 block mt-2 text-base md:inline md:mt-0">Our AI agents place phone calls and engage candidates via SMS/WhatsApp channels instantly.</span>
            </h3>

            {/* Visual Box */}
            <div className="mt-8 w-full h-[240px] bg-black-alpha-2 rounded-lg border border-border-faint/50 relative overflow-hidden flex items-center justify-center">
              {/* Background dots texture */}
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              
              {/* Phone Call Animation */}
              <div className="relative z-0 flex flex-col items-center">
                 <div className="w-20 h-20 bg-heat-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-mono text-accent-black bg-accent-white px-3 py-2 rounded border border-border-faint shadow-sm">
                        1000s of workers contacted instantly
                    </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fast Matching */}
          <div className="bg-background-base p-8 md:p-12 group relative flex flex-col items-center md:items-start">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-black-alpha-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-mono text-black-alpha-40 uppercase">Lightning Fast</span>
            </div>
            
            <h3 className="text-xl font-bold text-accent-black mb-3 text-center md:text-left">
              Qualified candidates in minutes. <span className="font-normal text-black-alpha-64 block mt-2 text-base md:inline md:mt-0">Our AI detects candidate intent and willingness to work, providing qualified matches rapidly.</span>
            </h3>

            {/* Visual Box */}
            <div className="mt-8 w-full h-[240px] bg-black-alpha-2 rounded-lg border border-border-faint/50 relative overflow-hidden flex items-center justify-center">
              {/* Background texture */}
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              
              {/* Timer Display */}
              <div className="flex flex-col items-center justify-center relative z-10">
                <div className="text-6xl font-bold text-heat-100 mb-2">&lt;1hr</div>
                <div className="text-sm text-black-alpha-64">To qualified candidates</div>
                <div className="mt-4 flex gap-2">
                  <div className="px-3 py-1 bg-accent-white rounded border border-border-faint text-xs">Screened</div>
                  <div className="px-3 py-1 bg-accent-white rounded border border-border-faint text-xs">Verified</div>
                  <div className="px-3 py-1 bg-accent-white rounded border border-border-faint text-xs">Ready</div>
                </div>
              </div>
            </div>
          </div>
          
           {/* Card 3: Worker Database */}
           <div className="bg-background-base p-8 md:p-12 group relative flex flex-col items-center md:items-start md:border-r md:border-t border-border-faint">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-black-alpha-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-mono text-black-alpha-40 uppercase">Extensive Database</span>
            </div>
            
            <h3 className="text-xl font-bold text-accent-black mb-3 text-center md:text-left">
              60,000+ Workers. <span className="font-normal text-black-alpha-64 block mt-2 text-base md:inline md:mt-0">We constantly enrich our database to always find you someone who matches requirements.</span>
            </h3>

            {/* Visual Box */}
            <div className="mt-8 w-full h-[240px] bg-black-alpha-2 rounded-lg border border-border-faint/50 relative overflow-hidden flex items-center justify-center">
               {/* Background Orbit Rings */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[180px] h-[180px] border border-dashed border-border-faint rounded-full absolute opacity-50"></div>
                  <div className="w-[280px] h-[280px] border border-dashed border-border-faint/50 rounded-full absolute opacity-30"></div>
               </div>

               {/* Worker Types */}
               <div className="relative z-10 grid grid-cols-2 gap-3 px-4">
                  <div className="bg-accent-white rounded-lg border border-border-faint p-3 text-center">
                    <div className="text-lg font-bold text-heat-100">19K</div>
                    <div className="text-[10px] text-black-alpha-64">Labourers</div>
                  </div>
                  <div className="bg-accent-white rounded-lg border border-border-faint p-3 text-center">
                    <div className="text-lg font-bold text-heat-100">11K</div>
                    <div className="text-[10px] text-black-alpha-64">Steel Fixers</div>
                  </div>
                  <div className="bg-accent-white rounded-lg border border-border-faint p-3 text-center">
                    <div className="text-lg font-bold text-heat-100">12K</div>
                    <div className="text-[10px] text-black-alpha-64">Carpenters</div>
                  </div>
                  <div className="bg-accent-white rounded-lg border border-border-faint p-3 text-center">
                    <div className="text-lg font-bold text-heat-100">7K</div>
                    <div className="text-[10px] text-black-alpha-64">Electricians</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Card 4: Better Pay = Better Retention */}
          <div className="bg-background-base p-8 md:p-12 group relative flex flex-col items-center md:items-start md:border-t border-border-faint">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-black-alpha-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-mono text-black-alpha-40 uppercase">Better Economics</span>
            </div>
            
            <h3 className="text-xl font-bold text-accent-black mb-3 text-center md:text-left">
              90% Retention Rate. <span className="font-normal text-black-alpha-64 block mt-2 text-base md:inline md:mt-0">Our low margins mean higher worker pay, resulting in better retention for your projects.</span>
            </h3>

            {/* Visual Box */}
            <div className="mt-8 w-full h-[240px] bg-black-alpha-2 rounded-lg border border-border-faint/50 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="text-center">
                  <div className="text-6xl font-bold text-heat-100 mb-2">90%</div>
                  <div className="text-sm text-black-alpha-64 mb-4">Worker Retention Rate</div>
                  <div className="text-xs text-black-alpha-48 max-w-[200px]">
                    Higher pay than any agency = happier workers who stay longer
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
