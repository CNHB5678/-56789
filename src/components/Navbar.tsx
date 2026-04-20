import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI资源导航
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            首页
          </Link>
          <Link to="/category/教程" className="text-gray-700 hover:text-blue-600 transition-colors">
            教程
          </Link>
          <Link to="/category/工具" className="text-gray-700 hover:text-blue-600 transition-colors">
            工具
          </Link>
          <Link to="/category/资讯" className="text-gray-700 hover:text-blue-600 transition-colors">
            资讯
          </Link>
          <Link to="/category/资源" className="text-gray-700 hover:text-blue-600 transition-colors">
            资源
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="搜索AI资源..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <User size={20} className="text-gray-600" />
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="搜索AI资源..."
                  className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                首页
              </Link>
              <Link to="/category/教程" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                教程
              </Link>
              <Link to="/category/工具" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                工具
              </Link>
              <Link to="/category/资讯" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                资讯
              </Link>
              <Link to="/category/资源" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                资源
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;