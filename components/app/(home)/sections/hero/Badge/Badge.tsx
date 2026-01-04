"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomeHeroBadge() {
  return (
    <Link
      className="superteam-gradient-btn p-2 rounded-full flex w-max mx-auto mb-12 lg:mb-16 items-center group"
      href="https://uk.superteam.fun/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="px-6 text-[10px] flex gap-4 items-center">
        <Image
          src="/helpbnk.jpg"
          alt="Helpbnk"
          width={16}
          height={16}
          className="rounded-full object-cover"
        />
        <div className="flex items-center">
          <span className="text-white whitespace-nowrap">Backed by Helpbnk</span>
        </div>
      </div>

      <div className="p-0.5">
        <div className="liquid-metal-btn size-14 flex-center rounded-full transition-all group-hover:w-24 overflow-hidden">
          <svg
            fill="none"
            height="6"
            viewBox="0 0 10 8"
            width="8"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <path
              className="transition-all -translate-x-2 group-hover:translate-x-0"
              d="M6 1L9 4L6 7"
              stroke="#D1D5DB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />

            <path
              className="transition-all -translate-x-3 group-hover:translate-x-0 scale-x-[0] group-hover:scale-x-[1] origin-right"
              d="M1 4L9 4"
              stroke="#D1D5DB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
