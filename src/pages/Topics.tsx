import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { ToolGrid } from '../components/tool/ToolGrid';

export const Topics: React.FC = () => {
  const { topics, tools, getToolsByIds } = useToolStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <Sparkles size={18} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                专题合集
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              精选专题
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              精心策划的 AI 工具合集，满足你的各种需求
            </p>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Zap size={16} />
                      <span>{topic.toolIds.length} 个工具</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {getToolsByIds(topic.toolIds).slice(0, 3).map((tool) => (
                      <div
                        key={tool.id}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
                      >
                        {tool.name}
                      </div>
                    ))}
                    {topic.toolIds.length > 3 && (
                      <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                        +{topic.toolIds.length - 3}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    查看全部工具
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  热门排行
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  最受欢迎的 AI 工具
                </p>
              </div>
            </div>
          </div>

          <ToolGrid
            tools={[...tools].sort((a, b) => b.views - a.views).slice(0, 6)}
            showCount={false}
          />
        </div>
      </section>
    </div>
  );
};
