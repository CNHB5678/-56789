import { useRef, useEffect } from 'react';
import { useEditorStore } from '@/stores';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineProps {
  timelineScale: number;
  setTimelineScale: (scale: number) => void;
}

export default function Timeline({ timelineScale, setTimelineScale }: TimelineProps) {
  const {
    tracks,
    playheadPosition,
    selectedClipId,
    setSelectedClipId,
    setPlayheadPosition,
    zoom,
  } = useEditorStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seconds = (x / (100 * zoom));
    setPlayheadPosition(Math.max(0, seconds));
  };

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setSelectedClipId(clipId);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">时间轴</h3>
          <div className="flex items-center gap-1.5">
            <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={timelineScale}
              onChange={(e) => setTimelineScale(parseFloat(e.target.value))}
              className="w-20"
            />
            <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 w-10 text-center">{timelineScale.toFixed(1)}x</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {Math.floor(playheadPosition / 60)}:{String(Math.floor(playheadPosition % 60)).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div
        ref={timelineRef}
        className="flex-1 overflow-x-auto p-4 cursor-pointer"
        onClick={handleTimelineClick}
      >
        <div className="min-h-full" style={{ minWidth: `${100 * zoom * 60}px` }}>
          <div className="sticky top-0 flex border-b bg-gray-50 dark:bg-gray-700 z-10"
               style={{ width: `${100 * zoom * 60}px` }}>
            {Array.from({ length: Math.ceil(60 * zoom) }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 border-l px-1 text-xs text-gray-500"
                style={{ width: `${100 * zoom}px` }}
              >
                {i}s
              </div>
            ))}
          </div>

          <div
            className="absolute left-0 w-0.5 bg-red-500 z-20 pointer-events-none"
            style={{
              top: '32px',
              height: `${tracks.length * 80 + 40}px`,
              left: `${playheadPosition * 100 * zoom}px`,
            }}
          />

          {tracks.map((track) => (
            <div
              key={track.id}
              className={`h-20 mb-2 rounded-lg relative ${
                track.muted ? 'opacity-50' : ''
              } ${track.locked ? 'pointer-events-none' : ''}`}
              style={{ width: `${100 * zoom * 60}px` }}
            >
              <div className="absolute left-0 -top-6 text-xs text-gray-500 w-24 truncate">
                {track.name}
              </div>

              <div className={`h-full rounded-lg ${track.visible ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'}`}>
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={(e) => handleClipClick(e, clip.id)}
                    className={`absolute top-1 bottom-1 rounded bg-primary-500 cursor-pointer transition-all
                      ${selectedClipId === clip.id ? 'ring-2 ring-yellow-400' : 'hover:ring-2 hover:ring-primary-300'}`}
                    style={{
                      left: `${clip.startTime * 100 * zoom}px`,
                      width: `${clip.duration * 100 * zoom}px`,
                    }}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs truncate px-2">
                      {clip.name || '片段'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
