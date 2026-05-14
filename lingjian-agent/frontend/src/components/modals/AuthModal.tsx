import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('请填写所有必填项');
      return;
    }

    if (mode === 'register' && !username.trim()) {
      toast.error('请输入用户名');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        id: Date.now().toString(),
        username: mode === 'register' ? username : email.split('@')[0],
        email: email,
        avatar: undefined,
      };

      setUser(mockUser);
      toast.success(mode === 'login' ? '登录成功！' : '注册成功！');
      onClose();
      resetForm();
    } catch (error) {
      toast.error(mode === 'login' ? '登录失败，请检查邮箱和密码' : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱 *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required={mode === 'login'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密码 *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required={mode === 'login'}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                忘记密码？
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : mode === 'login' ? (
                '登录'
              ) : (
                '注册'
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  resetForm();
                }}
                className="text-primary-600 hover:text-primary-700 font-medium ml-1"
              >
                {mode === 'login' ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
