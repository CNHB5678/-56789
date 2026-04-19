import { Link, useLocation } from 'react-router-dom'
import { Download, Music, Brain, Video, Folder, Settings, CreditCard, LogIn } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '视频下载', icon: Download },
    { path: '/audio', label: '音频处理', icon: Music },
    { path: '/ai', label: 'AI 创作', icon: Brain },
    { path: '/video', label: '视频处理', icon: Video },
    { path: '/space', label: '个人空间', icon: Folder },
    { path: '/settings', label: '设置', icon: Settings },
    { path: '/subscription', label: '订阅', icon: CreditCard },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg shadow-md">
              <Video className="text-white" size={24} />
            </div>
            <div className="text-blue-900 text-2xl font-bold tracking-tight">
              音视频素材处理工具
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <LogIn size={18} />
              <span>登录</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar