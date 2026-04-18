import { Card, Button, Typography, Form, Select, Upload, Space, Tag, Table, Switch, Input } from 'antd';
import { Upload as UploadIcon, Send, CheckCircle, Globe, Link2 } from 'lucide-react';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function MultiPlatformPublish() {
  const platforms = [
    { id: 1, name: '抖音', connected: true, status: '活跃' },
    { id: 2, name: '小红书', connected: true, status: '活跃' },
    { id: 3, name: 'B站', connected: false, status: '未连接' },
    { id: 4, name: '视频号', connected: false, status: '未连接' },
  ];

  const publishedContent = [
    {
      id: 1,
      title: 'AI如何改变我们的生活',
      platforms: ['抖音', '小红书'],
      status: '已发布',
      time: '2024-05-18 10:30',
      views: '12.5万',
    },
    {
      id: 2,
      title: '2024年最值得学习的技能',
      platforms: ['抖音'],
      status: '已发布',
      time: '2024-05-17 15:45',
      views: '8.3万',
    },
    {
      id: 3,
      title: '健康生活方式指南',
      platforms: ['小红书', 'B站'],
      status: '发布中',
      time: '2024-05-17 09:20',
      views: '0',
    },
  ];

  const columns = [
    {
      title: '内容标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="max-w-md truncate">{text}</span>,
    },
    {
      title: '发布平台',
      dataIndex: 'platforms',
      key: 'platforms',
      render: (platforms: string[]) => (
        <Space>
          {platforms.map((platform, idx) => (
            <Tag key={idx} color={
              platform === '抖音' ? 'red' : 
              platform === '小红书' ? 'orange' : 
              platform === 'B站' ? 'blue' : 'green'
            }>
              {platform}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={
          text === '已发布' ? 'green' : 
          text === '发布中' ? 'blue' : 'red'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '播放量',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" className="!bg-purple-600">
            查看详情
          </Button>
          <Button size="small">
            重新发布
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">多平台发布</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          一键发布到各大平台，提高内容传播效率
        </Paragraph>
      </div>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">发布新内容</h3>
        </div>

        <Form layout="vertical">
          <Form.Item label="内容标题" rules={[{ required: true, message: '请输入内容标题' }]}>
            <Input placeholder="请输入内容标题" size="large" />
          </Form.Item>

          <Form.Item label="选择平台" rules={[{ required: true, message: '请选择发布平台' }]}>
            <Select 
              mode="multiple" 
              size="large" 
              placeholder="请选择发布平台"
              options={[
                { value: 'douyin', label: '抖音' },
                { value: 'xiaohongshu', label: '小红书' },
                { value: 'bilibili', label: 'B站' },
                { value: 'weixin', label: '视频号' },
              ]}
            />
          </Form.Item>

          <Form.Item label="上传视频" rules={[{ required: true, message: '请上传视频' }]}>
            <Upload.Dragger 
              name="video" 
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon size={48} className="text-gray-400" />
              </p>
              <p className="ant-upload-text">点击或拖拽视频到此处上传</p>
              <p className="ant-upload-hint">
                支持MP4、MOV等格式，最大500MB
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="封面图片" rules={[{ required: true, message: '请上传封面图片' }]}>
            <Upload.Dragger 
              name="cover" 
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon size={48} className="text-gray-400" />
              </p>
              <p className="ant-upload-text">点击或拖拽图片到此处上传</p>
              <p className="ant-upload-hint">
                支持JPG、PNG格式，建议尺寸16:9
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="描述文案" rules={[{ required: true, message: '请输入描述文案' }]}>
            <TextArea rows={4} placeholder="请输入视频描述文案" size="large" />
          </Form.Item>

          <Form.Item label="标签" rules={[{ required: true, message: '请输入标签' }]}>
            <Input placeholder="请输入标签，用逗号分隔" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" className="!bg-purple-600">
              发布到所选平台
              <Send className="ml-2" size={18} />
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">已发布内容</h3>
        </div>

        <Table 
          columns={columns} 
          dataSource={publishedContent} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">平台管理</h3>
        </div>

        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  platform.name === '抖音' ? 'bg-red-100' :
                  platform.name === '小红书' ? 'bg-orange-100' :
                  platform.name === 'B站' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <span className="text-lg font-semibold">{platform.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{platform.name}</h4>
                  <p className="text-sm text-gray-500">{platform.status}</p>
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
      </Card>
    </div>
  );
}

