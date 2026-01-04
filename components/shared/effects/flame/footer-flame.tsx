"use client";

import { useEffect, useRef } from "react";

import { setIntervalOnVisible } from "@/utils/set-timeout-on-visible";
import data from "./hero-flame-data.json";

export default function FooterFlame() {
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
      className="w-full h-full absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden"
      ref={wrapperRef}
    >
      <div
        className="text-heat-100/30 font-ascii fc-decoration"
        dangerouslySetInnerHTML={{ __html: data[0] }}
        ref={ref}
        style={{
          whiteSpace: "pre",
          fontSize: "7px",
          lineHeight: "9px",
          transform: "translateY(30%)",
        }}
      />
    </div>
  );
}

