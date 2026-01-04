import React from 'react';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { ScrambleHover } from '@/components/ui/scramble';

/* Utility for class merging (simple version if not available globally) */
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

type Testimonial = {
  name: string;
  role: string;
  company: string;
  avatarSrc: string;
  text: string;
  highlightWords: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Andrej Karpathy",
    role: "CEO",
    company: "Eureka Labs",
    avatarSrc: "/andrej-karpathy-avatar.webp",
    text: "The best LLM applications have an autonomy slider: you control how much independence to give the AI. In Rapidscreen, you can do targeted hiring, or you can let it rip with the full autonomy agentic version.",
    highlightWords: ["autonomy slider", "full autonomy"]
  },
  {
    name: "shadcn",
    role: "CTO",
    company: "shadcn/ui",
    avatarSrc: "/shadcn-avatar.webp",
    text: "The most useful AI tool that I currently pay for, hands down, is Rapidscreen. It's fast, autocompletes when and where you need it to, handles complexity properly... everything is well put together.",
    highlightWords: ["most useful AI tool", "well put together"]
  },
  {
    name: "Greg Brockman",
    role: "President",
    company: "OpenAI",
    avatarSrc: "/greg-brockman-avatar.webp",
    text: "It's definitely becoming more fun to be a recruiter. It's less about digging through pages and more about what you want to happen. We are at the 1% of what's possible, and it's in interactive experiences like Rapidscreen where models shine brightest.",
    highlightWords: ["1% of what's possible", "models shine brightest"]
  },
  {
    name: "Patrick Collison",
    role: "Software Engineer",
    company: "Stripe",
    avatarSrc: "/patrick-collison-avatar.webp",
    text: "Rapidscreen quickly grew from hundreds to thousands of extremely enthusiastic Stripe employees. We spend more on R&D than any other undertaking, and there's significant economic outcomes when making that process more efficient.",
    highlightWords: ["economic outcomes", "more efficient"]
  },
  {
    name: "Diana Hu",
    role: "CFO",
    company: "Y Combinator",
    avatarSrc: "/diana-hu-avatar.webp",
    text: "It was night and day from one batch to another, adoption went from single digits to over 80%. It just spread like wildfire, all the best builders were using Rapidscreen.",
    highlightWords: ["spread like wildfire", "all the best builders"]
  }
];

