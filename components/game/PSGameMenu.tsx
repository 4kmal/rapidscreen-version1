"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import "@/styles/ps-menu.css";

interface GameTile {
  slug: string;
  title: string;
  cover?: string;
  icon?: React.ReactNode;
  core?: boolean;
}

const defaultTiles: GameTile[] = [
  {
    slug: "kracked-world",
    title: "Kracked World",
    cover: "/kd.jpg",
  },
  {
    slug: "bounty-board",
    title: "Bounty Board",
    icon: (
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M12,9L7,14H10V18H14V14H17L12,9Z" />
      </svg>
    ),
  },
  {
    slug: "dev-quest",
    title: "Dev Quest",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ed3.png",
  },
  {
    slug: "code-arena",
    title: "Code Arena",
    icon: (
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
      </svg>
    ),
  },
  {
    slug: "pixel-builder",
    title: "Pixel Builder",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3wk3.png",
  },
];

interface PSGameMenuProps {
  onGameSelect: (game: GameTile) => void;
  tiles?: GameTile[];
  // External D-pad navigation (increment counters to trigger)
  externalNavLeft?: number;
  externalNavRight?: number;
  externalSelect?: number;
}

export const PSGameMenu: React.FC<PSGameMenuProps> = ({
  onGameSelect,
  tiles = defaultTiles,
  externalNavLeft = 0,
  externalNavRight = 0,
  externalSelect = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStartup, setIsStartup] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const lastIndex = tiles.length - 1;

  // Calculate offset for tile list scrolling
  const offsetLeft = currentIndex > 0 ? { transform: `translateX(-${currentIndex * 52}px)` } : undefined;

  const tryUpdateIndex = useCallback((newIndex: number) => {
    if (newIndex <= 0) {
      setCurrentIndex(0);
    } else if (newIndex >= lastIndex) {
      setCurrentIndex(lastIndex);
    } else {
      setCurrentIndex(newIndex);
    }
  }, [lastIndex]);

  const handleGameLaunch = useCallback((game: GameTile) => {
    if (isLaunching) return; // Prevent double launch
    setIsStartup(false);
    setIsLaunching(true);
    
    setTimeout(() => {
      onGameSelect(game);
    }, 800);
  }, [onGameSelect, isLaunching]);

  // Handle external D-pad navigation (triggered by counter changes)
  const prevNavLeft = useRef(externalNavLeft);
  const prevNavRight = useRef(externalNavRight);
  const prevSelect = useRef(externalSelect);

  useEffect(() => {
    if (externalNavLeft > prevNavLeft.current) {
      tryUpdateIndex(currentIndex - 1);
    }
    prevNavLeft.current = externalNavLeft;
  }, [externalNavLeft, currentIndex, tryUpdateIndex]);

  useEffect(() => {
    if (externalNavRight > prevNavRight.current) {
      tryUpdateIndex(currentIndex + 1);
    }
    prevNavRight.current = externalNavRight;
  }, [externalNavRight, currentIndex, tryUpdateIndex]);

  useEffect(() => {
    if (externalSelect > prevSelect.current && !isLaunching) {
      handleGameLaunch(tiles[currentIndex]);
    }
    prevSelect.current = externalSelect;
  }, [externalSelect, currentIndex, tiles, isLaunching, handleGameLaunch]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key, shiftKey } = e;
    
    if (key === "ArrowLeft" || key === "a" || key === "A") {
      e.preventDefault();
      if (shiftKey) {
        tryUpdateIndex(0);
      } else {
        tryUpdateIndex(currentIndex - 1);
      }
    }
    
    if (key === "ArrowRight" || key === "d" || key === "D") {
      e.preventDefault();
      if (shiftKey) {
        tryUpdateIndex(lastIndex);
      } else {
        tryUpdateIndex(currentIndex + 1);
      }
    }

    if (key === "Enter" || key === " ") {
      e.preventDefault();
      handleGameLaunch(tiles[currentIndex]);
    }
  }, [currentIndex, lastIndex, tryUpdateIndex, tiles, handleGameLaunch]);

  // Focus the current tile without scrolling
  useEffect(() => {
    if (tileRefs.current[currentIndex]) {
      tileRefs.current[currentIndex]?.focus({ preventScroll: true });
    }
  }, [currentIndex]);

  // Initial startup animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tileRefs.current[0]) {
        tileRefs.current[0]?.focus({ preventScroll: true });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="ps-menu">
      <div 
        ref={containerRef}
        className={`ps-menu-container ${isStartup ? 'startup' : ''} ${isLaunching ? 'launch' : ''}`}
      >
        <ul className="ps-tile-list" style={offsetLeft}>
          {tiles.map((tile, index) => (
            <li key={tile.slug} className="ps-tile-list__item">
              <button
                ref={(el) => { tileRefs.current[index] = el; }}
                className={`ps-tile ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  handleGameLaunch(tile);
                }}
                onFocus={() => setCurrentIndex(index)}
              >
                <h1 className="ps-tile__title">
                  <span className={`ps-tile__title-reveal ${index === currentIndex ? 'ps-tile__title-reveal--revealed' : ''}`}>
                    {tile.title}
                  </span>
                </h1>
                <div 
                  className={`ps-tile__content ${tile.core ? 'ps-tile__content--core' : ''}`}
                  style={tile.cover ? { backgroundImage: `url(${tile.cover})` } : undefined}
                >
                  {tile.icon && !tile.cover && tile.icon}
                  {tile.cover && <img src={tile.cover} alt={tile.title} />}
                </div>
                <div className="ps-tile__action">Start</div>
              </button>
            </li>
          ))}
        </ul>
        
        <div className="ps-menu-hint">
          <span>← →</span> Navigate <span>ENTER</span> Select
        </div>
      </div>
    </div>
  );
};

export default PSGameMenu;

