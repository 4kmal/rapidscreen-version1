"use client";

import React, { useState } from "react";
import { Check, Flame, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const CornerRect = ({
  className,
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("absolute pointer-events-none z-10", className)}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path d="M11 1C5.47715 1 1 5.47715 1 11" stroke="#E0E0E0" strokeWidth="1" />
  </svg>
);

const PricingFeature = ({
  children,
  highlight = false,
  badge,
  className,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  badge?: string;
  className?: string;
}) => (
  <li className={cn("flex items-start gap-2 text-body-medium", className)}>
    <div className="mt-[3px] shrink-0">
      {highlight ? (
        <Flame className="size-4 text-heat-100" fill="currentColor" />
      ) : (
        <Check className="size-4 text-border-faint" />
      )}
    </div>
    <span className="text-sm leading-tight text-black-alpha-64">
      {children}
      {badge && (
        <span className="ml-1 inline-block rounded-[3px] bg-heat-40/10 px-1 py-px text-[10px] font-medium text-heat-100 uppercase">
          {badge}
        </span>
      )}
    </span>
  </li>
);

interface PlanProps {
  name: string;
  description: string;
  workers: string;
  price: string;
  priceSuffix?: string;
  ctaText: string;
  ctaVariant?: "primary" | "secondary";
  features: { text: string; highlight?: boolean; badge?: string }[];
  popular?: boolean;
  className?: string;
}

const PricingCard = ({
  name,
  description,
  workers,
  price,
  priceSuffix,
  ctaText,
  ctaVariant = "secondary",
  features,
  popular,
  className,
}: PlanProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col h-full border-r border-b border-border-faint bg-background-base p-6 transition-colors hover:bg-black-alpha-4/20",
        className
      )}
    >
      {popular && (
        <div className="mb-2 w-fit rounded-full bg-[#fa5d1914] px-2 py-0.5 text-xs font-medium text-heat-100">
          Most popular
        </div>
      )}

      <h3 className="text-xl font-bold text-accent-black">{name}</h3>
      <p className="mt-2 text-sm text-black-alpha-48 min-h-[40px] leading-relaxed">
        {description}
      </p>

      <div className="mt-6 font-mono text-sm text-accent-black flex items-center gap-2">
        <span className="flex items-center justify-center rounded-full border border-current w-4 h-4 text-[8px] opacity-60">
          👷
        </span>
        {workers}
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-accent-black tracking-tight">
          {price}
        </span>
        {priceSuffix && <span className="text-sm text-black-alpha-48">/{priceSuffix}</span>}
      </div>

      <div className="mt-8">
        <button
          className={cn(
            "w-full rounded-md px-4 py-2 text-sm font-medium transition-all active:scale-95",
            ctaVariant === "primary"
              ? "bg-heat-100 text-white hover:opacity-90 shadow-sm"
              : "bg-black-alpha-4 text-accent-black hover:bg-black-alpha-7"
          )}
        >
          {ctaText}
        </button>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((feature, i) => (
          <PricingFeature key={i} highlight={feature.highlight} badge={feature.badge}>
            {feature.text}
          </PricingFeature>
        ))}
      </ul>

      <CornerRect className="-bottom-px -right-px" rotation={180} />
    </div>
  );
};

