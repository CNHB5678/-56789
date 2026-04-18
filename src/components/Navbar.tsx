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
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-orange-400">回音</span>
            <span className="text-white">AI导航</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/navigate" className="hover:text-orange-400 transition-colors">导航</Link>
            <Link to="/tutorials" className="hover:text-orange-400 transition-colors">教程</Link>
            <Link to="/resources" className="hover:text-orange-400 transition-colors">资源工具</Link>
            {user && (
              <>
                <Link to="/social" className="hover:text-orange-400 transition-colors">社交</Link>
                <Link to="/profile" className="hover:text-orange-400 transition-colors">个人中心</Link>
                <button onClick={handleLogout} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <LogOut size={16} />
                  退出
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                <LogIn size={16} />
                登录
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-blue-600">
            <div className="flex flex-col space-y-4">
              <Link to="/navigate" className="hover:text-orange-400 transition-colors">导航</Link>
              <Link to="/tutorials" className="hover:text-orange-400 transition-colors">教程</Link>
              <Link to="/resources" className="hover:text-orange-400 transition-colors">资源工具</Link>
              {user && (
                <>
                  <Link to="/social" className="hover:text-orange-400 transition-colors">社交</Link>
                  <Link to="/profile" className="hover:text-orange-400 transition-colors">个人中心</Link>
                  <button onClick={handleLogout} className="hover:text-orange-400 transition-colors flex items-center gap-1">
                    <LogOut size={16} />
                    退出
                  </button>
                </>
              )}
              {!user && (
                <Link to="/login" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <LogIn size={16} />
                  登录
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