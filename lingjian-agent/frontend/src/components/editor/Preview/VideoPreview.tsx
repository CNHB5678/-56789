import { useRef, useMemo } from 'react';
import { useEditorStore } from '@/stores';

type GridType = 'horizontal' | 'vertical' | 'both';

interface VideoPreviewProps {
  gridType: GridType;
}

export default function VideoPreview({ gridType }: VideoPreviewProps) {
  const { showGrid } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gridSpacing = 60;

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    
    if (gridType === 'horizontal' || gridType === 'both') {
      for (let y = gridSpacing; y < 1080; y += gridSpacing) {
        lines.push(
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="1920"
            y2={y}
            stroke="white"
            strokeWidth="1.5"
            opacity="1"
          />
        );
      }
    }
    
    if (gridType === 'vertical' || gridType === 'both') {
      for (let x = gridSpacing; x < 1920; x += gridSpacing) {
        lines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1080"
            stroke="white"
            strokeWidth="1.5"
            opacity="1"
          />
        );
      }
    }
    
    return lines;
  }, [gridType]);

  return (
    <div ref={containerRef} className="h-full bg-black rounded-lg overflow-hidden relative">
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

      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid meet"
          >
            {gridLines}
          </svg>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center gap-2 text-white text-xs">
          <span>1920 x 1080</span>
          <span>•</span>
          <span>30 fps</span>
        </div>
      </div>
    </div>
  );
}
