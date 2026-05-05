import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Star,
  Eye,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { Rating } from '../components/ui/Rating';

export const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getToolById,
    tools,
    toggleFavorite,
    favorites,
    addToHistory,
    categories
  } = useToolStore();

  const tool = getToolById(id || '');

  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
    }
  }, [tool?.id, addToHistory]);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            工具不存在
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700"
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(tool.id);
  const category = categories.find((c) => c.id === tool.category);
  const relatedTools = tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const getPricingColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'freemium':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'paid':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getPricingLabel = (type: string) => {
    switch (type) {
      case 'free':
        return '免费';
      case 'freemium':
        return '免费版';
      case 'paid':
        return '付费';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          返回
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=3b82f6&color=fff&size=128`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {tool.name}
                      </h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPricingColor(tool.pricing.type)}`}>
                        {getPricingLabel(tool.pricing.type)}
                        {tool.pricing.price && ` • ${tool.pricing.price}`}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {tool.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({tool.reviewCount.toLocaleString()} 评价)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Eye size={18} />
                        <span>{(tool.views / 1000).toFixed(1)}k 浏览</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <ExternalLink size={18} />
                    访问官网
                  </a>
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                      isFavorite
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                    {isFavorite ? '已收藏' : '收藏'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                标签
              </h2>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                核心功能
              </h2>
              <ul className="space-y-3">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Info */}
            {category && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                  所属分类
                </h3>
                <Link
                  to={`/category/${category.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    {category.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {category.description}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  相关工具
                </h3>
                <div className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.id}
                      to={`/tool/${relatedTool.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={relatedTool.logo}
                          alt={relatedTool.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedTool.name)}&background=64748b&color=fff&size=48`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {relatedTool.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span>{relatedTool.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
