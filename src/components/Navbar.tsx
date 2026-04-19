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
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-white text-2xl font-bold">
              音视频素材处理工具
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-1">
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