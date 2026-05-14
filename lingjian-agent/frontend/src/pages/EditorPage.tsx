import { useEditorStore, useProjectStore } from '@/stores';
import Timeline from '@/components/editor/Timeline/Timeline';
import VideoPreview from '@/components/editor/Preview/VideoPreview';
import PropertyPanel from '@/components/editor/PropertyPanel/PropertyPanel';
import { Play, Pause, SkipBack, SkipForward, Volume2, Grid, Scissors, MousePointer, Move } from 'lucide-react';

export default function EditorPage() {
  const {
    tracks,
    playheadPosition,
    isPlaying,
    volume,
    showGrid,
    activeTool,
    setIsPlaying,
    setVolume,
    toggleGrid,
    setActiveTool,
  } = useEditorStore();

  const { currentProject } = useProjectStore();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-lg ${activeTool === 'select' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <MousePointer className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTool('cut')}
            className={`p-2 rounded-lg ${activeTool === 'cut' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Scissors className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTool('move')}
            className={`p-2 rounded-lg ${activeTool === 'move' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Move className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPlayheadPosition(0)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>

          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg ${showGrid ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {Math.floor(playheadPosition / 60)}:{String(Math.floor(playheadPosition % 60)).padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <VideoPreview />
        </div>
        <PropertyPanel />
      </div>

      <div className="h-64 mt-4">
        <Timeline />
      </div>
    </div>
  );
}
