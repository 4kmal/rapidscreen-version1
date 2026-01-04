"use client";

import { useEffect, useRef } from "react";
import { setIntervalOnVisible } from "@/utils/set-timeout-on-visible";
import data from "./hero-flame-data.json";

// Footer-specific version of HeroFlame - single centered flame, same on all screens
export default function FooterHeroFlame() {
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;

    const interval = setIntervalOnVisible({
      element: wrapperRef.current,
      callback: () => {
        index++;
        if (index >= data.length) index = 0;

        if (ref.current) {
          ref.current.innerHTML = data[index];
        }
      },
      interval: 85,
    });

    return () => interval?.();
  }, []);

  return (
    <div
      className="w-full h-[250px] absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none select-none overflow-hidden"
      ref={wrapperRef}
    >
      <div
        className="text-black-alpha-20 font-ascii fc-decoration text-center"
        dangerouslySetInnerHTML={{ __html: data[0] }}
        ref={ref}
        style={{
          whiteSpace: "pre",
          fontSize: "9px",
          lineHeight: "11px",
        }}
      />
    </div>
  );
}

