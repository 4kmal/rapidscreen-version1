"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Phone,
  MessageSquare,
  HardHat,
  Globe,
  Users,
  MapPin,
  Share2,
} from "lucide-react";
import { cn } from "@/utils/cn";

// --- Types & Data ---

type TabOption = "call" | "sms" | "whatsapp";

const CODE_SNIPPETS: Record<TabOption, string> = {
  call: `# Rapidscreen AI Caller
# Contacts 1000s of workers instantly

await rapidscreen.call_workers({
    'job_type': 'Steel Fixer',
    'location': 'London Bridge',
    'date': 'Tomorrow',
    'workers_needed': 15
})

# Results in minutes:
# - 247 workers contacted
# - 52 confirmed available
# - 15 matched & ready`,
  sms: `# Rapidscreen SMS Outreach
# Engage candidates via text

await rapidscreen.send_sms({
    'template': 'urgent_job',
    'worker_type': 'Labourer',
    'site_location': 'Canary Wharf',
    'pay_rate': '£18/hr',
    'start_time': '7:00 AM'
})

# Responses tracked automatically
# Intent detection built-in`,
  whatsapp: `# Rapidscreen WhatsApp
# Rich messaging with confirmations

await rapidscreen.whatsapp_engage({
    'worker_ids': ['w_123', 'w_456', 'w_789'],
    'message_type': 'job_offer',
    'include_map': true,
    'include_pay_details': true,
    'confirmation_required': true
})

# Read receipts & responses tracked
# Automatic follow-ups scheduled`
};

// --- Components ---

/**
 * Renders a simple syntax highlighted code block.
 */
const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: TabOption;
}) => {
  const lines = code.split("\n");

  return (
    <div className="font-mono text-xs sm:text-sm leading-6 overflow-x-auto">
      {lines.map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell text-right pr-4 select-none text-black-alpha-40 w-8 text-[10px] py-0.5 align-top">
            {i + 1}
          </span>
          <span className="table-cell whitespace-pre text-accent-black/90 py-0.5 align-top">
            <HighlightedLine line={line} language={language} />
          </span>
        </div>
      ))}
    </div>
  );
};

