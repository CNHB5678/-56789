import { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/stores';
import { ZoomIn, ZoomOut, GripVertical } from 'lucide-react';

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
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const getTrackTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'subtitle': return '📝';
      default: return '📦';
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seconds = (x / (100 * zoom));
    setPlayheadPosition(Math.max(0, seconds));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seconds = (x / (100 * zoom));
    setSelectionStart(Math.max(0, seconds));
    setSelectionEnd(Math.max(0, seconds));
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seconds = (x / (100 * zoom));
    setSelectionEnd(Math.max(0, seconds));
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setSelectedClipId(clipId);
  };

  const getSelectionRange = () => {
    if (selectionStart === null || selectionEnd === null) return { start: 0, end: 0, width: 0 };
    const start = Math.min(selectionStart, selectionEnd);
    const end = Math.max(selectionStart, selectionEnd);
    return { start, end, width: end - start };
  };

  const selection = getSelectionRange();

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

      <div className="flex flex-1 overflow-hidden">
        {/* Track labels */}
        <div className="w-24 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900">
          <div className="h-8" />
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="h-20 flex items-center px-2 text-xs border-b border-gray-200 dark:border-gray-700"
            >
              <span className="mr-1">{getTrackTypeIcon(track.type)}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                {track.name}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline area */}
        <div
          ref={timelineRef}
          className="flex-1 overflow-x-auto cursor-crosshair"
          onClick={handleTimelineClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="min-h-full" style={{ minWidth: `${100 * zoom * 60}px` }}>
            {/* Time ruler */}
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

            {/* Playhead */}
            <div
              className="absolute left-0 w-0.5 bg-red-500 z-20 pointer-events-none"
              style={{
                top: '32px',
                height: `${tracks.length * 80 + 8}px`,
                left: `${playheadPosition * 100 * zoom}px`,
              }}
            />

            {/* Selection frame */}
            {selectionStart !== null && selectionEnd !== null && selection.width > 0 && (
              <div
                className="absolute top-8 z-15 pointer-events-none bg-blue-500 bg-opacity-20 border border-blue-500"
                style={{
                  left: `${selection.start * 100 * zoom}px`,
                  width: `${selection.width * 100 * zoom}px`,
                  height: `${tracks.length * 80}px`,
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 cursor-w-resize flex items-center justify-center">
                  <GripVertical className="w-2 h-2 text-white" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500 cursor-e-resize flex items-center justify-center">
                  <GripVertical className="w-2 h-2 text-white" />
                </div>
              </div>
            )}

            {/* Tracks */}
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`relative ${
                  track.muted ? 'opacity-50' : ''
                } ${track.locked ? 'pointer-events-none' : ''}`}
                style={{ width: `${100 * zoom * 60}px` }}
              >
                {/* Track separator line */}
                <div className="absolute top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-700" />

                <div className={`h-20 ${track.visible ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'}`}>
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
    </div>
  );
}
