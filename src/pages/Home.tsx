import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { SearchBar } from '../components/search/SearchBar';
import { CategoryCard } from '../components/category/CategoryCard';
import { ToolCard } from '../components/tool/ToolCard';
import { ToolGrid } from '../components/tool/ToolGrid';

export const Home: React.FC = () => {
  const {
    categories,
    tools,
    topics,
    getFilteredTools,
    getToolsByIds,
  } = useToolStore();

  const filteredTools = getFilteredTools();
  const popularTools = [...tools].sort((a, b) => b.views - a.views).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
              <Sparkles size={18} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                发现最优质的 AI 工具
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              专业的 AI 工具导航平台
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                探索无限可能
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              精选全网最优质的 AI 工具，覆盖写作、设计、视频、编程等 9 大领域，助你提升效率
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar size="lg" />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{tools.length}+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">AI 工具</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{categories.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">分类</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{topics.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">专题</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                浏览分类
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                按领域快速找到适合你的 AI 工具
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                toolCount={tools.filter((t) => t.category === category.id).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                热门工具
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                最受用户欢迎的 AI 工具
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              查看全部
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                精选专题
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                精心策划的工具合集，满足你的各种需求
              </p>
            </div>
            <Link
              to="/topics"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              查看全部
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to="/topics"
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
              >
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.toolIds.length} 个工具
                    </span>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <span className="text-sm font-medium">查看</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            找到适合你的 AI 工具
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            立即开始探索，提升你的工作效率和创造力
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              开始探索
            </Link>
            <Link
              to="/topics"
              className="px-8 py-4 bg-blue-500/20 text-white rounded-xl font-semibold hover:bg-blue-500/30 transition-colors border border-white/20"
            >
              查看专题
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
