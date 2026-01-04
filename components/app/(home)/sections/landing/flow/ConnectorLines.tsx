import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConnectorLinesProps {
  containerRef: React.RefObject<HTMLDivElement>;
  connections: Array<{ start: string; end: string; color?: string; cardIndex?: number }>;
  elementRegistry: Map<string, HTMLElement>;
  activeCardIndex?: number;
}

// Helper to get coordinates relative to the container
const getRelativePos = (element: HTMLElement, container: HTMLElement) => {
  const elRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elRect.left - containerRect.left + elRect.width / 2,
    y: elRect.top - containerRect.top + elRect.height / 2,
    top: elRect.top - containerRect.top,
    bottom: elRect.bottom - containerRect.top,
    width: elRect.width,
    height: elRect.height,
  };
};

// CSS for the flowing animation
const flowingAnimationStyles = `
  @keyframes flowDown {
    0% {
      stroke-dashoffset: 24;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  
  .connector-line-flowing {
    animation: flowDown 0.8s linear infinite;
  }
`;

export const ConnectorLines: React.FC<ConnectorLinesProps> = ({ 
  containerRef, 
  connections, 
  elementRegistry,
  activeCardIndex 
}) => {
  const [pathsData, setPathsData] = useState<Array<{ d: string; color: string; pathLength: number; cardIndex?: number }>>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current) return;

      const newPathsData: Array<{ d: string; color: string; pathLength: number; cardIndex?: number }> = [];
      const container = containerRef.current;
      
      setDimensions({ width: container.offsetWidth, height: container.offsetHeight });

      connections.forEach(({ start, end, color, cardIndex }) => {
        const startEl = elementRegistry.get(start);
        const endEl = elementRegistry.get(end);

        if (startEl && endEl) {
          const startPos = getRelativePos(startEl, container);
          const endPos = getRelativePos(endEl, container);

          // We want lines to exit from the bottom of start and enter top of end
          const startX = startPos.x;
          const startY = startPos.bottom; 
          const endX = endPos.x;
          const endY = endPos.top;

          // Stepped path with rounded corners
          // Determine where the horizontal branch occurs
          let breakY;
          if (start === 'top-node') {
            breakY = startY + (endY - startY) * 0.35; // Branch out earlier for top nodes
          } else if (end === 'bottom-node') {
            breakY = endY - (endY - startY) * 0.35;   // Merge later for bottom nodes
          } else {
            breakY = (startY + endY) / 2;
          }

          const radius = 24;
          const direction = endX > startX ? 1 : -1;
          const absDiffX = Math.abs(endX - startX);
          
          let path = "";
          
          if (absDiffX < 10) {
            // Nearly vertical - simple straight line
            path = `M ${startX} ${startY} L ${endX} ${endY}`;
          } else {
            // Stepped path with two rounded corners
            // 1. Vertical from start to break point
            // 2. Corner to horizontal
            // 3. Horizontal to end X
            // 4. Corner to vertical
            // 5. Vertical to end
            
            const actualRadius = Math.min(radius, absDiffX / 2, Math.abs(breakY - startY), Math.abs(endY - breakY));
            
            path = `
              M ${startX} ${startY}
              L ${startX} ${breakY - actualRadius}
              Q ${startX} ${breakY} ${startX + direction * actualRadius} ${breakY}
              L ${endX - direction * actualRadius} ${breakY}
              Q ${endX} ${breakY} ${endX} ${breakY + actualRadius}
              L ${endX} ${endY}
            `.replace(/\s+/g, ' ').trim();
          }

          // Calculate approximate path length for animation timing
          const pathLength = Math.abs(endY - startY) + absDiffX;
          newPathsData.push({ d: path, color: color || '#94a3b8', pathLength, cardIndex });
        }
      });

      setPathsData(newPathsData);
      
      // Trigger flowing animation after initial draw
      setTimeout(() => setIsAnimated(true), 2000);
    };

    // Initial calculation
    // Small timeout to ensure layout is settled
    const timer = setTimeout(updatePaths, 100);

    // Resize observer to handle window changes
    const resizeObserver = new ResizeObserver(() => {
       updatePaths();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updatePaths);

    return () => {
      window.removeEventListener('resize', updatePaths);
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [containerRef, connections, elementRegistry]);

  return (
    <>
      {/* Inject animation styles */}
      <style>{flowingAnimationStyles}</style>
      
      <svg 
        className="absolute inset-0 pointer-events-none z-0"
        width={dimensions.width}
        height={dimensions.height}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Define glow filters for each color */}
          {pathsData.map((pathData, i) => (
            <React.Fragment key={`defs-${i}`}>
              <filter id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id={`glow-highlight-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>
        
        {pathsData.map((pathData, i) => {
          const isActive = pathData.cardIndex !== undefined && pathData.cardIndex === activeCardIndex;
          
          return (
            <g key={i}>
              {/* Background static dashed line */}
              <motion.path
                d={pathData.d}
                fill="none"
                stroke={pathData.color}
                strokeWidth={isActive ? "2" : "1.5"}
                strokeDasharray="8 8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isActive ? 0.6 : 0.3,
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut",
                  delay: 0.5 + (i * 0.1)
                }}
              />
              
              {/* Animated flowing particles overlay */}
              {isAnimated && (
                <path
                  d={pathData.d}
                  fill="none"
                  stroke={pathData.color}
                  strokeWidth={isActive ? "3" : "2"}
                  strokeDasharray="4 20"
                  strokeLinecap="round"
                  className="connector-line-flowing"
                  style={{
                    opacity: isActive ? 1 : 0.9,
                    filter: isActive ? `url(#glow-highlight-${i})` : `url(#glow-${i})`
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </>
  );
};
