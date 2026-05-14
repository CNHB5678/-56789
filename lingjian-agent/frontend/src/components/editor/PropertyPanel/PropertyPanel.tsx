import { useState } from 'react';
import { useEditorStore } from '@/stores';
import { Sliders, Type, Sparkles, Move, RotateCw } from 'lucide-react';

type Tab = 'clip' | 'text' | 'animation' | 'transform';

export default function PropertyPanel() {
  const { selectedClipId, tracks, updateClip } = useEditorStore();

  const selectedClip = tracks
    .flatMap(t => t.clips)
    .find(c => c.id === selectedClipId);

  const [activeTab, setActiveTab] = useState<Tab>('clip');

  if (!selectedClip) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          选择一个片段<br />
          <span className="text-sm">以编辑属性</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg flex flex-col">
      <div className="flex border-b">
        {[
          { id: 'clip', icon: Sliders, label: '片段' },
          { id: 'text', icon: Type, label: '文字' },
          { id: 'animation', icon: Sparkles, label: '动画' },
          { id: 'transform', icon: Move, label: '变换' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-2 flex flex-col items-center gap-1 text-xs
              ${activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'clip' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">名称</label>
              <input
                type="text"
                value={selectedClip.name || ''}
                onChange={(e) => updateClip(selectedClip.id, { name: e.target.value })}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">开始时间</label>
                <input
                  type="number"
                  value={selectedClip.startTime.toFixed(2)}
                  step="0.1"
                  onChange={(e) => updateClip(selectedClip.id, { startTime: parseFloat(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">结束时间</label>
                <input
                  type="number"
                  value={selectedClip.endTime.toFixed(2)}
                  step="0.1"
                  onChange={(e) => updateClip(selectedClip.id, { endTime: parseFloat(e.target.value) })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">音量</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={selectedClip.volume}
                onChange={(e) => updateClip(selectedClip.id, { volume: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(selectedClip.volume * 100)}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">不透明度</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedClip.opacity}
                onChange={(e) => updateClip(selectedClip.id, { opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(selectedClip.opacity * 100)}%</span>
            </div>
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">入场动画</label>
              <select className="input">
                <option value="">无</option>
                <option value="fade">淡入</option>
                <option value="slide">滑入</option>
                <option value="zoom">缩放</option>
                <option value="bounce">弹跳</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">出场动画</label>
              <select className="input">
                <option value="">无</option>
                <option value="fade">淡出</option>
                <option value="slide">滑出</option>
                <option value="zoom">缩放</option>
                <option value="bounce">弹跳</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">动画时长（秒）</label>
              <input type="number" defaultValue={0.5} step="0.1" className="input" />
            </div>
          </div>
        )}

        {activeTab === 'transform' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">X</label>
                <input
                  type="number"
                  value={selectedClip.position.x}
                  onChange={(e) => updateClip(selectedClip.id, {
                    position: { ...selectedClip.position, x: parseFloat(e.target.value) }
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Y</label>
                <input
                  type="number"
                  value={selectedClip.position.y}
                  onChange={(e) => updateClip(selectedClip.id, {
                    position: { ...selectedClip.position, y: parseFloat(e.target.value) }
                  })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">缩放 X</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedClip.scale.x}
                  onChange={(e) => updateClip(selectedClip.id, {
                    scale: { ...selectedClip.scale, x: parseFloat(e.target.value) }
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">缩放 Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedClip.scale.y}
                  onChange={(e) => updateClip(selectedClip.id, {
                    scale: { ...selectedClip.scale, y: parseFloat(e.target.value) }
                  })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <RotateCw className="w-4 h-4 inline mr-1" />
                旋转
              </label>
              <input
                type="number"
                value={selectedClip.rotation}
                onChange={(e) => updateClip(selectedClip.id, { rotation: parseFloat(e.target.value) })}
                className="input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
