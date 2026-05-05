import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Search, Grid, List } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { SearchBar } from '../components/search/SearchBar';
import { ToolGrid } from '../components/tool/ToolGrid';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const {
    categories,
    getToolsByCategory,
    setSearchQuery,
    setSelectedCategory,
    selectedCategory,
    getFilteredTools,
    toggleTag,
    selectedTags,
    tools,
    setSortBy,
    sortBy
  } = useToolStore();

  const category = categories.find((c) => c.id === categoryId);
  const categoryTools = getToolsByCategory(categoryId || '');

  const allTags = Array.from(new Set(tools.flatMap((t) => t.tags)));

  React.useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    return () => setSelectedCategory(null);
  }, [categoryId, setSelectedCategory]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            分类不存在
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

  const filteredTools = getFilteredTools();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {category.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {categoryTools.length} 个工具
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  筛选
                </h3>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  标签
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  排序
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'rating', label: '评分' },
                    { value: 'views', label: '浏览量' },
                    { value: 'date', label: '最新' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        sortBy === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar placeholder="搜索工具..." />
            </div>

            {/* Tools Grid */}
            <ToolGrid
              tools={filteredTools}
              showCount={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
