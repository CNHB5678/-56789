import { useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function UserMenu({ isOpen, onClose, onLoginClick }: UserMenuProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      {isAuthenticated && user ? (
        <>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </h4>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                onClose();
                navigate('/settings');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">设置</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </>
      ) : (
        <div className="p-4">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            登录以同步您的项目
          </p>
          <button
            onClick={() => {
              onClose();
              onLoginClick();
            }}
            className="w-full btn btn-primary"
          >
            登录 / 注册
          </button>
        </div>
      )}
    </div>
  );
}
