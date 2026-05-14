import { useState } from 'react';
import { useEditorStore } from '@/stores';
import Timeline from '@/components/editor/Timeline/Timeline';
import VideoPreview from '@/components/editor/Preview/VideoPreview';
import PropertyPanel from '@/components/editor/PropertyPanel/PropertyPanel';
import ExportPanel from '@/components/editor/ExportPanel';
import { Play, Pause, SkipBack, SkipForward, Volume2, Grid, Scissors, MousePointer, Move, Download, ZoomIn, ZoomOut, ChevronDown, Monitor, Smartphone } from 'lucide-react';

type GridType = 'horizontal' | 'vertical' | 'both';
type AspectRatio = '16:9' | '9:16';

export default function EditorPage() {
  const {
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
    setPlayheadPosition,
    setGridSettings,
  } = useEditorStore();

  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showGridMenu, setShowGridMenu] = useState(false);
  const [gridType, setGridType] = useState<GridType>('both');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleGridTypeChange = (type: GridType) => {
    setGridType(type);
    setGridSettings({ 
      type: type === 'horizontal' ? 'lines' : type === 'vertical' ? 'lines' : 'lines' 
    });
    setShowGridMenu(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 - 更矮 */}
      <div className="flex items-center justify-between mb-3 px-2 py-1.5 bg-white dark:bg-gray-800 rounded-lg gap-2">
        {/* 左侧工具 */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'select' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('cut')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'cut' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Scissors className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('move')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'move' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
          >
            <Move className="w-4 h-4" />
          </button>
          
          {/* 网格按钮带下拉菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowGridMenu(!showGridMenu)}
              className={`p-1.5 rounded transition-colors flex items-center gap-1 ${showGrid ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showGridMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  toggleGrid();
                  setShowGridMenu(false);
                }}
                className="px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded whitespace-nowrap text-center"
              >
                {showGrid ? '隐藏网格' : '显示网格'}
              </button>
              <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
              <button
                onClick={() => handleGridTypeChange('horizontal')}
                className={`px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded whitespace-nowrap text-center ${gridType === 'horizontal' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : ''}`}
              >
                横线
              </button>
              <button
                onClick={() => handleGridTypeChange('vertical')}
                className={`px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded whitespace-nowrap text-center ${gridType === 'vertical' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : ''}`}
              >
                竖线
              </button>
              <button
                onClick={() => handleGridTypeChange('both')}
                className={`px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded whitespace-nowrap text-center ${gridType === 'both' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : ''}`}
              >
                网格线
              </button>
            </div>
          </div>
        )}
          </div>
        </div>

        {/* 中间播放控制 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPlayheadPosition(0)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <Volume2 className="w-3.5 h-3.5 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16"
            />
          </div>

          <div className="text-xs text-gray-500 font-mono w-10 text-center">
            {Math.floor(playheadPosition / 60)}:{String(Math.floor(playheadPosition % 60)).padStart(2, '0')}
          </div>
        </div>

        {/* 右侧功能 */}
        <div className="flex items-center gap-20">
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-2 py-1.5 flex items-center gap-1 ${aspectRatio === '16:9' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title="16:9"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-xs">16:9</span>
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-2 py-1.5 flex items-center gap-1 ${aspectRatio === '9:16' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title="9:16"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-xs">9:16</span>
            </button>
          </div>
          <button
            onClick={() => setShowExportPanel(true)}
            className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded flex items-center gap-1.5 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
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
          <VideoPreview gridType={gridType} aspectRatio={aspectRatio} />
        </div>
      </div>

      {/* 时间轴 */}
      <div className="h-64 mt-3">
        <Timeline timelineScale={timelineScale} setTimelineScale={setTimelineScale} />
      </div>

      <ExportPanel 
        isOpen={showExportPanel} 
        onClose={() => setShowExportPanel(false)} 
      />
    </div>
  );
}
