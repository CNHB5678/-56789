import { useState } from 'react';
import { Settings, Database, Cpu, HardDrive, Globe, Palette } from 'lucide-react';

type SettingsTab = 'general' | 'ai' | 'storage' | 'network' | 'appearance';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs = [
    { id: 'general', label: '通用设置', icon: Settings },
    { id: 'ai', label: 'AI设置', icon: Cpu },
    { id: 'storage', label: '存储设置', icon: HardDrive },
    { id: 'network', label: '网络设置', icon: Globe },
    { id: 'appearance', label: '外观设置', icon: Palette },
  ] as const;

  return (
    <div className="h-full flex gap-6">
      <div className="w-64 flex flex-col gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
              ${activeTab === tab.id
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">通用设置</h2>

            <div>
              <label className="block text-sm font-medium mb-2">项目存储路径</label>
              <input
                type="text"
                defaultValue="~/lingjian-agent/projects"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">临时文件路径</label>
              <input
                type="text"
                defaultValue="~/lingjian-agent/temp"
                className="input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">自动保存</p>
                <p className="text-sm text-gray-500">每隔一段时间自动保存项目</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">自动保存间隔（分钟）</label>
              <input
                type="number"
                defaultValue={5}
                min={1}
                max={60}
                className="input w-32"
              />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">AI设置</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Whisper模型</label>
              <select className="input" defaultValue="base">
                <option value="tiny">Tiny (快速，低精度)</option>
                <option value="base">Base (平衡)</option>
                <option value="small">Small (较高精度)</option>
                <option value="medium">Medium (高精度)</option>
                <option value="large">Large (最高精度)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stable Diffusion API地址</label>
              <input
                type="text"
                defaultValue="http://localhost:7860"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">语义匹配阈值</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.6"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">值越高匹配越严格</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">默认图片风格</label>
              <select className="input" defaultValue="photorealistic">
                <option value="photorealistic">写实</option>
                <option value="anime">动漫</option>
                <option value="illustration">插画</option>
                <option value="oil_painting">油画</option>
                <option value="sketch">素描</option>
                <option value="3d">3D</option>
                <option value="ancient">古风</option>
                <option value="chinese">国风</option>
                <option value="sci-fi">科幻</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">存储设置</h2>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">已用空间</span>
                <span className="font-medium">2.5 GB / 100 GB</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div className="w-[2.5%] h-full bg-primary-500 rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">素材库位置</p>
                <p className="text-sm text-gray-500">~/lingjian-agent/media</p>
              </div>
              <button className="btn btn-ghost">更改</button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">清理缓存</p>
                <p className="text-sm text-gray-500">释放临时文件占用的空间</p>
              </div>
              <button className="btn btn-secondary">清理</button>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">网络设置</h2>

            <div>
              <label className="block text-sm font-medium mb-2">爬虫请求间隔（秒）</label>
              <input
                type="number"
                defaultValue={2}
                min={1}
                max={10}
                className="input w-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">最大并发下载数</label>
              <input
                type="number"
                defaultValue={3}
                min={1}
                max={10}
                className="input w-32"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">使用代理</p>
                <p className="text-sm text-gray-500">通过代理服务器爬取素材</p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">外观设置</h2>

            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <select className="input" defaultValue="system">
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="system">跟随系统</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">时间轴缩放</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                defaultValue="1"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">显示网格</p>
                <p className="text-sm text-gray-500">在预览窗口显示辅助网格</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <button className="btn btn-primary">保存设置</button>
        </div>
      </div>
    </div>
  );
}
