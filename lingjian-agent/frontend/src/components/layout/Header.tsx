import { useState } from 'react';
import { Search, Menu, Bell, User } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationPanel from './NotificationPanel';
import UserMenu from './UserMenu';
import AuthModal from '@/components/modals/AuthModal';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentProject } = useProjectStore();
  const { isAuthenticated } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <>
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden">
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索项目、素材..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg
                         text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentProject && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                {currentProject.name}
              </span>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
            >
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
            <UserMenu
              isOpen={showUserMenu}
              onClose={() => setShowUserMenu(false)}
              onLoginClick={() => setShowAuthModal(true)}
            />
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
