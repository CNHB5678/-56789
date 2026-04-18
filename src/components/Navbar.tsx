import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, MessageSquare, Users, Search, Cpu } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-800 to-primary-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center gap-6">
          <Link to="/" className="text-2xl font-bold flex items-center gap-4 transition-all hover:scale-105">
            {/* LOGO图标 */}
            <div className="w-11 h-11 rounded-full bg-secondary-500 flex items-center justify-center">
              <Cpu size={26} />
            </div>
            <span className="text-white">瓦粒</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/navigate" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">网站导航</Link>
            <Link to="/tutorials" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">AI教程</Link>
            <Link to="/resources" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">实用工具</Link>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2.5 rounded-full bg-primary-700 border border-primary-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-300 w-72"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center">
            {!user && (
              <Link 
                to="/login" 
                className="p-3.5 rounded-full bg-secondary-500 hover:bg-secondary-600 transition-all duration-300 hover:shadow-lg"
                aria-label="登录"
              >
                <User size={22} />
              </Link>
            )}
            {user && (
              <button 
                onClick={handleLogout} 
                className="p-3.5 rounded-full bg-primary-700 hover:bg-primary-600 transition-all duration-300 hover:shadow-lg"
                aria-label="退出"
              >
                <User size={22} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-primary-700 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/navigate" 
                className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                网站导航
              </Link>
              <Link 
                to="/tutorials" 
                className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI教程
              </Link>
              <Link 
                to="/resources" 
                className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                实用工具
              </Link>
              {/* Mobile Search */}
              <div className="px-4 py-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-700 border border-primary-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary-700 hover:bg-primary-600 transition-colors w-full justify-start"
                  >
                    <LogOut size={16} />
                    <span>退出</span>
                  </button>
                </>
              )}
              {!user && (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary-500 hover:bg-secondary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={16} />
                  <span>登录</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;