import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                汽水AI导航
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              专业的 AI 工具导航平台，帮助你发现并使用最优质的人工智能工具。
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:contact@qishuiai.com"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
              快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  to="/topics"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  专题合集
                </Link>
              </li>
              <li>
                <Link
                  to="/user/favorites"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  我的收藏
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
              热门分类
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/writing"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  AI 写作
                </Link>
              </li>
              <li>
                <Link
                  to="/category/design"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  AI 设计
                </Link>
              </li>
              <li>
                <Link
                  to="/category/video"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  AI 视频
                </Link>
              </li>
              <li>
                <Link
                  to="/category/coding"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  AI 编程
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
              支持我们
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              如果你觉得我们的网站有用，欢迎分享给更多朋友！
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all text-sm font-medium">
              <Heart size={16} />
              支持我们
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © 2024 汽水AI导航. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
            >
              隐私政策
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
            >
              服务条款
            </Link>
            <Link
              to="/about"
              className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
            >
              关于我们
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