const HighlightedText = ({ text, highlights }: { text: string; highlights: string[] }) => {
  if (!highlights.length) return <span className="text-white">{text}</span>;

  // Create a regex pattern to match highlighting words
  const pattern = new RegExp(`(${highlights.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <span className="text-white">
      {parts.map((part, i) => {
        const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
        return isHighlight ? (
          <span key={i} className="text-heat-100 font-medium">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

const TestimonialHeader = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex items-center gap-6">
    <div className="size-32 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-2xl">
      <Image 
        src={testimonial.avatarSrc} 
        alt={testimonial.name} 
        width={128} 
        height={128} 
        className="object-cover w-full h-full"
      />
    </div>
    <div className="flex flex-col justify-center min-w-0">
      <span className="text-xl font-bold truncate block text-white leading-tight">
        {testimonial.name}
      </span>
      <span className="text-[11px] uppercase tracking-[0.15em] truncate block text-white/40 font-mono mt-1.5">
        {testimonial.role}
      </span>
    </div>
  </div>
);

const BENTO_CARD_CLASS = "rounded-xl border border-[#27272a]/50 bg-[#18181b]/50 p-8 shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-[#3f3f46]/70 hover:bg-[#27272a]/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] group hover:scale-[1.02]";

export default function TestimonialsSection() {
  return (
    <section className="relative w-full bg-background-base overflow-hidden border-t border-b border-border-faint" id="testimonials">
      {/* Background Grid Lines - Absolute positioning to match design system */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Container aligned vertical lines */}
        <div className="container mx-auto max-w-[900px] h-full px-6 md:px-12 relative border-x border-border-faint">
             {/* Decorative Grid Lines aligned to columns */}
            <div className="absolute top-0 bottom-0 left-[33.33%] w-px bg-border-faint hidden lg:block"></div>
            <div className="absolute top-0 bottom-0 left-[66.66%] w-px bg-border-faint hidden lg:block"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-[900px] px-6 md:px-12 py-24 md:py-32 relative z-10 border-x border-border-faint bg-background-base">
        {/* Section Marker */}
        <div className="absolute left-6 md:left-12 top-0 md:top-24 hidden xl:block">
           <div className="flex items-center gap-2 font-mono text-xs tracking-wider transform -translate-x-[calc(100%+24px)]">
            <span className="w-0.5 h-3 bg-heat-100 inline-block" />
            <span className="text-heat-100 font-bold">02</span>
            <span className="text-black-alpha-40">/ 04</span>
            <span className="text-black-alpha-40 ml-2">TESTIMONIALS</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-24 px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-accent-black mb-6 leading-[1.15] uppercase">
            <span className="text-heat-100"><ScrambleHover text="Trusted" /></span>
            {" "}<ScrambleHover text="by leading" />{" "}
            <span className="text-heat-100"><ScrambleHover text="startups" /></span>
          </h2>
          
          <p className="text-lg text-black-alpha-64 font-normal max-w-xl mx-auto">
            Rapidscreen solutions just works
          </p>
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Card 1: Large Top Left - Andrej Karpathy */}
          <div className={cn(BENTO_CARD_CLASS, "md:col-span-2 relative overflow-hidden")}>
            <div className="absolute top-0 right-8 opacity-10 pointer-events-none">
              <svg width="104" height="102" viewBox="0 0 104 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M104 102V59.7273C104 26.7273 81.2727 0 48.2727 0V42.2727C61.4545 42.2727 71.7273 52.5455 71.7273 65.7273H48.2727V102H104ZM55.7273 102V59.7273C55.7273 26.7273 33 0 0 0V42.2727C13.1818 42.2727 23.4545 52.5455 23.4545 65.7273H0V102H55.7273Z" fill="white"/>
              </svg>
            </div>
            <TestimonialHeader testimonial={TESTIMONIALS[0]} />
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-4 text-white leading-relaxed">
                <HighlightedText text={TESTIMONIALS[0].text.split(':')[0] + ':'} highlights={TESTIMONIALS[0].highlightWords} />
              </h4>
              <p className="text-white/70 leading-relaxed text-sm">
                “ {TESTIMONIALS[0].text.split(':')[1].trim()} ”
              </p>
            </div>
          </div>

          {/* Card 2: Medium Top Middle - shadcn */}
          <div className={cn(BENTO_CARD_CLASS, "md:col-span-1")}>
            <TestimonialHeader testimonial={TESTIMONIALS[1]} />
            <div className="mt-6">
              <h4 className="text-base font-bold mb-4 text-white leading-tight">
                <HighlightedText text={TESTIMONIALS[1].text.split(',')[0] + ','} highlights={TESTIMONIALS[1].highlightWords} />
              </h4>
              <p className="text-white/70 leading-relaxed text-xs">
                “ {TESTIMONIALS[1].text.split(',').slice(1).join(',').trim()} ”
              </p>
            </div>
          </div>

          {/* Card 3: Tall Right Side - Greg Brockman */}
          <div className={cn(BENTO_CARD_CLASS, "md:col-span-1 md:row-span-2 flex flex-col")}>
            <TestimonialHeader testimonial={TESTIMONIALS[2]} />
            <div className="mt-6 flex-1">
              <h4 className="text-base font-bold mb-4 text-white leading-snug">
                <HighlightedText text={TESTIMONIALS[2].text.split('.')[0] + '.'} highlights={TESTIMONIALS[2].highlightWords} />
              </h4>
              <p className="text-white/70 leading-relaxed text-xs">
                “ {TESTIMONIALS[2].text.split('.').slice(1).join('.').trim()} ”
              </p>
            </div>
          </div>

          {/* Card 4: Small Bottom Left - Patrick Collison */}
          <div className={cn(BENTO_CARD_CLASS, "md:col-span-1")}>
            <TestimonialHeader testimonial={TESTIMONIALS[3]} />
            <div className="mt-6">
              <h4 className="text-base font-bold mb-4 text-white leading-tight">
                <HighlightedText text="Significant economic outcomes." highlights={["economic outcomes"]} />
              </h4>
              <p className="text-white/70 leading-relaxed text-xs">
                “ {TESTIMONIALS[3].text.split('.').slice(0, 1).join('.').trim() + '.'} ”
              </p>
            </div>
          </div>

          {/* Card 5: Medium-Large Bottom Middle - Diana Hu */}
          <div className={cn(BENTO_CARD_CLASS, "md:col-span-2")}>
            <TestimonialHeader testimonial={TESTIMONIALS[4]} />
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-4 text-white leading-relaxed">
                <HighlightedText text="It was night and day from one batch to another." highlights={["night and day"]} />
              </h4>
              <p className="text-white/70 leading-relaxed text-sm">
                “ {TESTIMONIALS[4].text} ”
              </p>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Particles */}
        <div className="absolute top-1/2 left-0 w-full h-[500px] -translate-y-1/2 -z-10 pointer-events-none overflow-hidden opacity-50">
           {/* We could add the ASCII art here if we had the exact strings, omitting to keep clean */}
        </div>
      </div>
    </section>
  );
}

