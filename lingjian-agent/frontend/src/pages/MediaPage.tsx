import { useState } from 'react';
import { Search, Filter, Grid, List, Upload, Image, Video, Music, FileCode, Download, Sparkles } from 'lucide-react';
import { useMediaStore } from '@/stores';
import { MediaType } from '@/types';
import toast from 'react-hot-toast';

const mediaTypeIcons: Record<MediaType, typeof Image> = {
  image: Image,
  video: Video,
  audio: Music,
  svg: FileCode,
};

const mediaTypeLabels: Record<MediaType, string> = {
  image: '图片',
  video: '视频',
  audio: '音频',
  svg: 'SVG',
};

export default function MediaPage() {
  const { mediaFiles, filters, setFilters } = useMediaStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const filteredMedia = mediaFiles.filter((media) => {
    if (filters.type !== 'all' && media.mediaType !== filters.type) return false;
    if (filters.source !== 'all' && media.source !== filters.source) return false;
    if (filters.searchQuery && !media.fileName.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleScrape = async () => {
    if (!filters.searchQuery) {
      toast.error('请先输入搜索关键词');
      return;
    }

    setIsScraping(true);
    try {
      toast.loading('正在爬取素材...', { id: 'scrape' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('素材爬取完成！', { id: 'scrape' });
    } catch (error) {
      toast.error('爬取失败', { id: 'scrape' });
    } finally {
      setIsScraping(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*,audio/*,.svg';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        toast.success(`已选择 ${files.length} 个文件`);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">素材库</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleUpload} className="btn btn-ghost">
            <Upload className="w-5 h-5" />
            上传素材
          </button>
          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="btn btn-secondary"
          >
            <Download className="w-5 h-5" />
            {isScraping ? '爬取中...' : '爬取素材'}
          </button>
          <button className="btn btn-primary">
            <Sparkles className="w-5 h-5" />
            AI生成
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索素材..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="input pl-10"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Filter className="w-5 h-5" />
          筛选
        </button>

        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">类型</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value as MediaType | 'all' })}
              className="input"
            >
              <option value="all">全部</option>
              <option value="image">图片</option>
              <option value="video">视频</option>
              <option value="audio">音频</option>
              <option value="svg">SVG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">来源</label>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ source: e.target.value as 'all' | 'scraped' | 'generated' | 'local' })}
              className="input"
            >
              <option value="all">全部</option>
              <option value="scraped">爬取</option>
              <option value="generated">AI生成</option>
              <option value="local">本地</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
            <Image className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">暂无素材</p>
            <p className="text-sm text-gray-500">上传或爬取素材以开始</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredMedia.map((media) => {
              const Icon = mediaTypeIcons[media.mediaType];
              return (
                <div
                  key={media.id}
                  className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all group relative"
                >
                  {media.thumbnail ? (
                    <img
                      src={media.thumbnail}
                      alt={media.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs truncate px-2">{media.fileName}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 text-xs bg-black/50 text-white rounded">
                      {mediaTypeLabels[media.mediaType]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((media) => {
              const Icon = mediaTypeIcons[media.mediaType];
              return (
                <div
                  key={media.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{media.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {mediaTypeLabels[media.mediaType]} · {media.format}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600">
                    {media.source === 'scraped' ? '爬取' : media.source === 'generated' ? 'AI生成' : '本地'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