export default function PricingSection() {
  return (
    <section className="relative w-full bg-background-base text-accent-black font-sans selection:bg-heat-100/20 selection:text-heat-100 border-b border-border-faint overflow-hidden" id="pricing">
      <div className="container mx-auto max-w-[1200px] px-6 md:px-12 relative border-x border-border-faint min-h-screen md:min-h-0 pt-24 pb-32">
        {/* Section Marker */}
        <div className="absolute left-6 md:left-12 top-0 md:top-24 hidden xl:block">
           <div className="flex items-center gap-2 font-mono text-xs tracking-wider transform -translate-x-[calc(100%+24px)]">
            <span className="w-0.5 h-3 bg-heat-100 inline-block" />
            <span className="text-heat-100 font-bold">04</span>
            <span className="text-black-alpha-40">/ 07</span>
            <span className="text-black-alpha-40 ml-2">PRICING</span>
          </div>
        </div>

        <div className="relative border-t border-border-faint">
          <div className="grid grid-cols-1 border-b border-border-faint">
            <div className="relative flex flex-col items-center justify-center py-20 text-center">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

              <div className="relative z-10 flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center size-4 rounded-full bg-heat-40/10">
                  <div className="size-2 rounded-full bg-heat-100 animate-pulse" />
                </div>
                <span className="text-xs font-medium text-black-alpha-48 uppercase tracking-wide">
                  Risk-Free Start
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Better than any <span className="text-heat-100">agency quote</span>
              </h2>
              <p className="max-w-md mx-auto text-black-alpha-48 text-sm md:text-base leading-relaxed">
                Start with 5 free placements. If you receive a better quote from another agency,
                <br />
                we'll discount it by 25%.
              </p>
            </div>
          </div>

          <div className="border-b border-border-faint bg-background-base">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-4 px-6">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-black">
                <span className="size-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  🇬🇧
                </span>
                GBP
              </div>

              <div className="hidden md:block w-px h-4 bg-border-faint" />

              <div className="flex items-center gap-3">
                <span className="text-sm text-heat-100 font-medium">
                  ✓ First 5 placements FREE
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              name="Trial"
              description="Try our service completely risk-free. No cost, no commitment."
              workers="5 free placements"
              price="£0"
              priceSuffix="to start"
              ctaText="Get started"
              features={[
                { text: "5 free worker placements" },
                { text: "Full AI screening" },
                { text: "SMS & WhatsApp outreach" },
                { text: "Worker visualization" },
                { text: "No obligation", highlight: true },
              ]}
              className="lg:border-l-0"
            />

            <PricingCard
              name="Standard"
              popular={true}
              description="Perfect for ongoing construction projects with regular worker needs."
              workers="Unlimited placements"
              price="Custom"
              priceSuffix="per placement"
              ctaText="Get a quote"
              ctaVariant="primary"
              features={[
                { text: "Unlimited worker placements" },
                { text: "1000s of workers called instantly" },
                { text: "Full candidate verification" },
                { text: "Priority matching" },
                { text: "Dedicated support" },
                { text: "25% price match guarantee", highlight: true, badge: "Guarantee" },
              ]}
            />

            <PricingCard
              name="Enterprise"
              description="Custom solutions for large-scale construction operations."
              workers="Volume discounts"
              price="Custom"
              priceSuffix="negotiated"
              ctaText="Contact us"
              features={[
                { text: "Bulk worker placements" },
                { text: "Dedicated account manager" },
                { text: "Custom worker pools" },
                { text: "SLA guarantees" },
                { text: "Multi-site coordination" },
                { text: "Priority 24/7 support" },
              ]}
              className="md:border-r-0"
            />
          </div>

          <div className="w-full border-b border-border-faint py-4 bg-background-base/50">
            <div className="flex items-center justify-center gap-2 text-xs text-black-alpha-48">
              <span className="bg-heat-100 text-white rounded-full size-4 flex items-center justify-center font-mono text-[10px]">
                ✓
              </span>
              <span>
                We won't be beaten on price. Better quote? We'll beat it by 25%.{" "}
                <a href="#" className="text-heat-100 hover:underline">
                  Contact us ↗
                </a>
              </span>
            </div>
          </div>

          <CornerRect className="-top-px -left-px" />
          <CornerRect className="-top-px -right-px" rotation={90} />
          <CornerRect className="-bottom-px -left-px" rotation={-90} />
          <CornerRect className="-bottom-px -right-px" rotation={180} />
        </div>
      </div>
    </section>
  );
}
