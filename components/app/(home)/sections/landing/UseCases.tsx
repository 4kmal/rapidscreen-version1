import React from 'react';
import Image from 'next/image';
import { ScrambleHover } from '@/components/ui/scramble';

const USE_CASES_DATA = [
  {
    category: "Instant Outreach",
    title: "1000s of calls, instantly",
    description: "Our AI agents contact qualified workers within minutes, not days. No more waiting on manual recruiter calls.",
    img: "/how/Copilot.svg",
    alt: "Instant Outreach icon"
  },
  {
    category: "Worker Location",
    title: "Pick workers near your site",
    description: "Visualize available workers on a map and choose who you want based on location, reducing travel costs and no-shows.",
    img: "/how/Mobile.svg",
    alt: "Worker Location icon"
  },
  {
    category: "Quality Assurance",
    title: "Verified & certified",
    description: "Every worker is screened for qualifications, right to work, and references before being matched to your site.",
    img: "/how/Dev.svg",
    alt: "Quality Assurance icon"
  },
  {
    category: "Worker Retention",
    title: "90% retention rate",
    description: "Higher worker pay through our low margins means happier workers who show up and stay on your projects.",
    img: "/how/Laptop.svg",
    alt: "Worker Retention icon"
  },
  {
    category: "Multi-site Management",
    title: "Coordinate across sites",
    description: "Manage worker placements across multiple construction sites from a single dashboard.",
    img: "/how/Infra.svg",
    alt: "Multi-site Management icon"
  }
];

export default function UseCasesSection() {
  return (
    <section className="relative bg-background-base text-accent-black overflow-hidden border-t border-border-faint" id="use-cases">
      {/* Background Grid Lines - matching Testimonials style */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="container mx-auto max-w-[900px] h-full relative border-x border-border-faint">
          <div className="absolute top-0 bottom-0 left-[33.33%] w-px bg-border-faint hidden lg:block"></div>
          <div className="absolute top-0 bottom-0 left-[66.66%] w-px bg-border-faint hidden lg:block"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-[900px] border-x border-border-faint bg-background-base relative z-10">
        {/* Section Marker */}
        <div className="absolute left-6 md:left-12 top-0 md:top-32 hidden xl:block">
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider transform -translate-x-[calc(100%+24px)]">
            <span className="w-0.5 h-3 bg-heat-100 inline-block" />
            <span className="text-heat-100 font-bold">03</span>
            <span className="text-black-alpha-40">/ 04</span>
            <span className="text-black-alpha-40 ml-2 uppercase">USE CASES</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] uppercase">
              <span className="text-heat-100"><ScrambleHover text="try" /></span><ScrambleHover text="Rapidscreen" />
            </h2>
            <p className="text-lg text-black-alpha-64 max-w-xl leading-relaxed mx-auto">
              The best and fastest agentic hiring process in the world
            </p>
          </div>
        </div>

        {/* Sticky Layout Container */}
        <div className="relative flex flex-col md:flex-row overflow-visible px-6 lg:px-12 pb-24">
          
          {/* Left Column: Sticky Illustration */}
          <div className="relative hidden md:block w-[60%] overflow-visible pt-[16vh] md:ml-[3%]">
            <div className="sticky top-1/2 flex -translate-y-1/2 transform items-center justify-center pl-2">
              <div className="relative flex items-center">
                <Image 
                  src="/how/AGuyAndConnector.svg"
                  alt="Government agencies connectivity illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto max-w-[500px]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Cards */}
          <div className="z-10 w-full md:w-[40%]">
            <div className="space-y-6">
              {USE_CASES_DATA.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center"
                >
                  <div className="relative flex w-full flex-col items-center justify-center rounded-xl border border-[#27272a]/50 bg-[#18181b]/50 p-8 shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-[#3f3f46]/70 hover:bg-[#27272a]/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] group hover:scale-[1.02]">
                    <div className="mb-6 flex items-center justify-center">
                      <Image 
                        src={item.img} 
                        alt={item.alt} 
                        width={100} 
                        height={100} 
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="mb-4 bg-white/10 px-4 py-2 text-center text-xs font-mono font-medium text-white/40 uppercase tracking-widest rounded-full">
                      {item.category}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 text-center">
                      {item.title}
                    </h3>
                    
                    <p className="text-center text-base leading-relaxed text-white/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
