import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Modal, Form, Input, message } from 'antd';
const { TextArea } = Input;
import { 
  Home, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Upload, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';

const { Header, Sider, Content } = AntLayout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [username, setUsername] = useState('用户');
  const [email, setEmail] = useState('user@example.com');
  const [bio, setBio] = useState('');
  
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

  const handleMenuClick = (key: string) => {
    if (key === 'profile') {
      form.setFieldsValue({ username, email, bio });
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = () => {
    form.validateFields().then(values => {
      setUsername(values.username);
      setEmail(values.email);
      setBio(values.bio);
      message.success('个人资料已更新！');
      setIsProfileModalOpen(false);
    });
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: '个人资料',
      onClick: () => handleMenuClick('profile'),
    },
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

      {/* 个人资料修改弹窗 */}
      <Modal
        title="修改个人资料"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        onOk={handleSaveProfile}
        width={500}
        centered
      >
        <Form form={form} layout="vertical">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">{username.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{username}</h3>
              <p className="text-gray-500">点击头像上传新头像</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}
            >
              <Input placeholder="请输入邮箱" size="large" />
            </Form.Item>
          </div>
          
          <Form.Item
            name="bio"
            label="个人简介"
          >
            <TextArea rows={3} placeholder="介绍一下你自己..." />
          </Form.Item>
        </Form>
      </Modal>
    </AntLayout>
    </div>
  );
}
