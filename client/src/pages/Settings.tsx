import { Card, Typography, Form, Input, Button, Tabs, Space, Switch } from 'antd';
import { Settings as SettingsIcon, CreditCard, Bell, Link2 } from 'lucide-react';

const { Title, Paragraph, Text } = Typography;

export default function SettingsPage() {
  const platforms = [
    { name: '抖音', connected: true },
    { name: '小红书', connected: true },
    { name: 'B站', connected: false },
    { name: '视频号', connected: false },
  ];

  // 平台连接内容
  const PlatformsContent = () => (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <div key={platform.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              platform.name === '抖音' ? 'bg-red-100' :
              platform.name === '小红书' ? 'bg-orange-100' :
              platform.name === 'B站' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <span className="text-lg">{platform.name[0]}</span>
            </div>
            <div>
              <Text strong className="block">{platform.name}</Text>
              <Text type="secondary" className="text-sm">
                {platform.connected ? '已连接' : '未连接'}
              </Text>
            </div>
          </div>
          <Button 
            type={platform.connected ? 'default' : 'primary'}
            size="large"
            className={!platform.connected ? '!bg-purple-600' : ''}
          >
            {platform.connected ? '断开连接' : '连接'}
          </Button>
        </div>
      ))}
    </div>
  );

  // API设置内容
  const APIContent = () => (
    <div className="space-y-6">
      <Paragraph className="!text-gray-500 !mb-0">
        配置你的 API 密钥以使用 AI 功能，或者使用我们的默认配置。
      </Paragraph>

      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <Text strong className="block">使用默认 API 配置</Text>
              <Text type="secondary" className="text-sm">
                我们提供安全的 API 代理，无需配置密钥
              </Text>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Form layout="vertical">
          <Form.Item label="OpenAI API Key">
            <Input.Password placeholder="sk-..." size="large" />
          </Form.Item>

          <Form.Item label="DeepSeek API Key">
            <Input.Password placeholder="sk-..." size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" className="!bg-purple-600">
              保存 API 密钥
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  // 订阅管理内容
  const SubscriptionContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
        <div>
          <Title level={3} className="!text-white !mb-1">专业版</Title>
          <Text className="text-purple-100">3个平台，无限生成</Text>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">¥299</div>
          <div className="text-purple-200">/月</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text type="secondary" className="text-sm">到期时间</Text>
          <Text strong className="block text-lg">2024年5月18日</Text>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text type="secondary" className="text-sm">本月使用量</Text>
          <Text strong className="block text-lg">42 / 无限</Text>
        </div>
      </div>

      <Space>
        <Button type="primary" size="large" className="!bg-purple-600">
          升级到企业版
        </Button>
        <Button size="large">管理订阅</Button>
      </Space>
    </div>
  );

  // 通知设置内容
  const NotificationsContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <Text strong className="block">内容生成完成</Text>
          <Text type="secondary" className="text-sm">AI 完成内容生成时发送通知</Text>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <Text strong className="block">新评论提醒</Text>
          <Text type="secondary" className="text-sm">收到新评论时发送通知</Text>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <Text strong className="block">数据报告</Text>
          <Text type="secondary" className="text-sm">每周发送数据报告</Text>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <Text strong className="block">营销邮件</Text>
          <Text type="secondary" className="text-sm">接收产品更新和优惠信息</Text>
        </div>
        <Switch />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">设置</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          管理账户信息、平台连接和偏好设置
        </Paragraph>
      </div>

      <Card className="shadow-sm">
        <Tabs
          defaultActiveKey="platforms"
          items={[
            {
              key: 'platforms',
              label: (
                <span className="flex items-center gap-2">
                  <Link2 size={16} />
                  平台连接
                </span>
              ),
              children: <PlatformsContent />,
            },
            {
              key: 'api',
              label: (
                <span className="flex items-center gap-2">
                  <SettingsIcon size={16} />
                  API 设置
                </span>
              ),
              children: <APIContent />,
            },
            {
              key: 'subscription',
              label: (
                <span className="flex items-center gap-2">
                  <CreditCard size={16} />
                  订阅管理
                </span>
              ),
              children: <SubscriptionContent />,
            },
            {
              key: 'notifications',
              label: (
                <span className="flex items-center gap-2">
                  <Bell size={16} />
                  通知设置
                </span>
              ),
              children: <NotificationsContent />,
            },
          ]}
        />
      </Card>
    </div>
  );
}