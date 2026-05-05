import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Clock, User, Settings, ChevronRight } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { ToolGrid } from '../components/tool/ToolGrid';

export const UserCenter: React.FC = () => {
  const location = useLocation();
  const { favorites, history, getToolById, tools } = useToolStore();

  const favoriteTools = favorites.map((id) => getToolById(id)).filter(Boolean);
  const historyTools = history.map((id) => getToolById(id)).filter(Boolean);

  const isFavoritesPage = location.pathname === '/user/favorites';
  const isHistoryPage = location.pathname === '/user/history';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  U
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">用户</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">user@example.com</p>
              </div>

              {/* Menu */}
              <nav className="p-4 space-y-1">
                <Link
                  to="/user/favorites"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isFavoritesPage
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart size={20} />
                  <span className="font-medium">我的收藏</span>
                  {favorites.length > 0 && (
                    <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/user/history"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isHistoryPage
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Clock size={20} />
                  <span className="font-medium">浏览历史</span>
                  {history.length > 0 && (
                    <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {history.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isFavoritesPage && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      我的收藏
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      收藏的 AI 工具列表
                    </p>
                  </div>
                </div>

                {favoriteTools.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      还没有收藏
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      浏览工具并添加到收藏夹
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      浏览工具
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ) : (
                  <ToolGrid
                    tools={favoriteTools}
                    showCount={true}
                  />
                )}
              </div>
            )}

            {isHistoryPage && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      浏览历史
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      最近查看过的 AI 工具
                    </p>
                  </div>
                </div>

                {historyTools.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      没有浏览记录
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      开始浏览 AI 工具吧
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      浏览工具
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ) : (
                  <ToolGrid
                    tools={historyTools}
                    showCount={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
