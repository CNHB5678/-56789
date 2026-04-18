import { useState } from 'react';
import { X, Mail, Phone, MessageSquare, Users, ChevronRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

type LoginMethod = 'email' | 'phone' | 'wechat' | 'qq';
type AuthMode = 'login' | 'register';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    code: '',
    username: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟登录/注册成功
    setTimeout(() => {
      onLoginSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col md:flex-row">
        {/* 左侧：品牌和说明 */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-primary-700 to-primary-500 p-8 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              欢迎回来
            </h2>
            <p className="text-primary-100 mb-6">
              登录后即可使用完整功能，探索AI的无限可能
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <span>多种登录方式</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <span>社交账号快速登录</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <span>安全可靠的认证</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：表单 */}
        <div className="w-full md:w-2/3 max-h-[80vh] overflow-y-auto">
          {/* 头部 */}
          <div className="relative p-6 border-b">
            <h2 className="text-2xl font-bold text-primary-900 text-center">
              {authMode === 'login' ? '登录' : '注册'}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="关闭"
            >
              <X size={20} />
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 登录方式选择 */}
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${loginMethod === 'email' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => setLoginMethod('email')}
              >
                <Mail size={24} />
                <span className="text-xs mt-1">邮箱</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${loginMethod === 'phone' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => setLoginMethod('phone')}
              >
                <Phone size={24} />
                <span className="text-xs mt-1">手机</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${loginMethod === 'wechat' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => setLoginMethod('wechat')}
              >
                <MessageSquare size={24} />
                <span className="text-xs mt-1">微信</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${loginMethod === 'qq' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => setLoginMethod('qq')}
              >
                <Users size={24} />
                <span className="text-xs mt-1">QQ</span>
              </button>
            </div>

            {/* 表单字段 */}
            {loginMethod === 'email' && (
              <>
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">用户名</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="请输入用户名"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="请输入邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">密码</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="请输入密码"
                  />
                </div>
              </>
            )}

            {loginMethod === 'phone' && (
              <>
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">用户名</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="请输入用户名"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">手机号</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="请输入手机号"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">验证码</label>
                    <button
                      type="button"
                      className="w-full px-4 py-3 rounded-xl bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors duration-300"
                    >
                      获取
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">验证码</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    placeholder="请输入验证码"
                  />
                </div>
              </>
            )}

            {loginMethod === 'wechat' && (
              <div className="flex flex-col items-center py-8">
                <div className="w-40 h-40 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare size={80} className="text-neutral-400" />
                </div>
                <p className="text-center text-neutral-600 mb-2">请使用微信扫码登录</p>
                <p className="text-center text-xs text-neutral-500">扫码后点击确认登录</p>
              </div>
            )}

            {loginMethod === 'qq' && (
              <div className="flex flex-col items-center py-8">
                <div className="w-40 h-40 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <Users size={80} className="text-neutral-400" />
                </div>
                <p className="text-center text-neutral-600 mb-2">请使用QQ扫码登录</p>
                <p className="text-center text-xs text-neutral-500">扫码后点击确认登录</p>
              </div>
            )}

            {/* 其他选项 */}
            {loginMethod === 'email' && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="remember" className="text-neutral-600">记住我</label>
                </div>
                <a href="#" className="text-primary-600 hover:text-primary-800 transition-colors">
                  忘记密码？
                </a>
              </div>
            )}

            {/* 登录方式选择 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-3 rounded-xl font-medium transition-all duration-300 ${authMode === 'login' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                onClick={() => setAuthMode('login')}
              >
                登录
              </button>
              <button
                type="button"
                className={`py-3 rounded-xl font-medium transition-all duration-300 ${authMode === 'register' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                onClick={() => setAuthMode('register')}
              >
                注册
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;