const HighlightedLine = ({
  line,
  language,
}: {
  line: string;
  language: TabOption;
}) => {
  // Very basic syntax highlighting for the demo
  if (line.trim().startsWith("#")) {
    return <span className="text-black-alpha-48">{line}</span>;
  }

  const parts = line.split(/(".*?"|'.*?')/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('"') || part.startsWith("'")) {
          return (
            <span key={i} className="text-heat-100">
              {part}
            </span>
          );
        }
        // Basic keywords
        const keywords = [
          "await", "rapidscreen", "true", "false"
        ];
        if (keywords.some(k => part.includes(k))) {
             return <span key={i} className={part.match(/^[a-zA-Z]/) ? "font-bold text-accent-black" : ""}>{part}</span>
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};


export default function CodeExamplesSection() {
  const [activeTab, setActiveTab] = useState<TabOption>("call");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-background-base w-full flex justify-center border-border-faint border-b md:border-b-0">
      <div className="container px-6 md:px-12 w-full max-w-[900px] border-x border-border-faint border-dashed md:border-solid bg-background-base relative z-10">
        
        {/* --- Top: Code Block Section --- */}
        <div className="flex flex-col border-b border-border-faint">
          {/* Tabs Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-8 sm:py-6 gap-4 border-b border-border-faint/50">
            <div className="flex items-center gap-2 p-1 bg-black-alpha-2 rounded-lg border border-border-faint/50">
              <button
                onClick={() => setActiveTab("call")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === "call"
                    ? "bg-accent-white text-accent-black shadow-sm ring-1 ring-border-faint"
                    : "text-black-alpha-48 hover:text-accent-black hover:bg-black-alpha-4"
                )}
              >
                <Phone className="w-4 h-4" />
                AI Calls
              </button>
              <button
                onClick={() => setActiveTab("sms")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === "sms"
                    ? "bg-accent-white text-accent-black shadow-sm ring-1 ring-border-faint"
                    : "text-black-alpha-48 hover:text-accent-black hover:bg-black-alpha-4"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === "whatsapp"
                    ? "bg-accent-white text-accent-black shadow-sm ring-1 ring-border-faint"
                    : "text-black-alpha-48 hover:text-accent-black hover:bg-black-alpha-4"
                )}
              >
                <Globe className="w-4 h-4" />
                WhatsApp
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-medium text-black-alpha-48 hover:text-accent-black transition-colors px-3 py-1.5 rounded-md hover:bg-black-alpha-4"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-accent-forest" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>

          {/* Code Area */}
          <div className="p-6 sm:p-8 bg-background-base min-h-[300px] flex items-center relative">
            <CodeBlock code={CODE_SNIPPETS[activeTab]} language={activeTab} />
          </div>
          
          {/* Decorative Grid Marker (Bottom Right of Code Block) */}
          <div className="absolute top-0 right-0 w-px h-full bg-border-faint hidden md:block" />
          <div className="absolute top-[380px] right-0 translate-x-[50%] translate-y-[-50%] z-20 hidden md:block">
            <span className="bg-background-base px-2 text-[10px] font-mono text-black-alpha-24">[ AI ]</span>
          </div>
        </div>

        {/* --- Bottom: Feature Grid (2 Cols) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-faint">
          
          {/* --- LEFT COLUMN: Worker Network --- */}
          <div className="flex flex-col">
            {/* Visual Area */}
            <div className="h-[360px] sm:h-[480px] w-full border-b border-border-faint relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px]">
              <div className="absolute inset-0 bg-gradient-to-t from-accent-white via-transparent to-transparent opacity-80" />
              
              {/* Central Hub Animation */}
              <div className="relative w-64 h-64">
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent-white rounded-full border border-border-faint shadow-sm flex items-center justify-center z-10">
                   <HardHat className="w-10 h-10 text-heat-100" />
                </div>
                
                {/* Orbiting Nodes */}
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="absolute w-12 h-12 bg-accent-white rounded-full border border-border-faint flex items-center justify-center shadow-sm"
                    style={{
                      top: `${50 + 35 * Math.sin(i * Math.PI / 2 + Math.PI/4)}%`,
                      left: `${50 + 35 * Math.cos(i * Math.PI / 2 + Math.PI/4)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                   {i === 0 && <Users className="w-5 h-5 text-black-alpha-40" />}
                   {i === 1 && <MapPin className="w-5 h-5 text-black-alpha-40" />}
                   {i === 2 && <Phone className="w-5 h-5 text-black-alpha-40" />}
                   {i === 3 && <MessageSquare className="w-5 h-5 text-black-alpha-40" />}
                  </div>
                ))}
                
                 {/* Connection Lines (SVGs) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none text-border-faint *:stroke-current" style={{ zIndex: 0 }}>
                    <line x1="50%" y1="50%" x2="25%" y2="25%" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="75%" y2="75%" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="25%" y2="75%" strokeWidth="1" strokeDasharray="4 4" />
                 </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="p-8 sm:p-12 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-2 text-black-alpha-48">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Worker Network</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-accent-black">
                60,000+ workers ready
              </h3>
              <p className="text-lg text-black-alpha-64 leading-relaxed max-w-md">
                Instant access to labourers, steel fixers, carpenters, electricians and more across the UK.
              </p>
              <button className="mt-4 px-4 py-2 bg-black-alpha-4 hover:bg-black-alpha-6 text-accent-black text-sm font-medium rounded-lg transition-colors border border-transparent hover:border-black/5">
                View worker types
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Instant Results --- */}
          <div className="flex flex-col">
            {/* Visual Area */}
            <div className="h-[360px] sm:h-[480px] w-full border-b border-border-faint relative flex items-center justify-center bg-black-alpha-2 p-6 sm:p-12">
               {/* Decorative Grid Background */}
               <div className="absolute inset-0" style={{ 
                  backgroundImage: `linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)`, 
                  backgroundSize: '40px 40px',
                  maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
                  opacity: 0.4
               }} />

               {/* Results Card */}
               <div className="bg-accent-white w-full max-w-[420px] rounded-xl border border-border-faint shadow-sm overflow-hidden relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border-faint">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-heat-100 rounded-md flex items-center justify-center shrink-0">
                           <Phone className="text-accent-white w-5 h-5" />
                         </div>
                         <div className="flex flex-col leading-none gap-1">
                            <div className="text-sm font-semibold text-accent-black">
                               Call Campaign Results
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-md border border-green-200 text-xs font-medium text-green-700">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                         Live
                      </div>
                  </div>

                  {/* Results Content */}
                  <div className="p-4 space-y-3">
                     <div className="flex items-center justify-between py-2 border-b border-border-faint/50">
                        <span className="text-sm text-black-alpha-64">Workers contacted</span>
                        <span className="text-sm font-bold text-accent-black">1,247</span>
                     </div>
                     <div className="flex items-center justify-between py-2 border-b border-border-faint/50">
                        <span className="text-sm text-black-alpha-64">Confirmed available</span>
                        <span className="text-sm font-bold text-heat-100">89</span>
                     </div>
                     <div className="flex items-center justify-between py-2 border-b border-border-faint/50">
                        <span className="text-sm text-black-alpha-64">Matched to role</span>
                        <span className="text-sm font-bold text-accent-black">52</span>
                     </div>
                     <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-black-alpha-64">Time elapsed</span>
                        <span className="text-sm font-bold text-heat-100">47 minutes</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Text Content */}
            <div className="p-8 sm:p-12 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-2 text-black-alpha-48">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-accent-black">
                Qualified candidates in &lt;1 hour
              </h3>
              <p className="text-lg text-black-alpha-64 leading-relaxed max-w-md">
                Our AI contacts thousands of workers instantly, verifies availability, and matches them to your requirements.
              </p>
              <button className="mt-4 px-4 py-2 bg-heat-100 hover:opacity-90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                Start recruiting
              </button>
            </div>
          </div>

        </div>

        {/* --- Grid Decorations --- */}
        <div className="absolute -left-[1px] top-1/4 w-[1px] h-20 bg-heat-100/20 hidden md:block" />
        <div className="absolute -right-[1px] top-3/4 w-[1px] h-20 bg-heat-100/20 hidden md:block" />

      </div>
    </section>
  );
}
