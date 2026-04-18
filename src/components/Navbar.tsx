import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut, MessageSquare, Users, Search } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 transition-all hover:scale-105">
            <span className="text-secondary-400">回音</span>
            <span className="text-white">AI导航</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/navigate" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">导航</Link>
            <Link to="/tutorials" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">教程</Link>
            <Link to="/resources" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">资源工具</Link>
            {user && (
              <>
                <Link to="/social" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">社交</Link>
                <Link to="/profile" className="font-medium hover:text-secondary-400 transition-all duration-300 hover:translate-y-[-2px]">个人中心</Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-700 hover:bg-primary-600 transition-all duration-300 hover:shadow-lg"
                >
                  <LogOut size={16} />
                  <span>退出</span>
                </button>
              </>
            )}
            {!user && (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500 hover:bg-secondary-600 transition-all duration-300 hover:shadow-lg"
              >
                <LogIn size={16} />
                <span>登录</span>
              </Link>
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
                导航
              </Link>
              <Link 
                to="/tutorials" 
                className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                教程
              </Link>
              <Link 
                to="/resources" 
                className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                资源工具
              </Link>
              {user && (
                <>
                  <Link 
                    to="/social" 
                    className="px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    社交
                  </Link>
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