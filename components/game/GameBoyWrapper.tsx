"use client";

import React, { ReactNode, useCallback, useState } from "react";
import "@/styles/gameboy.css";
import PS2StartupScreen from "./PS2StartupScreen";
import PSGameMenu from "./PSGameMenu";

// Screen states: menu -> startup -> game
type ScreenState = "menu" | "startup" | "game";

interface GameBoyWrapperProps {
  children?: ReactNode;
  onDpadUp?: () => void;
  onDpadDown?: () => void;
  onDpadLeft?: () => void;
  onDpadRight?: () => void;
  onDpadRelease?: () => void;
  onButtonA?: () => void;
  onButtonB?: () => void;
  onStart?: () => void;
  onSelect?: () => void;
  onInteraction?: () => void;
  scale?: number;
  hideControls?: boolean;
}

export const GameBoyWrapper: React.FC<GameBoyWrapperProps> = ({
  children,
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onDpadRelease,
  onButtonA,
  onButtonB,
  onStart,
  onSelect,
  onInteraction,
  scale = 0.55,
  hideControls = true,
}) => {
  const [screenState, setScreenState] = useState<ScreenState>("menu");
  
  // Menu navigation state (triggers for PSGameMenu)
  const [menuNavLeft, setMenuNavLeft] = useState(0);
  const [menuNavRight, setMenuNavRight] = useState(0);
  const [menuSelect, setMenuSelect] = useState(0);

  const handleStartupComplete = useCallback(() => {
    setScreenState("game");
  }, []);

  const handleGameSelect = useCallback(() => {
    // Game selected from menu, show PS2 startup
    setScreenState("startup");
  }, []);

  const handleStartClick = useCallback(() => {
    onInteraction?.();
    // START button pressed - if in menu, select current game; if in game, trigger onStart
    if (screenState === "menu") {
      setMenuSelect(prev => prev + 1);
    } else {
      onStart?.();
    }
  }, [onStart, screenState, onInteraction]);

  const handleButtonAClick = useCallback(() => {
    onInteraction?.();
    // A button - if in menu, select current game; if in game, trigger onButtonA
    if (screenState === "menu") {
      setMenuSelect(prev => prev + 1);
    } else {
      onButtonA?.();
    }
  }, [onButtonA, screenState, onInteraction]);

  const handleButtonBClick = useCallback(() => {
    onInteraction?.();
    onButtonB?.();
  }, [onButtonB, onInteraction]);

  const handleSelectClick = useCallback(() => {
    onInteraction?.();
    onSelect?.();
  }, [onSelect, onInteraction]);

  const handleDpadPress = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      onInteraction?.();
      if (screenState === "menu") {
        // Navigate menu with D-pad
        if (direction === "left") {
          setMenuNavLeft(prev => prev + 1);
        } else if (direction === "right") {
          setMenuNavRight(prev => prev + 1);
        }
      } else {
        // Pass to game
        switch (direction) {
          case "up":
            onDpadUp?.();
            break;
          case "down":
            onDpadDown?.();
            break;
          case "left":
            onDpadLeft?.();
            break;
          case "right":
            onDpadRight?.();
            break;
        }
      }
    },
    [onDpadUp, onDpadDown, onDpadLeft, onDpadRight, screenState, onInteraction]
  );

  const handleDpadRelease = useCallback(() => {
    if (screenState !== "menu") {
      onDpadRelease?.();
    }
  }, [onDpadRelease, screenState]);

  return (
    <div className="relative flex items-center justify-center">
      <div 
        className="gameboy-wrapper"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="gameboy">
          <div className="screen-area">
            <div className="power">
              <div className="indicator">
                <div className="led"></div>
                <span className="arc" style={{ zIndex: 2 }}></span>
                <span className="arc" style={{ zIndex: 1 }}></span>
                <span className="arc" style={{ zIndex: 0 }}></span>
              </div>
              POWER
            </div>

            {/* Game Screen - Children go here */}
            <div className="display overflow-hidden relative">
              {/* Actual Game - Always mounted but hidden until game state */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{ 
                  visibility: screenState === "game" ? "visible" : "hidden",
                  zIndex: screenState === "game" ? 1 : 0 
                }}
              >
                {children}
              </div>
              
              {/* PlayStation Game Menu */}
              {screenState === "menu" && (
                <PSGameMenu 
                  onGameSelect={handleGameSelect}
                  externalNavLeft={menuNavLeft}
                  externalNavRight={menuNavRight}
                  externalSelect={menuSelect}
                />
              )}
              
              {/* PS2 Startup Animation */}
              {screenState === "startup" && (
                <PS2StartupScreen onComplete={handleStartupComplete} />
              )}
            </div>

            <div className="label">
              <div className="title">KRACKED </div>
              <div className="subtitle">
                <span className="c">D</span>
                <span className="o1">E</span>
                <span className="l">V</span>
                <span className="o2">S</span>
              </div>
            </div>
          </div>

          <div className="nintendo">Kracked</div>

        <div className="controls">
          <div className="dpad">
            <div
              className="up"
              onMouseDown={() => handleDpadPress("up")}
              onMouseUp={handleDpadRelease}
              onMouseLeave={handleDpadRelease}
              onTouchStart={() => handleDpadPress("up")}
              onTouchEnd={handleDpadRelease}
            >
              <i></i>
            </div>
            <div
              className="right"
              onMouseDown={() => handleDpadPress("right")}
              onMouseUp={handleDpadRelease}
              onMouseLeave={handleDpadRelease}
              onTouchStart={() => handleDpadPress("right")}
              onTouchEnd={handleDpadRelease}
            >
              <i></i>
            </div>
            <div
              className="down"
              onMouseDown={() => handleDpadPress("down")}
              onMouseUp={handleDpadRelease}
              onMouseLeave={handleDpadRelease}
              onTouchStart={() => handleDpadPress("down")}
              onTouchEnd={handleDpadRelease}
            >
              <i></i>
            </div>
            <div
              className="left"
              onMouseDown={() => handleDpadPress("left")}
              onMouseUp={handleDpadRelease}
              onMouseLeave={handleDpadRelease}
              onTouchStart={() => handleDpadPress("left")}
              onTouchEnd={handleDpadRelease}
            >
              <i></i>
            </div>
            <div className="middle"></div>
          </div>
          <div className="a-b">
            <div className="b" onClick={handleButtonBClick}>
              B
            </div>
            <div className="a" onClick={handleButtonAClick}>
              A
            </div>
          </div>
        </div>

        <div className="start-select">
          <div className="select" onClick={handleSelectClick}>
            SELECT
          </div>
          <div className="start" onClick={handleStartClick}>
            START
          </div>
        </div>

        <div className="speaker">
          <div className="dot placeholder"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot placeholder"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot placeholder"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot placeholder"></div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default GameBoyWrapper;

