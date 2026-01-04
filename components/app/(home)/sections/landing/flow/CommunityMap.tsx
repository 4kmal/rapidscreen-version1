"use client";

import { useState, useMemo } from "react";
import { MAP_PATHS } from "../map-paths";

// State names mapping for Malaysia map
const STATE_NAMES = [
  "Perlis",
  "Kedah",
  "Pulau Pinang",
  "Perak",
  "Terengganu",
  "Pahang",
  "Kelantan",
  "Negeri Sembilan",
  "Melaka",
  "Selangor",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Kuala Lumpur",
  "Johor",
  "Sabah",
  "Wilayah Persekutuan Labuan",
  "Sarawak"
];

// Mock data for developer distribution across Malaysia (150 total)
const MOCK_DEVELOPER_DATA = [
  { name: "Wilayah Persekutuan Kuala Lumpur", value: 45 },
  { name: "Selangor", value: 32 },
  { name: "Pulau Pinang", value: 18 },
  { name: "Johor", value: 15 },
  { name: "Sarawak", value: 12 },
  { name: "Sabah", value: 10 },
  { name: "Perak", value: 8 },
  { name: "Melaka", value: 6 },
  { name: "Kedah", value: 4 },
];

// Simple linear scale function
function linearScale(value: number, domainMin: number, domainMax: number, rangeMin: number, rangeMax: number): number {
  const normalized = (value - domainMin) / (domainMax - domainMin);
  return rangeMin + normalized * (rangeMax - rangeMin);
}

export function CommunityMap() {
  const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxUsers = useMemo(() => {
    return Math.max(...MOCK_DEVELOPER_DATA.map((d) => d.value), 1);
  }, []);

  const totalDevelopers = useMemo(() => {
    return MOCK_DEVELOPER_DATA.reduce((sum, d) => sum + d.value, 0);
  }, []);

  const getStateValue = (index: number) => {
    const stateName = STATE_NAMES[index];
    if (!stateName) return 0;

    const found = MOCK_DEVELOPER_DATA.find((s) =>
      s.name.toLowerCase().includes(stateName.toLowerCase()) ||
      stateName.toLowerCase().includes(s.name.toLowerCase())
    );
    return found?.value || 0;
  };

  const getOpacity = (value: number) => {
    if (value === 0) return 0.15;
    return linearScale(value, 1, maxUsers, 0.35, 1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#0a0f0a] to-[#0f1a0f] relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <div className="text-center pt-4 pb-2 relative z-10">
        <p className="text-xs font-mono text-green-300/60 flex items-center justify-center gap-1.5">
          <span>{totalDevelopers.toLocaleString()} developers across Malaysia</span>
        </p>
      </div>

      {/* Map Container */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 pb-4"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Tooltip */}
        {hoveredStateIndex !== null && (
          <div
            className="absolute z-30 pointer-events-none px-3 py-2 font-mono text-xs border rounded-lg shadow-lg backdrop-blur-sm"
            style={{ 
              left: tooltipPos.x + 12, 
              top: tooltipPos.y + 12,
              background: 'rgba(10, 15, 10, 0.95)',
              borderColor: 'rgba(34, 197, 94, 0.5)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
            }}
          >
            <span className="font-bold text-green-300 block">
              {STATE_NAMES[hoveredStateIndex] || "Unknown"}
            </span>
            <span className="text-green-400/80">
              {getStateValue(hoveredStateIndex).toLocaleString()} devs
            </span>
          </div>
        )}

        {/* SVG Map */}
        <svg
          viewBox="0 0 940 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-h-[280px]"
          style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.15))' }}
        >
          {/* Glow filter definition */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {MAP_PATHS.map((pathData, index) => {
            const val = getStateValue(index);
            const isActive = val > 0;
            const isHovered = hoveredStateIndex === index;

            // Color based on activity
            let fillColor = isActive ? "#22c55e" : "#1a2a1a";
            let strokeColor = isActive ? "#22c55e" : "#2a3a2a";
            let fillOpacity = isActive ? getOpacity(val) : 0.3;

            // Hover effects
            if (isHovered) {
              fillColor = "#22c55e";
              strokeColor = "#4ade80";
              fillOpacity = isActive ? 1 : 0.5;
            }

            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHovered ? "2" : "1"}
                fillOpacity={fillOpacity}
                className="transition-all duration-200 cursor-pointer"
                style={{ 
                  filter: isHovered && isActive ? 'url(#glow)' : 'none'
                }}
                onMouseEnter={() => setHoveredStateIndex(index)}
                onMouseLeave={() => setHoveredStateIndex(null)}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 text-[10px] font-mono text-green-300/70 px-2 py-1.5 bg-black/50 border border-green-500/20 rounded-md backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-sm shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#1a2a1a] border border-green-500/30 rounded-sm"></span>
            <span>No devs</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CommunityMap;

