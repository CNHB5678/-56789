import { useState } from 'react';
import { X, Download, Share2, Film, Image, Music, FileText, Check } from 'lucide-react';
import { useEditorStore, useProjectStore, useAuthStore } from '@/stores';
import toast from 'react-hot-toast';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'mp4' | 'webm' | 'mov'>('mp4');
  const [exportQuality, setExportQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [shareTags, setShareTags] = useState('');
  
  const { currentProject } = useProjectStore();
  const { user, isAuthenticated } = useAuthStore();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`视频导出成功！格式: ${exportFormat.toUpperCase()}, 质量: ${exportQuality}`);
    } catch (error) {
      toast.error('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareToSquare = () => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    setShowShareModal(true);
  };

  const handlePublish = () => {
    if (!shareTitle.trim()) {
      toast.error('请输入作品标题');
      return;
    }

    toast.success('作品已发布到灵感广场！');
    setShowShareModal(false);
    setShareTitle('');
    setShareDescription('');
    setShareTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">导出与分享</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">导出设置</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  导出格式
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['mp4', 'webm', 'mov'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        exportFormat === format
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Film className="w-6 h-6" />
                        <span className="font-medium uppercase">{format}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  导出质量
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'low', label: '低', desc: '480p' },
                    { value: 'medium', label: '中', desc: '720p' },
                    { value: 'high', label: '高', desc: '1080p' },
                    { value: 'ultra', label: '超清', desc: '4K' },
                  ].map(quality => (
                    <button
                      key={quality.value}
                      onClick={() => setExportQuality(quality.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        exportQuality === quality.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{quality.label}</div>
                      <div className="text-sm text-gray-500">{quality.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  可导出内容
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: Film, label: '完整视频', selected: true },
                    { icon: Image, label: '缩略图', selected: true },
                    { icon: FileText, label: '字幕文件', selected: true },
                    { icon: Music, label: '音频文件', selected: false },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="flex-1 text-gray-700 dark:text-gray-300">{item.label}</span>
                      {item.selected ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-sm text-gray-400">未生成</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分享到灵感广场</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              将您的作品分享到灵感广场，让更多用户欣赏并获得反馈
            </p>
            <button
              onClick={handleShareToSquare}
              className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              发布到灵感广场
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                导出中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                导出视频
              </>
            )}
          </button>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" style={{ marginTop: '-2rem' }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">发布到灵感广场</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作品标题 *
                </label>
                <input
                  type="text"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  placeholder="给您的作品起个名字"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作品描述
                </label>
                <textarea
                  value={shareDescription}
                  onChange={(e) => setShareDescription(e.target.value)}
                  placeholder="介绍一下您的作品..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <input
                  type="text"
                  value={shareTags}
                  onChange={(e) => setShareTags(e.target.value)}
                  placeholder="添加标签，用逗号分隔"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 btn btn-primary"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
