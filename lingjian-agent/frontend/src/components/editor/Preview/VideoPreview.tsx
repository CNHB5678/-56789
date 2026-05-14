import { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/stores';

type GridType = 'horizontal' | 'vertical' | 'both';
type AspectRatio = '16:9' | '9:16';

interface VideoPreviewProps {
  gridType: GridType;
  aspectRatio: AspectRatio;
}

export default function VideoPreview({ gridType, aspectRatio }: VideoPreviewProps) {
  const { showGrid } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const aspectRatioClass = aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]';

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const gridLines = () => {
    const lines: JSX.Element[] = [];
    const { width, height } = dimensions;

    if (width === 0 || height === 0) return lines;

    if (gridType === 'horizontal') {
      lines.push(
        <line
          key="h-center"
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="white"
          strokeWidth="2"
          opacity="1"
        />
      );
    }
    
    if (gridType === 'vertical') {
      lines.push(
        <line
          key="v-center"
          x1={width / 2}
          y1="0"
          x2={width / 2}
          y2={height}
          stroke="white"
          strokeWidth="2"
          opacity="1"
        />
      );
    }

    if (gridType === 'both') {
      const gridSpacing = 60;
      for (let y = gridSpacing; y < height; y += gridSpacing) {
        lines.push(
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="white"
            strokeWidth="1.5"
            opacity="1"
          />
        );
      }
      for (let x = gridSpacing; x < width; x += gridSpacing) {
        lines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2={height}
            stroke="white"
            strokeWidth="1.5"
            opacity="1"
          />
        );
      }
    }
    
    return lines;
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div 
        ref={containerRef} 
        className={`${aspectRatioClass} w-full bg-black rounded-lg overflow-hidden relative`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>选择素材以预览</p>
          </div>
        </div>

        <video
          ref={videoRef}
          className="hidden"
          controls
        />

        {showGrid && dimensions.width > 0 && dimensions.height > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <svg 
              className="w-full h-full" 
              width={dimensions.width}
              height={dimensions.height}
            >
              {gridLines()}
            </svg>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2 text-white text-xs">
            <span>{aspectRatio === '16:9' ? '1920 x 1080' : '1080 x 1920'}</span>
            <span>•</span>
            <span>30 fps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
