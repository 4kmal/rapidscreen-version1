"use client"

import React from 'react';
import CommunityMap from './CommunityMap';

interface KrackedDevCanvasProps {
  className?: string;
  onInteraction?: () => void;
}

const KrackedDevCanvas: React.FC<KrackedDevCanvasProps> = ({ className = '', onInteraction }) => {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onClick={onInteraction}
      onMouseMove={onInteraction}
    >
      <CommunityMap />
    </div>
  );
};

export default KrackedDevCanvas;
