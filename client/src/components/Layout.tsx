import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, message } from 'antd';
import { 
  Home, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Upload, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const { Header, Sider, Content } = AntLayout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('用户');
  const [email, setEmail] = useState('user@example.com');
  
  // 订阅信息
  const subscription = {
    plan: '专业版',
    price: '¥299',
    period: '月',
    expires: '2024年5月18日'
  };

  const menuItems = [
    { key: '/', icon: <Home size={24} />, label: '首页' },
    { key: '/content', icon: <Sparkles size={24} />, label: '内容生成' },
    { key: '/comments', icon: <MessageSquare size={24} />, label: '评论回复' },
    { key: '/publish', icon: <Upload size={24} />, label: '多平台发布' },
    { key: '/analytics', icon: <BarChart3 size={24} />, label: '数据分析' },
    { key: '/style', icon: <Brain size={24} />, label: '风格训练' },
    { key: '/settings', icon: <Settings size={24} />, label: '设置' },
  ];

  const userMenu = [
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <AntLayout className="flex-1 flex flex-col h-full">
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            瓦粒Agent
          </h1>
        </div>
        
        <Dropdown 
          menu={{ 
            items: userMenu,
            title: (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                    {username.charAt(0)}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{username}</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{subscription.plan}</span>
                    <span>{subscription.price}/{subscription.period}</span>
                  </div>
                  <div className="text-xs opacity-80">到期时间: {subscription.expires}</div>
                </div>
              </div>
            )
          }} 
          placement="bottomRight"
        >
          <Button type="text" className="flex items-center gap-2 hover:bg-gray-100">
            <Avatar className="bg-purple-600">{username.charAt(0)}</Avatar>
            <span className="text-gray-700">{username}</span>
            <ChevronRight size={14} className="text-gray-400" />
          </Button>
        </Dropdown>
      </Header>

      <AntLayout className="flex-1 overflow-hidden">
        <Sider 
          width={240} 
          theme="light" 
          className="border-r border-gray-200 fixed top-16 left-0 bottom-0 z-40"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="py-4">
                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  items={menuItems}
                  onClick={({ key }) => navigate(key)}
                  className="border-none"
                  style={{ fontSize: '16px' }}
                />
              </div>
        </Sider>
        
        <Content className="p-6 overflow-auto ml-64 pt-20">
          <Outlet />
        </Content>
      </AntLayout>


    </AntLayout>
    </div>
  );
}
