import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Tool } from '../../types';
import { Rating } from '../ui/Rating';
import { useToolStore } from '../../store/useToolStore';

interface ToolCardProps {
  tool: Tool;
}

const PricingBadge = ({ type }: { type: string }) => {
  const styles = {
    free: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    freemium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  };

  const labels = {
    free: '免费',
    freemium: '免费版',
    paid: '付费'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
      {labels[type as keyof typeof labels]}
    </span>
  );
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { toggleFavorite, favorites, addToHistory } = useToolStore();
  const isFavorite = favorites.includes(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  const handleCardClick = () => {
    addToHistory(tool.id);
  };

  return (
    <Link
      to={`/tool/${tool.id}`}
      onClick={handleCardClick}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=3b82f6&color=fff`;
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <PricingBadge type={tool.pricing.type} />
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Eye size={14} />
                  <span>{(tool.views / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-current' : ''}
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="px-2.5 py-1 text-gray-400 dark:text-gray-500 text-xs">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <Rating rating={tool.rating} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {tool.reviewCount} 评价
            </span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};
