import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Modal, Form, Input, message } from 'antd';
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

  const menuItems = [
    { key: '/', icon: <Home size={20} />, label: '首页' },
    { key: '/content', icon: <Sparkles size={20} />, label: '内容生成' },
    { key: '/comments', icon: <MessageSquare size={20} />, label: '评论回复' },
    { key: '/publish', icon: <Upload size={20} />, label: '多平台发布' },
    { key: '/analytics', icon: <BarChart3 size={20} />, label: '数据分析' },
    { key: '/style', icon: <Brain size={20} />, label: '风格训练' },
    { key: '/settings', icon: <Settings size={20} />, label: '设置' },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'profile') {
      form.setFieldsValue({ username });
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = () => {
    form.validateFields().then(values => {
      setUsername(values.username);
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
    <AntLayout className="min-h-screen bg-gray-50">
      <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            瓦粒Agent
          </h1>
        </div>
        
        <Dropdown menu={{ items: userMenu }} placement="bottomRight">
          <Button type="text" className="flex items-center gap-2 hover:bg-gray-100">
            <Avatar className="bg-purple-600">U</Avatar>
            <span className="text-gray-700">{username}</span>
            <ChevronRight size={14} className="text-gray-400" />
          </Button>
        </Dropdown>
      </Header>

      <AntLayout>
        <Sider 
          width={240} 
          theme="light" 
          className="border-r border-gray-200"
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
            />
          </div>
        </Sider>
        
        <Content className="p-6 overflow-auto">
          <Outlet />
        </Content>
      </AntLayout>

      {/* 个人资料修改弹窗 */}
      <Modal
        title="修改个人资料"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        onOk={handleSaveProfile}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </AntLayout>
  );
}
