import { Card, Button, Typography, Table, Tag, Input, Space, Switch, Form, Select } from 'antd';
import { MessageSquare, Check, User, Clock, Eye, Heart, MessageCircle } from 'lucide-react';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function CommentsReply() {
  const comments = [
    {
      id: 1,
      content: '这个视频太棒了！学到了很多知识，感谢分享！',
      user: '张三',
      platform: '抖音',
      time: '2024-05-18 10:30',
      likes: 23,
      status: '待回复',
      avatar: '张'
    },
    {
      id: 2,
      content: '请问这个方法适用于所有情况吗？',
      user: '李四',
      platform: '小红书',
      time: '2024-05-18 09:15',
      likes: 8,
      status: '已回复',
      avatar: '李'
    },
    {
      id: 3,
      content: '期待更多相关内容！',
      user: '王五',
      platform: 'B站',
      time: '2024-05-17 22:45',
      likes: 15,
      status: '待回复',
      avatar: '王'
    },
  ];

  const columns = [
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => <span className="max-w-md truncate">{text}</span>,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            {record.avatar}
          </div>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (text: string) => (
        <Tag color={
          text === '抖音' ? 'red' : 
          text === '小红书' ? 'orange' : 
          text === 'B站' ? 'blue' : 'green'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '互动',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: number) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-500" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} className="text-gray-500" />
            <span>0</span>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === '已回复' ? 'green' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" className="!bg-purple-600">
            自动回复
          </Button>
          <Button size="small">
            手动回复
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">评论回复</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          AI自动回复粉丝评论，提高互动效率
        </Paragraph>
      </div>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">评论管理</h3>
          <div className="flex items-center gap-2">
            <span>自动回复</span>
            <Switch defaultChecked />
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={comments} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">回复设置</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h4 className="font-semibold mb-2">自动回复规则</h4>
            <p className="text-sm text-gray-500 mb-3">
              设置AI回复的规则和风格，让回复更加个性化
            </p>
            <Form.Item label="回复风格" rules={[{ required: true, message: '请选择回复风格' }]}>
              <Select 
                size="large" 
                placeholder="请选择回复风格"
                options={[
                  { value: 'friendly', label: '友好热情' },
                  { value: 'professional', label: '专业认真' },
                  { value: 'humorous', label: '幽默风趣' },
                ]}
              />
            </Form.Item>
            <Form.Item label="回复长度" rules={[{ required: true, message: '请选择回复长度' }]}>
              <Select 
                size="large" 
                placeholder="请选择回复长度"
                options={[
                  { value: 'short', label: '简短' },
                  { value: 'medium', label: '中等' },
                  { value: 'long', label: '详细' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item label="自定义回复模板" rules={[{ required: true, message: '请输入回复模板' }]}>
            <TextArea rows={4} placeholder="输入自定义回复模板，支持变量：{username}, {content}等" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" className="!bg-purple-600">
              保存设置
            </Button>
          </Form.Item>
        </div>
      </Card>
    </div>
  );
}

