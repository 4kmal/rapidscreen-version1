"use client";

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { ScrambleText } from '@/components/ui/scramble';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/components/shared/sound-context/SoundContext';

type FAQSection = "suara" | "krackeddev" | "general" | "gde";

// FAQ Data organized by section
const faqSections: Record<FAQSection, { title: string; categories: { category: string; items: { question: string; answer: string }[] }[] }> = {
  general: {
    title: "General",
    categories: [
      {
        category: "About RapidScreen",
        items: [
          {
            question: "What does RapidScreen do?",
            answer: "RapidScreen builds Malaysian-owned AI infrastructure, develops deployable engineering talent, and delivers production-grade digital solutions. This allows organisations to ship systems that work reliably in Malaysia's real operating conditions (dialects, low-connectivity areas, and regulated environments)."
          },
          {
            question: "What are RapidScreen's three pillars?",
            answer: "1. SUARA: Malaysia's national-grade Voice AI platform\n2. KrackedDevs: AI-augmented developer guild and delivery operating system\n3. Government, Military & Enterprise Solutions: Mission-critical deployments and software delivery powered by SUARA + KrackedDevs"
          },
          {
            question: "Why three pillars instead of one product?",
            answer: "Because reliable national-scale deployment requires: Infrastructure (SUARA), Delivery capacity (KrackedDevs), and Execution (Solutions that ship). Together, each deployment strengthens the ecosystem and increases future delivery speed and quality."
          },
          {
            question: "Who do you serve?",
            answer: "We serve Government and public sector agencies, Enterprises and GLCs, SMEs and mid-tier companies, and Institutions delivering citizen-facing services."
          }
        ]
      },
      {
        category: "Security & Trust",
        items: [
          {
            question: "Where is data hosted and who owns it?",
            answer: "For public-sector models, the governance approach is sovereignty-first: data can be GovCloud-hosted, with government ownership and access control, and privacy-by-design principles."
          },
          {
            question: "Do you access raw citizen personal data?",
            answer: "For national-scale public models, the architecture can be designed so that only anonymised, aggregated signals are used for dashboards and performance insights, with strict controls to minimise exposure."
          },
          {
            question: "Do you support secure-by-design engineering?",
            answer: "Yes. Delivery standards incorporate secure-by-design habits, review discipline, and audit-oriented practices. This is especially important for government and enterprise environments."
          }
        ]
      },
      {
        category: "Getting Started",
        items: [
          {
            question: "How do we start: pilot or full rollout?",
            answer: "Most organisations begin with a scoped pilot: limited use cases, clear KPIs, and phased onboarding (agent-assist → automation), then scale after performance is validated."
          },
          {
            question: "Do you offer different engagement models?",
            answer: "Yes. Models can include commissioned builds, platform licensing, or structured partnerships. This is particularly relevant for public-sector deployments that require clear governance, ownership, and long-term operation."
          },
          {
            question: "What is RapidScreen's 'national return' commitment?",
            answer: "RapidScreen positions reinvestment as structural (not symbolic), including a commitment where a portion of profits can be directed toward strengthening Malaysia's AI infrastructure and human capability (e.g., sovereign datasets/models, rural inclusion deployments, scholarships)."
          }
        ]
      }
    ]
  },
  suara: {
    title: "SUARA",
    categories: [
      {
        category: "Platform Overview",
        items: [
          {
            question: "What is SUARA?",
            answer: "SUARA is a commercial-grade Voice AI infrastructure designed for Malaysia. It supports Bahasa Malaysia, English, and major local dialects, including deployment options that work in low-connectivity contexts."
          },
          {
            question: "What problems does SUARA solve?",
            answer: "SUARA addresses common Voice AI gaps in Malaysia such as: Limited dialect performance, Poor experiences for rural and low-connectivity users, and Over-reliance on foreign platforms and data exposure risks."
          },
          {
            question: "What can SUARA be used for?",
            answer: "Typical use cases include: Customer support voicebots and agent-assist, Appointment and order management, Citizen helpdesks and hotline automation, Healthcare voice documentation and access, and Education and research datasets/APIs."
          }
        ]
      },
      {
        category: "Capabilities",
        items: [
          {
            question: "Can SUARA work in rural or low-bandwidth environments?",
            answer: "Yes. SUARA is designed to support online and edge/offline deployment patterns, enabling voice experiences for low-bandwidth and constrained environments."
          },
          {
            question: "How does SUARA support national inclusion?",
            answer: "SUARA enables 'GenAI by phone call' approaches for users without smartphones, stable internet, or high digital literacy. This makes voice a universal on-ramp for essential services."
          },
          {
            question: "How does SUARA handle government hotline scale and service hours?",
            answer: "SUARA can be deployed as part of 24/7 voice concierge models that answer routine intents quickly and escalate complex matters to officers with full context, reducing wait times and improving consistency."
          },
          {
            question: "Does SUARA support structured insights from interactions?",
            answer: "Yes. Implementations can generate structured, privacy-preserving signals (e.g., intent categories, drop-off points, service bottlenecks) to drive continuous service improvement and operational decision-making."
          }
        ]
      },
      {
        category: "Roadmap & Safety",
        items: [
          {
            question: "What is SUARA's roadmap direction?",
            answer: "SUARA's roadmap includes expanded accessibility features such as support for additional modalities (e.g., sign language and braille-related AI) to broaden inclusion."
          },
          {
            question: "How do you manage policy safety and answer consistency for government voice systems?",
            answer: "Deployments can be configured to ministry knowledge bases and policies, with versioned scripts, audit trails, and controlled escalation pathways to prevent inconsistent guidance."
          }
        ]
      }
    ]
  },
  krackeddev: {
    title: "KrackedDevs",
    categories: [
      {
        category: "What is KrackedDevs",
        items: [
          {
            question: "What is KrackedDevs?",
            answer: "KrackedDevs is Malaysia's AI-augmented developer guild that upgrades capable 'median' developers into higher-performing builders using agentic AI workflows and modern engineering discipline. We then deploy them with governance to protect delivery outcomes."
          },
          {
            question: "Are you a recruiter, job board, or bootcamp?",
            answer: "No. KrackedDevs is not a conventional recruiter, job board, or bootcamp. It is a capability transformation + verification + deployment model, reinforced by an operating layer (Kracked OS) for continuity and accountability."
          },
          {
            question: "What problem does KrackedDevs solve for SMEs and institutions?",
            answer: "Many organisations cannot hire elite talent at global rates, and outsourcing often creates technical debt and weak ownership. KrackedDevs focuses on manufacturing reliable delivery (quality, speed, and governance), not merely matching CVs to roles."
          }
        ]
      },
      {
        category: "Pipeline & Process",
        items: [
          {
            question: "How does the KrackedDevs pipeline work?",
            answer: "A typical flow is: 1. Source & vet for fundamentals and consistency, 2. Upgrade via intensive programme (agentic AI workflows + production discipline), 3. Deploy with oversight and delivery visibility, 4. Sustain performance post-deployment."
          },
          {
            question: "What is 'Kracked OS'?",
            answer: "Kracked OS is the operating layer that keeps delivery value on-platform, addressing marketplace failure modes (quality variance and disintermediation) through: Delivery visibility (velocity, quality, security checks), Compliance-aligned workflows and project governance, Developer payment assurance and a verifiable delivery record."
          },
          {
            question: "How do you prevent 'vibe coding' and low-quality AI-generated code?",
            answer: "KrackedDevs embeds controls such as: Architectural review discipline, Secure-by-design practices, Audit-oriented delivery standards, and Remediation pathways when issues arise."
          }
        ]
      },
      {
        category: "Engagement",
        items: [
          {
            question: "What does KrackedDevs mean by 'transformation before placement'?",
            answer: "It means developers are trained, tested, and operationalised before entering client environments, reducing adoption risk and improving delivery ROI. This is especially valuable for SMEs and public programmes."
          },
          {
            question: "How does KrackedDevs align with Malaysia's national priorities?",
            answer: "KrackedDevs strengthens the execution layer: the builder capacity needed to translate national strategies into delivered outcomes. This aligns with national digitalisation, AI readiness, and inclusive productivity goals."
          },
          {
            question: "How do we engage KrackedDevs: hire talent or deliver a project?",
            answer: "Both options exist depending on your need: you can engage KrackedDevs for governed placements (builders with oversight) or for end-to-end delivery within a broader RapidScreen solutions engagement."
          }
        ]
      }
    ]
  },
  gde: {
    title: "I.G.M.E",
    categories: [
      {
        category: "Overview",
        items: [
          {
            question: "What is this pillar in simple terms?",
            answer: "This pillar is RapidScreen's solution delivery capability: we design, build, integrate, and deploy digital systems for government, military, and enterprise environments. We focus on contexts where reliability, governance, and operational readiness matter."
          },
          {
            question: "What types of solutions do you build?",
            answer: "We deliver solutions across three common categories: Citizen/customer service systems (e.g., omnichannel helpdesks, workflow automation, knowledge-enabled assistants, case triage), Internal operations systems (e.g., dashboards, portals, approvals, tasking systems, reporting automation), and Mission and compliance-oriented systems (e.g., controlled environments, audit-friendly workflows, secure deployments)."
          },
          {
            question: "Do you only build Voice AI solutions?",
            answer: "No. Voice AI can be one component, but we also build end-to-end software systems: web applications, internal platforms, workflow tools, integration layers, and data pipelines. It all depends on the operational need."
          },
          {
            question: "What makes RapidScreen different from a typical software vendor?",
            answer: "We focus on deployments that ship and stay operational, not prototypes. That typically means: clear solution scope and governance, production engineering discipline, controlled rollout and change management, and measurable outcomes and continuous improvement after go-live."
          }
        ]
      },
      {
        category: "Delivery Approach",
        items: [
          {
            question: "What is your typical delivery approach?",
            answer: "A standard approach looks like: 1. Discovery & scoping (problem definition, requirements, constraints, success metrics), 2. Solution architecture (systems design, integration plan, security model), 3. Build & test (development, QA, UAT, performance checks), 4. Deployment (pilot → phased rollout → scale), 5. Operate & improve (monitoring, support, iteration, optimisation)."
          },
          {
            question: "Can you integrate with our existing systems?",
            answer: "Yes. Most deployments involve integration (e.g., identity/authentication, databases, legacy systems, case management, knowledge bases, ticketing, analytics). We design the solution to fit the existing environment rather than forcing a rip-and-replace."
          },
          {
            question: "Do you support on-premise or restricted environments?",
            answer: "Yes. For government and high-security environments, solutions can be delivered with deployment models suitable for restricted networks (subject to your security policies and architecture constraints)."
          },
          {
            question: "How long does a typical project take?",
            answer: "It depends on scope and integration complexity. In practice: Pilot or MVP is often measured in weeks, Full production rollout typically takes longer due to UAT cycles, integration, security reviews, and rollout governance. We structure timelines around delivery phases so stakeholders can see progress early."
          }
        ]
      },
      {
        category: "Security & Governance",
        items: [
          {
            question: "How do you handle security, data governance, and compliance?",
            answer: "We implement a governance-first delivery model, typically covering: access control and role-based permissions, audit trails and logging, data minimisation and retention policies (as required), and secure deployment practices aligned to the client's compliance obligations."
          },
          {
            question: "Who owns the system and IP after delivery?",
            answer: "By default, solution ownership and IP terms are handled contractually. For many government and enterprise engagements, arrangements commonly include: client ownership of the deployed system and data, defined licensing or handover terms for reusable components, and clear boundaries around third-party dependencies."
          },
          {
            question: "Can you work with procurement requirements and formal delivery governance?",
            answer: "Yes. We can support standard enterprise/public sector procurement processes and deliverables (requirements documentation, delivery plans, test evidence, security documentation, training materials), aligned to your governance structure."
          }
        ]
      },
      {
        category: "Support & Success",
        items: [
          {
            question: "Do you provide support after go-live?",
            answer: "Yes. We can provide post-deployment support and maintenance, including: incident response processes, patching and updates, performance monitoring, and enhancement cycles based on operational feedback."
          },
          {
            question: "What do you need from us to start?",
            answer: "Usually: a clear problem statement and target user groups, access to relevant system documentation (if integrating), nominated stakeholders for requirements and UAT, your security/compliance constraints (hosting, access, approvals), and agreement on success metrics (what 'good' looks like)."
          },
          {
            question: "How do you measure success?",
            answer: "We align success to outcomes such as: reduced processing time and operational workload, improved service consistency and completion rates, reduced backlog and faster resolution cycles, improved visibility through dashboards and structured reporting, and stronger audit readiness and governance."
          }
        ]
      }
    ]
  }
};

