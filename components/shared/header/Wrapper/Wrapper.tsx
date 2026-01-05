"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { cn } from "@/utils/cn";

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const lastScrollState = useRef(false);

  useEffect(() => {
    const triggerTop = 100;
    const hysteresis = 20;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const currentState = lastScrollState.current;
      
      if (currentState && scrollY < triggerTop - hysteresis) {
        lastScrollState.current = false;
        setIsScrolled(false);
      } else if (!currentState && scrollY > triggerTop + hysteresis) {
        lastScrollState.current = true;
        setIsScrolled(true);
      }
    };

    const initialState = window.scrollY > triggerTop;
    lastScrollState.current = initialState;
    setIsScrolled(initialState);

    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-4 z-[9999] mx-auto flex flex-row items-center justify-between",
        "rounded-xl backdrop-blur-sm",
        "border shadow-lg",
        "transition-all duration-300 ease-out",
        isScrolled ? "max-w-[900px]" : "max-w-[1314px]"
      )}
      style={{
        willChange: "transform, max-width",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        padding: isScrolled ? "12px 24px" : "12px 24px",
        // Dark mode glassmorphism: #1a1a1d at 80% opacity
        backgroundColor: "rgba(26, 26, 29, 0.80)",
        // Border: #3a3a3a at 50% opacity
        borderColor: "rgba(58, 58, 58, 0.50)",
        // Subtle dark shadow
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15)",
      }}
    >
      {children}
    </header>
  );
}
