import { useState } from 'react';
import { useEditorStore, useProjectStore } from '@/stores';
import Timeline from '@/components/editor/Timeline/Timeline';
import VideoPreview from '@/components/editor/Preview/VideoPreview';
import PropertyPanel from '@/components/editor/PropertyPanel/PropertyPanel';
import ExportPanel from '@/components/editor/ExportPanel';
import { Play, Pause, SkipBack, SkipForward, Volume2, Grid, Scissors, MousePointer, Move, Download, ZoomIn, ZoomOut } from 'lucide-react';

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
    timelineScale,
    setTimelineScale,
  } = useEditorStore();

  const { currentProject } = useProjectStore();
  const [showExportPanel, setShowExportPanel] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg gap-4">
        {/* 左侧工具 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <MousePointer className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTool('cut')}
            className={`p-2 rounded-lg transition-colors ${activeTool === 'cut' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Scissors className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTool('move')}
            className={`p-2 rounded-lg transition-colors ${activeTool === 'move' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Move className="w-5 h-5" />
          </button>
          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>

        {/* 中间播放控制 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlayheadPosition(0)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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

          <div className="text-sm text-gray-500 font-mono">
            {Math.floor(playheadPosition / 60)}:{String(Math.floor(playheadPosition % 60)).padStart(2, '0')}
          </div>
        </div>

        {/* 右侧功能 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportPanel(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            导出
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 编辑属性面板 - 左侧，更宽 */}
        <div className="w-96 flex-shrink-0">
          <PropertyPanel />
        </div>
        
        {/* 预览画面 - 右侧 */}
        <div className="flex-1 flex flex-col min-w-0">
          <VideoPreview />
        </div>
      </div>

      {/* 时间轴 */}
      <div className="h-64 mt-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">时间轴</div>
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={timelineScale}
              onChange={(e) => setTimelineScale(parseFloat(e.target.value))}
              className="w-24"
            />
            <ZoomIn className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 w-12">{timelineScale.toFixed(1)}x</span>
          </div>
        </div>
        <Timeline />
      </div>

      <ExportPanel 
        isOpen={showExportPanel} 
        onClose={() => setShowExportPanel(false)} 
      />
    </div>
  );
}