const sectionOrder: FAQSection[] = ["suara", "krackeddev", "general", "gde"];

const sectionLabels: Record<FAQSection, string> = {
  suara: "Suara",
  krackeddev: "KrackedDev",
  general: "General",
  gde: "I.G.M.E"
};

export default function FAQSection() {
  const [activeSection, setActiveSection] = useState<FAQSection>("general");
  const { playClick } = useSound();

  const currentData = faqSections[activeSection];

  return (
    <section className="bg-background-base text-accent-black font-sans relative overflow-hidden border-t-2 border-border-muted">
       {/* Diagonal Lines Background - CSS gradient instead of 300 divs */}
       <div 
         className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
         style={{
           backgroundImage: `repeating-linear-gradient(
             -45deg,
             transparent,
             transparent 20px,
             rgba(55,50,47,0.025) 20px,
             rgba(55,50,47,0.025) 21px
           )`
         }}
       />

       {/* Full-height border lines */}
       <div className="absolute inset-0 pointer-events-none z-[1]">
         <div className="container mx-auto h-full max-w-[900px] border-x-2 border-border-muted" />
       </div>

       {/* Background Grid Pattern (Simplified for context) */}
       <div className="absolute inset-x-0 top-0 h-px bg-border-faint max-w-[900px] mx-auto z-10" />
      
      <div className="container mx-auto px-6 max-w-[900px] relative z-20 py-24 lg:py-32">
        {/* Section Marker */}
        <div className="absolute left-6 md:left-12 top-0 md:top-24 hidden xl:block">
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider transform -translate-x-[calc(100%+24px)]">
            <span className="w-0.5 h-3 bg-heat-100 inline-block" />
            <span className="text-heat-100 font-bold">02</span>
            <span className="text-black-alpha-40">/ 02</span>
            <span className="text-black-alpha-40 ml-2 uppercase">FAQ</span>
          </div>
        </div>
        
        {/* Section Toggle - Moved above Header */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="p-[2px] bg-black-alpha-8 shadow-[0px_1px_0px_rgba(255,255,255,0.5)] rounded-full border-[0.5px] border-border-faint grid grid-cols-4 gap-[2px] relative w-max">
            {/* Active indicator */}
            <div
              className="absolute top-[2px] h-[calc(100%-4px)] bg-background-base shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `calc(${100 / sectionOrder.length}% - 2px)`,
                left: `calc(${sectionOrder.indexOf(activeSection) * (100 / sectionOrder.length)}% + 1px)`
              }}
            />

            {sectionOrder.map((section) => (
              <button
                key={section}
                onClick={() => {
                  playClick();
                  setActiveSection(section);
                }}
                className="px-4 py-1 rounded-full flex justify-center items-center transition-colors duration-300 relative z-10"
              >
                <span
                  className={`text-[13px] font-medium leading-5 transition-colors duration-300 whitespace-nowrap uppercase tracking-wide ${
                    activeSection === section ? "text-accent-black" : "text-black-alpha-48"
                  }`}
                >
                  {sectionLabels[section]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-16 md:mb-24 relative">
            {/* Headline */}
            <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-accent-black uppercase">
                  Frequently Asked Questions
                </h2>
                <span 
                  className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-heat-100 uppercase"
                  style={{ fontFamily: "'Departure Mono', monospace" }}
                >
                  <ScrambleText 
                    text={sectionLabels[activeSection]} 
                    scrambleSpeed={25}
                    maxIterations={15}
                    sequential={true}
                    revealDirection="start"
                  />
                </span>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light mx-auto mt-2">
                Explore our FAQs and find the answers you need about Rapidscreen.
                </p>
            </div>
        </div>

        {/* FAQ List */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col gap-12"
          >
            {currentData.categories.map((categoryGroup) => (
              <div key={categoryGroup.category} className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-accent-black px-4">
                  {categoryGroup.category}
                </h3>
                
                <div className="flex flex-col gap-4">
                  {categoryGroup.items.map((item, i) => (
                    <FAQCard 
                      key={i} 
                      question={item.question} 
                      answer={item.answer} 
                      index={i}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FAQCard({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { playToggleOn, playToggleOff } = useSound();

  return (
    <motion.div
      className="rounded-2xl border border-border-faint bg-black-alpha-2 p-6 shadow-sm transition-colors duration-150 hover:border-heat-100/30 cursor-pointer group"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.015 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => {
        isOpen ? playToggleOff() : playToggleOn();
        setIsOpen(!isOpen);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className={`text-base md:text-lg font-medium transition-colors duration-150 ${isOpen ? 'text-heat-100' : 'text-accent-black group-hover:text-heat-100'}`}>
          {question}
        </h3>
        <div 
          className="flex-shrink-0 flex items-center justify-center transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {isOpen ? (
            <Minus className="text-heat-100" size={20} />
          ) : (
            <Plus className="text-black-alpha-40 group-hover:text-heat-100 transition-colors" size={20} />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.1 },
            }}
            className="overflow-hidden"
          >
            <p className="text-base leading-relaxed text-black-alpha-64 whitespace-pre-line border-t border-border-faint pt-4 mt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
