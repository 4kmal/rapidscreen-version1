"use client"

import React, { useEffect, useRef } from 'react';

interface DitheredVideoProps {
  className?: string;
}

const DitheredVideo: React.FC<DitheredVideoProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setDitherImageSizesToPixelRatio = () => {
      const ditherImages = document.querySelectorAll('.ditherImage');
      let size = 8 / window.devicePixelRatio;
      ditherImages.forEach(img => {
        img.setAttribute('width', String(size));
        img.setAttribute('height', String(size));
      });
    };

    setDitherImageSizesToPixelRatio();
    window.addEventListener("resize", setDitherImageSizesToPixelRatio);

    return () => {
      window.removeEventListener("resize", setDitherImageSizesToPixelRatio);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* SVG Filters */}
      <svg className="absolute h-0 w-0">
        <filter id="filter-peta-1" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feFlood floodColor="#DE8550" floodOpacity="1" x="0%" y="0%" result="flood"/>
          <feBlend mode="normal" x="0%" y="0%" in="SourceGraphic" in2="flood" result="blend1"/>
          <feImage 
            className="ditherImage" 
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA5ElEQVQYlQXBgQbCUABA0fdrk0ySSZJJkiRJMjOTTGZmkiRJZiYzyczMzGQmfdrtHPH7/TgcDuR5zna7pWka9vs9aZqyXq8R0+mU5/OJoihcLhfG4zFBENDtdjmdToj3+81yueTz+WCaJnEcM5/PKcsSXdcRsizjeR6j0YjH40Gr1cJxHAaDAbfbDVHXNbvdjiRJWK1WfL9fLMsiyzI2mw1CVVV836fT6XA8HplMJoRhSK/X43w+I6IoYjabURQFmqbxer1YLBZUVYVhGAhJkrBtm36/z/V6pd1u47ouw+GQ+/3OH4/Fn8FvF/NxAAAAAElFTkSuQmCC" 
            x="0" 
            y="0" 
            width="8" 
            height="8" 
            result="image1"
          />
          <feTile x="0" y="0" in="image1" result="tile"/>
          <feBlend mode="overlay" x="0%" y="0%" in="blend1" in2="tile" result="blend2"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1"/>
            <feFuncG type="discrete" tableValues="0 1"/>
            <feFuncB type="discrete" tableValues="0 1"/>
          </feComponentTransfer>
        </filter>
        <filter id="filter-peta-2" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feFlood floodColor="#000000" floodOpacity="0.50" x="0%" y="0%" result="flood"/>
          <feBlend mode="normal" x="0%" y="0%" in="SourceGraphic" in2="flood" result="blend1"/>
          <feImage 
            className="ditherImage" 
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA5ElEQVQYlQXBgQbCUABA0fdrk0ySSZJJkiRJMjOTTGZmkiRJZiYzyczMzGQmfdrtHPH7/TgcDuR5zna7pWka9vs9aZqyXq8R0+mU5/OJoihcLhfG4zFBENDtdjmdToj3+81yueTz+WCaJnEcM5/PKcsSXdcRsizjeR6j0YjH40Gr1cJxHAaDAbfbDVHXNbvdjiRJWK1WfL9fLMsiyzI2mw1CVVV836fT6XA8HplMJoRhSK/X43w+I6IoYjabURQFmqbxer1YLBZUVYVhGAhJkrBtm36/z/V6pd1u47ouw+GQ+/3OH4/Fn8FvF/NxAAAAAElFTkSuQmCC" 
            x="0" 
            y="0" 
            width="4" 
            height="4" 
            result="image1"
          />
          <feTile x="0" y="0" in="image1" result="tile"/>
          <feBlend mode="overlay" x="0%" y="0%" in="blend1" in2="tile" result="blend2"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1"/>
            <feFuncG type="discrete" tableValues="0 0.5 1"/>
            <feFuncB type="discrete" tableValues="0 1"/>
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Video Container */}
      <div className="flex w-full h-full">
        <video 
          className="w-1/2 h-full object-cover"
          style={{
            filter: 'url(#filter-peta-1)',
            imageRendering: 'pixelated'
          }}
          loop 
          autoPlay 
          muted 
          playsInline
          preload="metadata"
          poster="https://assets.codepen.io/108721/videoframe_0.png"
        >
          <source src="https://videos.pexels.com/video-files/2397239/2397239-sd_960_506_24fps.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
        <video 
          className="w-1/2 h-full object-cover"
          style={{
            filter: 'url(#filter-peta-2)',
            imageRendering: 'pixelated'
          }}
          loop 
          autoPlay 
          muted 
          playsInline
          preload="metadata"
          poster="https://assets.codepen.io/108721/videoframe_0+%281%29.png"
        >
          <source src="https://videos.pexels.com/video-files/14952031/14952031-sd_960_540_30fps.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay gradient for smooth integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-base/20 via-transparent to-background-base/20 pointer-events-none" />
    </div>
  );
};

export default DitheredVideo;

