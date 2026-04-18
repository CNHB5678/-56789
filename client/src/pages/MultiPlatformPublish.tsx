import { useState } from 'react';
import { Card, Button, List, Typography, Tag, Space, Checkbox, DatePicker, TimePicker, message, Tabs, Upload, Form, Input, Select } from 'antd';
import { Upload, Calendar, Clock, Send, CheckCircle, PlayCircle, Plus } from 'lucide-react';
import { useAppStore } from '../store';
import type { Content } from '../types';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function MultiPlatformPublish() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const { contents } = useAppStore();

  // Mock content data
  const mockContents: Content[] = [
    {
      id: '1',
      userId: 'user1',
      title: 'AI如何改变工作方式',
      content: '...',
      type: 'script',
      duration: 60,
      status: 'draft',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '2',
      userId: 'user1',
      title: '高效工作的10个技巧',
      content: '...',
      type: 'script',
      duration: 120,
      status: 'published',
      platform: '抖音',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  const platforms = [
    { id: 'douyin', name: '抖音', icon: '🎵', color: 'red' },
    { id: 'xiaohongshu', name: '小红书', icon: '📖', color: 'orange' },
    { id: 'bilibili', name: 'B站', icon: '📺', color: 'blue' },
    { id: 'video', name: '视频号', icon: '🎬', color: 'green' },
  ];

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      message.warning('请选择至少一个平台');
      return;
    }

    setIsPublishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(`成功发布到 ${selectedPlatforms.length} 个平台！`);
    } catch (error) {
      message.error('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">多平台发布</Title>
          <Paragraph className="!text-gray-500 !mb-0">
            一键发布到多个平台，支持定时发布和内容适配
          </Paragraph>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Content Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="选择内容" className="shadow-sm">
            <Tabs
              defaultActiveKey="draft"
              items={[
                { key: 'draft', label: '草稿箱' },
                { key: 'published', label: '已发布' },
              ]}
            />
            
            <List
              className="mt-4"
              dataSource={mockContents}
              renderItem={(content) => (
                <List.Item className="mb-3">
                  <Card hoverable className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Text strong className="text-lg">{content.title}</Text>
                          {content.status === 'published' && (
                            <Tag icon={<CheckCircle size={12} />} color="green">已发布</Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {content.duration}秒
                          </span>
                          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                          {content.platform && <Tag>{content.platform}</Tag>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button icon={<PlayCircle size={14} />}>预览</Button>
                        <Button type="primary" className="!bg-purple-600">
                          选择发布
                        </Button>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>

        {/* Right Panel - Publish Settings */}
        <div className="space-y-6">
          <Card title="发布设置" className="shadow-sm">
            <Form layout="vertical">
              <Form.Item label="选择平台">
                <Space direction="vertical" className="w-full">
                  {platforms.map(platform => (
                    <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <span>{platform.name}</span>
                      </div>
                      <Checkbox 
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlatforms([...selectedPlatforms, platform.id]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                          }
                        }}
                      />
                    </div>
                  ))}
                </Space>
              </Form.Item>

              <Form.Item label="定时发布">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox 
                    checked={scheduleEnabled}
                    onChange={(e) => setScheduleEnabled(e.target.checked)}
                  />
                  <span>启用定时发布</span>
                </div>
                {scheduleEnabled && (
                  <Space direction="vertical" className="w-full">
                    <DatePicker className="w-full" />
                    <TimePicker className="w-full" />
                  </Space>
                )}
              </Form.Item>

              <Form.Item label="自动适配">
                <Select defaultValue="auto" className="w-full">
                  <Option value="auto">自动适配格式</Option>
                  <Option value="9:16">竖屏 9:16</Option>
                  <Option value="16:9">横屏 16:9</Option>
                  <Option value="1:1">正方形 1:1</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<Send size={18} />}
                  onClick={handlePublish}
                  loading={isPublishing}
                  disabled={selectedPlatforms.length === 0}
                  className="w-full !bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isPublishing ? '发布中...' : `发布到 ${selectedPlatforms.length} 个平台`}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="最近发布" className="shadow-sm">
            <List
              dataSource={[
                { platform: '抖音', title: '高效工作的10个技巧', time: '2小时前', status: 'success' },
                { platform: '小红书', title: 'AI如何改变工作方式', time: '1天前', status: 'success' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.platform === '抖音' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <span>{item.platform[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text className="block truncate">{item.title}</Text>
                      <Text type="secondary" className="text-xs">{item.platform} · {item.time}</Text>
                    </div>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
