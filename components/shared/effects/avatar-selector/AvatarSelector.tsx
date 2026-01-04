"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useAvatarContext, AnimationType, ANIMATIONS } from '../../avatar-context/AvatarContext';

interface AvatarSelectorProps {
  size?: string;
  className?: string;
}

// Helper functions for animations
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const GLOBAL_SPEED = 0.5;
const MONOCHROME_FILL = (opacity: number) =>
  `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
const MONOCHROME_STROKE = (opacity: number) =>
  `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;

// Eye Component
function EyeAnimation({ size }: { size: number }) {
  const ballRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLSpanElement>(null);

  const updateEyePosition = useCallback((e: PointerEvent | MouseEvent) => {
    const ball = ballRef.current;
    const iris = irisRef.current;
    if (!ball || !iris) return;

    const rect = ball.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    
    const maxRadius = rect.width * 0.2;
    const clampedDistance = Math.min(distance, maxRadius * 5);
    const movementRatio = clampedDistance / (maxRadius * 5);
    const moveX = Math.cos(angle) * maxRadius * movementRatio;
    const moveY = Math.sin(angle) * maxRadius * movementRatio;
    const scaleY = 1 - (movementRatio * 0.1);
    
    iris.style.transform = `translate(${moveX}px, ${moveY}px) scaleY(${scaleY})`;
  }, []);

  useEffect(() => {
    const iris = irisRef.current;
    if (iris) {
      iris.style.transform = 'translate(0px, 0px) scaleY(1)';
    }

    window.addEventListener('pointermove', updateEyePosition, { passive: true });
    
    return () => {
      window.removeEventListener('pointermove', updateEyePosition);
    };
  }, [updateEyePosition]);

  return (
    <div 
      className="eye-stage"
      style={{ width: size, height: size }}
    >
      <div ref={ballRef} className="eye-ball">
        <span ref={irisRef} className="eye-iris"></span>
      </div>

      <style jsx>{`
        .eye-stage {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .eye-ball {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          margin: 0;
          border-radius: 50%;
          position: relative;
          background: radial-gradient(
            circle at 50% 40%,
            #fcfcfc,
            #efeff1 66%,
            #9b5050 100%
          );
          box-shadow: 
            0 0 40px rgba(155, 80, 80, 0.3),
            0 0 80px rgba(155, 80, 80, 0.15),
            inset 0 -10px 30px rgba(0, 0, 0, 0.1);
        }

        .eye-ball::after {
          content: "";
          position: absolute;
          top: 5%;
          left: 10%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.6) 14%,
            rgba(255, 255, 255, 0) 24%
          );
          transform: translateX(-27%) translateY(-30%) skewX(-20deg);
          pointer-events: none;
        }

        .eye-iris {
          width: 40%;
          height: 40%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            #ff4500 0%,
            #ff6b35 30%,
            #cc3700 100%
          );
          position: relative;
          transition: transform 0.05s ease-out;
          box-shadow: 
            inset 0 0 20px rgba(0, 0, 0, 0.3),
            0 0 15px rgba(255, 69, 0, 0.4);
        }

        .eye-iris::before {
          content: "";
          display: block;
          position: absolute;
          width: 37.5%;
          height: 37.5%;
          border-radius: 50%;
          top: 31.25%;
          left: 31.25%;
          background: radial-gradient(
            circle at 30% 30%,
            #1a1a1a,
            #000000
          );
          box-shadow: 
            0 0 10px rgba(0, 0, 0, 0.5),
            inset 0 0 5px rgba(255, 255, 255, 0.1);
        }

        .eye-iris::after {
          content: "";
          display: block;
          position: absolute;
          width: 12%;
          height: 12%;
          border-radius: 50%;
          top: 35%;
          left: 38%;
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}

// Canvas Animation Component
function CanvasAnimation({ type, size }: { type: AnimationType; size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let lastTime = 0;

    const centerX = size / 2;
    const centerY = size / 2;

    // Animation data structures
    let dots: { x: number; y: number; z: number; angle?: number; r?: number; lastSeen?: number }[] = [];
    let ringData: { r: number; angle: number; lastSeen: number }[] = [];
    let helixDots: { angle: number; y: number }[] = [];
    let dotRings = [
      { radius: 20, count: 12 },
      { radius: 45, count: 24 },
      { radius: 70, count: 36 },
    ];

    // Initialize based on animation type
    if (type === 'sphere-scan') {
      const numDots = 250;
      const radius = size * 0.4;
      for (let i = 0; i < numDots; i++) {
        const theta = Math.acos(1 - 2 * (i / numDots));
        const phi = Math.sqrt(numDots * Math.PI) * theta;
        dots.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(theta),
        });
      }
    } else if (type === 'crystalline-refraction') {
      const gridSize = 15;
      const spacing = size / (gridSize - 1);
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          dots.push({ x: c * spacing, y: r * spacing, z: 0 });
        }
      }
    } else if (type === 'sonar-sweep') {
      const fadeTime = 2500;
      for (let r = 20; r <= 80; r += 15) {
        for (let i = 0; i < r / 2; i++) {
          ringData.push({
            r,
            angle: (i / (r / 2)) * Math.PI * 2,
            lastSeen: -fadeTime,
          });
        }
      }
    } else if (type === 'helix-scanner') {
      const numDots = 100;
      const height = 120;
      for (let i = 0; i < numDots; i++) {
        helixDots.push({ angle: i * 0.3, y: (i / numDots) * height - height / 2 });
      }
    } else if (type === 'cylindrical-analysis') {
      // Data is computed inline
    } else if (type === 'voxel-matrix-morph') {
      const gridSize = 5;
      const spacing = 20;
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          for (let z = 0; z < gridSize; z++) {
            dots.push({
              x: (x - (gridSize - 1) / 2) * spacing,
              y: (y - (gridSize - 1) / 2) * spacing,
              z: (z - (gridSize - 1) / 2) * spacing,
            });
          }
        }
      }
    } else if (type === 'phased-array-emitter') {
      const ringRadii = [20, 40, 60, 80];
      const pointsPerRing = [12, 18, 24, 30];
      ringRadii.forEach((radius, i) => {
        for (let j = 0; j < pointsPerRing[i]; j++) {
          const angle = (j / pointsPerRing[i]) * Math.PI * 2;
          dots.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: 0,
          });
        }
      });
    } else if (type === 'crystalline-cube-refraction') {
      const gridSize = 7;
      const spacing = 15;
      const cubeHalfSize = ((gridSize - 1) * spacing) / 2;
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          for (let z = 0; z < gridSize; z++) {
            dots.push({
              x: x * spacing - cubeHalfSize,
              y: y * spacing - cubeHalfSize,
              z: z * spacing - cubeHalfSize,
            });
          }
        }
      }
    }

    function animate(timestamp: number) {
      if (!ctx) return;
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, size, size);

      if (type === 'sphere-scan') {
        time += deltaTime * 0.0005 * GLOBAL_SPEED;
        const radius = size * 0.4;
        const rotX = Math.sin(time * 0.3) * 0.5;
        const rotY = time * 0.5;
        const easedTime = easeInOutCubic((Math.sin(time * 2.5) + 1) / 2);
        const scanLine = (easedTime * 2 - 1) * radius;
        const scanWidth = 25;

        dots.forEach((dot) => {
          let { x, y, z } = dot;
          let nX = x * Math.cos(rotY) - z * Math.sin(rotY);
          let nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
          x = nX;
          z = nZ;
          let nY = y * Math.cos(rotX) - z * Math.sin(rotX);
          nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
          y = nY;
          z = nZ;
          const scale = (z + radius * 1.5) / (radius * 2.5);
          const pX = centerX + x;
          const pY = centerY + y;
          const distToScan = Math.abs(y - scanLine);
          const scanInfluence = distToScan < scanWidth
            ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
            : 0;
          const dotSize = Math.max(0, scale * 2.0 + scanInfluence * 2.5);
          const opacity = Math.max(0, scale * 0.6 + scanInfluence * 0.4);
          ctx.beginPath();
          ctx.arc(pX, pY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      } else if (type === 'crystalline-refraction') {
        time += deltaTime * 0.16 * GLOBAL_SPEED;
        const waveRadius = time % (size * 1.2);
        const waveWidth = 60;

        dots.forEach((dot) => {
          const dist = Math.hypot(dot.x - centerX, dot.y - centerY);
          const distToWave = Math.abs(dist - waveRadius);
          let displacement = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (distToWave / (waveWidth / 2)) * Math.PI;
            displacement = easeInOutCubic(Math.sin(wavePhase)) * 10;
          }
          const angleToCenter = Math.atan2(dot.y - centerY, dot.x - centerX);
          const dx = Math.cos(angleToCenter) * displacement;
          const dy = Math.sin(angleToCenter) * displacement;
          const opacity = 0.2 + (Math.abs(displacement) / 10) * 0.8;
          const dotSize = 1.2 + (Math.abs(displacement) / 10) * 2;
          ctx.beginPath();
          ctx.arc(dot.x + dx, dot.y + dy, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      } else if (type === 'sonar-sweep') {
        time = timestamp;
        const fadeTime = 2500;
        const scanAngle = (time * 0.001 * (Math.PI / 2) * GLOBAL_SPEED) % (Math.PI * 2);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + 85 * Math.cos(scanAngle), centerY + 85 * Math.sin(scanAngle));
        ctx.strokeStyle = MONOCHROME_STROKE(0.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        ringData.forEach((dot) => {
          let angleDiff = Math.abs(dot.angle - scanAngle);
          if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
          if (angleDiff < 0.05) dot.lastSeen = time;
          const timeSinceSeen = time - dot.lastSeen;
          if (timeSinceSeen < fadeTime) {
            const t = timeSinceSeen / fadeTime;
            const opacity = 1 - easeInOutCubic(t);
            const dotSize = 1 + opacity * 1.5;
            const x = centerX + dot.r * Math.cos(dot.angle);
            const y = centerY + dot.r * Math.sin(dot.angle);
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(opacity);
            ctx.fill();
          }
        });
      } else if (type === 'helix-scanner') {
        time += deltaTime * 0.001 * GLOBAL_SPEED;
        const radius = 35;
        const height = 120;
        const loopDuration = 8;
        const seamlessProgress = Math.sin((time / loopDuration) * Math.PI * 2);
        const scanY = seamlessProgress * (height / 2);
        const scanWidth = 25;
        const trailLength = height * 0.3;

        helixDots.forEach((dot) => {
          const rotation = time;
          const x = radius * Math.cos(dot.angle + rotation);
          const z = radius * Math.sin(dot.angle + rotation);
          const pX = centerX + x;
          const pY = centerY + dot.y;
          const scale = (z + radius) / (radius * 2);
          const distToScan = Math.abs(dot.y - scanY);
          const leadingEdgeInfluence = distToScan < scanWidth
            ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
            : 0;
          let trailInfluence = 0;
          const distBehindScan = dot.y - scanY;
          const isMovingUp = Math.cos((time / loopDuration) * Math.PI * 2) > 0;
          if (isMovingUp && distBehindScan < 0 && Math.abs(distBehindScan) < trailLength) {
            trailInfluence = Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
          } else if (!isMovingUp && distBehindScan > 0 && Math.abs(distBehindScan) < trailLength) {
            trailInfluence = Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
          }
          const totalInfluence = Math.max(leadingEdgeInfluence, trailInfluence);
          const dotSize = Math.max(0, scale * 1.8 + totalInfluence * 2.8);
          const opacity = Math.max(0, scale * 0.4 + totalInfluence * 0.6);
          ctx.beginPath();
          ctx.arc(pX, pY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      } else if (type === 'interconnecting-waves') {
        time += deltaTime * 0.001 * GLOBAL_SPEED;

        dotRings.forEach((ring, ringIndex) => {
          if (ringIndex >= dotRings.length - 1) return;
          const nextRing = dotRings[ringIndex + 1];
          for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse1 = Math.sin(time * 2 - ringIndex * 0.4) * 3;
            const x1 = centerX + Math.cos(angle) * (ring.radius + radiusPulse1);
            const y1 = centerY + Math.sin(angle) * (ring.radius + radiusPulse1);
            const nextRingRatio = nextRing.count / ring.count;
            for (let j = 0; j < nextRingRatio; j++) {
              const nextAngle = ((i * nextRingRatio + j) / nextRing.count) * Math.PI * 2;
              const radiusPulse2 = Math.sin(time * 2 - (ringIndex + 1) * 0.4) * 3;
              const x2 = centerX + Math.cos(nextAngle) * (nextRing.radius + radiusPulse2);
              const y2 = centerY + Math.sin(nextAngle) * (nextRing.radius + radiusPulse2);
              const lineOpacity = 0.1 + ((Math.sin(time * 3 - ringIndex * 0.5 + i * 0.3) + 1) / 2) * 0.4;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineWidth = 0.75;
              ctx.strokeStyle = MONOCHROME_STROKE(lineOpacity);
              ctx.stroke();
            }
          }
        });

        dotRings.forEach((ring, ringIndex) => {
          for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
            const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
            const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
            const dotOpacity = 0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(dotOpacity);
            ctx.fill();
          }
        });
      } else if (type === 'cylindrical-analysis') {
        time += deltaTime * 0.001 * GLOBAL_SPEED;
        const radius = 60;
        const height = 100;
        const numLayers = 15;
        const dotsPerLayer = 25;
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanY = centerY + (easedTime * 2 - 1) * (height / 2);
        const scanWidth = 15;

        for (let i = 0; i < numLayers; i++) {
          const layerY = centerY + (i / (numLayers - 1) - 0.5) * height;
          const rot = time * (0.2 + (i % 2) * 0.1);
          for (let j = 0; j < dotsPerLayer; j++) {
            const angle = (j / dotsPerLayer) * Math.PI * 2 + rot;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const scale = (z + radius) / (radius * 2);
            const pX = centerX + x * scale;
            const pY = layerY;
            const distToScan = Math.abs(pY - scanY);
            const scanInfluence = distToScan < scanWidth
              ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
              : 0;
            const dotSize = Math.max(0, scale * 1.5 + scanInfluence * 2);
            const opacity = Math.max(0, scale * 0.5 + scanInfluence * 0.5);
            ctx.beginPath();
            ctx.arc(pX, pY, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(opacity);
            ctx.fill();
          }
        }
      } else if (type === 'voxel-matrix-morph') {
        time += deltaTime * 0.0005 * GLOBAL_SPEED;
        const rotX = time * 0.4;
        const rotY = time * 0.6;
        const gridSize = 5;
        const spacing = 20;
        const totalSize = (gridSize - 1) * spacing;
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanLine = (easedTime * 2 - 1) * (totalSize / 2 + 10);
        const scanWidth = 30;

        dots.forEach((p) => {
          let { x, y, z } = p;
          let nX = x * Math.cos(rotY) - z * Math.sin(rotY);
          let nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
          x = nX;
          z = nZ;
          let nY = y * Math.cos(rotX) - z * Math.sin(rotX);
          nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
          y = nY;
          z = nZ;
          const distToScan = Math.abs(y - scanLine);
          let scanInfluence = 0;
          let displacement = 1;
          if (distToScan < scanWidth) {
            scanInfluence = Math.cos((distToScan / scanWidth) * (Math.PI / 2));
            displacement = 1 + scanInfluence * 0.4;
          }
          const scale = (z + 80) / 160;
          const pX = centerX + x * displacement;
          const pY = centerY + y * displacement;
          const dotSize = Math.max(0, scale * 2 + scanInfluence * 2);
          const opacity = Math.max(0.1, scale * 0.7 + scanInfluence * 0.3);
          ctx.beginPath();
          ctx.arc(pX, pY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      } else if (type === 'phased-array-emitter') {
        time += deltaTime * 0.001 * GLOBAL_SPEED;
        const fov = 300;
        const rotX = 1.0;
        const rotY = time * 0.2;
        const maxRadius = 80;
        const waveRadius = (time * 120) % (maxRadius * 1.8);
        const waveWidth = 50;
        const waveHeight = 18;
        const pointsToDraw: { x: number; y: number; z: number; size: number; opacity: number }[] = [];

        dots.forEach((p_orig) => {
          let { x, y, z } = p_orig;
          const distFromCenter = Math.hypot(x, y);
          const distToWave = Math.abs(distFromCenter - waveRadius);
          let waveInfluence = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (1 - distToWave / (waveWidth / 2)) * Math.PI;
            z = easeInOutCubic(Math.sin(wavePhase)) * waveHeight;
            waveInfluence = z / waveHeight;
          }
          const cY = Math.cos(rotY);
          const sY = Math.sin(rotY);
          let tX = x * cY - z * sY;
          let tZ = x * sY + z * cY;
          x = tX;
          z = tZ;
          const cX = Math.cos(rotX);
          const sX = Math.sin(rotX);
          let tY = y * cX - z * sX;
          tZ = y * sX + z * cX;
          y = tY;
          z = tZ;
          const scale = fov / (fov + z + 100);
          const pX = centerX + x * scale;
          const pY = centerY + y * scale;
          const dotSize = (1.5 + waveInfluence * 2.5) * scale;
          const opacity = 0.4 + waveInfluence * 0.6;
          pointsToDraw.push({ x: pX, y: pY, z, size: dotSize, opacity });
        });

        pointsToDraw
          .sort((a, b) => a.z - b.z)
          .forEach((p) => {
            if (p.size < 0.1) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
          });
      } else if (type === 'crystalline-cube-refraction') {
        time += deltaTime * 0.0003 * GLOBAL_SPEED;
        const fov = 250;
        const gridSize = 7;
        const spacing = 15;
        const cubeHalfSize = ((gridSize - 1) * spacing) / 2;
        const maxDist = Math.hypot(cubeHalfSize, cubeHalfSize, cubeHalfSize);
        const rotX = time * 2;
        const rotY = time * 3;
        const waveRadius = (timestamp * 0.04 * GLOBAL_SPEED) % (maxDist * 1.5);
        const waveWidth = 40;
        const displacementMagnitude = 10;
        const pointsToDraw: { x: number; y: number; z: number; size: number; opacity: number }[] = [];

        dots.forEach((p_orig) => {
          let { x, y, z } = p_orig;
          const distFromCenter = Math.hypot(x, y, z);
          const distToWave = Math.abs(distFromCenter - waveRadius);
          let displacementAmount = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (distToWave / (waveWidth / 2)) * (Math.PI / 2);
            displacementAmount = easeInOutCubic(Math.cos(wavePhase)) * displacementMagnitude;
          }
          if (displacementAmount > 0 && distFromCenter > 0) {
            const ratio = (distFromCenter + displacementAmount) / distFromCenter;
            x *= ratio;
            y *= ratio;
            z *= ratio;
          }
          const cY = Math.cos(rotY);
          const sY = Math.sin(rotY);
          let tX = x * cY - z * sY;
          let tZ = x * sY + z * cY;
          x = tX;
          z = tZ;
          const cX = Math.cos(rotX);
          const sX = Math.sin(rotX);
          let tY = y * cX - z * sX;
          tZ = y * sX + z * cX;
          y = tY;
          z = tZ;
          const scale = fov / (fov + z);
          const pX = centerX + x * scale;
          const pY = centerY + y * scale;
          const waveInfluence = displacementAmount / displacementMagnitude;
          const dotSize = (1.5 + waveInfluence * 2.5) * scale;
          const opacity = Math.max(0.1, scale * 0.7 + waveInfluence * 0.4);
          if (dotSize > 0.1) pointsToDraw.push({ x: pX, y: pY, z, size: dotSize, opacity });
        });

        pointsToDraw
          .sort((a, b) => a.z - b.z)
          .forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
          });
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, size]);

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 50% 40%, #1a1a1a, #0a0a0a 66%, #0f0f0f 100%)',
        boxShadow: 'inset 0 -10px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
    </div>
  );
}

export default function AvatarSelector({ size = "180px", className = "" }: AvatarSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const sizeNum = parseInt(size);
  
  // Try to use context, fallback to default if not available
  let currentAnimation: AnimationType = 'sphere-scan';
  try {
    const context = useAvatarContext();
    currentAnimation = context.currentAnimation;
  } catch {
    // Context not available, use default
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="relative transition-all duration-500"
        style={{ width: size, height: size }}
      >
        {currentAnimation === 'eye' ? (
          <EyeAnimation size={sizeNum} />
        ) : (
          <CanvasAnimation type={currentAnimation} size={sizeNum} />
        )}
      </div>
    </div>
  );
}
