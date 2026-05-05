import React from 'react';
import { Tool } from '../../types';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  title?: string;
  showCount?: boolean;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  title,
  showCount = true
}) => {
  return (
    <div>
      {(title || showCount) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {showCount && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {tools.length} 个工具
            </span>
          )}
        </div>
      )}

      {tools.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            未找到工具
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            尝试更换搜索词或筛选条件
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
