"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { cn } from "@/utils/cn";

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldShrink, setShouldShrink] = useState(false);
  const pathname = usePathname();
  const lastShrinkState = useRef(false);

  useEffect(() => {
    const heroContentHeight =
      document.getElementById("hero-content")?.clientHeight;
    const triggerTop = heroContentHeight ? heroContentHeight : 100;
    // Hysteresis buffer to prevent rapid toggling at threshold
    const hysteresis = 20;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const currentShrink = lastShrinkState.current;
      
      // Only change state if we've crossed the threshold with buffer
      if (currentShrink && scrollY < triggerTop - hysteresis) {
        lastShrinkState.current = false;
        setShouldShrink(false);
      } else if (!currentShrink && scrollY > triggerTop + hysteresis) {
        lastShrinkState.current = true;
        setShouldShrink(true);
      }
    };

    // Initial check without hysteresis
    const initialShrink = window.scrollY > triggerTop;
    lastShrinkState.current = initialShrink;
    setShouldShrink(initialShrink);

    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <div
      className={cn(
        "container lg:px-56 px-16 flex justify-between transition-[padding] duration-[200ms] items-center",
        shouldShrink ? "py-20" : "py-20 lg:py-34",
      )}
    >
      {children}
    </div>
  );
}
