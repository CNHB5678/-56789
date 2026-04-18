import { useState } from 'react';
import { Card, Button, Form, Input, Select, Slider, Tabs, Typography, Space, Tag, List, message, Spin } from 'antd';
import { Sparkles, Brain, Clock, ThumbsUp, RefreshCw, Plus, Save } from 'lucide-react';
import { useAppStore } from '../store';
import type { Content, StyleModel } from '../types';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ContentGeneration() {
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { styleModels, addContent, hotTopics, setHotTopics } = useAppStore();

  // Mock hot topics
  useState(() => {
    setHotTopics([
      { id: '1', title: 'AI如何改变工作方式', platform: '抖音', heat: 98, category: '科技', trend: 'hot' },
      { id: '2', title: '2024年最值得投资的领域', platform: '小红书', heat: 87, category: '财经', trend: 'rising' },
      { id: '3', title: '高效工作的10个技巧', platform: 'B站', heat: 76, category: '职场', trend: 'stable' },
    ]);
  });

  const handleGenerate = async (values: any) => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleContent = `【开场白】
大家好！今天想和大家聊聊${values.topic || '这个有趣的话题'}。

【主体内容】
在这个快速变化的时代，我们每天都面临着各种各样的选择和挑战。
我认为最重要的是保持学习的心态，不断提升自己。

【互动环节】
你们觉得呢？欢迎在评论区分享你的想法！

【结尾】
记得点赞关注，我们下期再见！`;

      setGeneratedContent(sampleContent);
      message.success('内容生成成功！');
    } catch (error) {
      message.error('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = () => {
    const content: Content = {
      id: Date.now().toString(),
      userId: 'user1',
      title: form.getFieldValue('topic') || '未命名内容',
      content: generatedContent,
      type: 'script',
      duration: form.getFieldValue('duration'),
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    addContent(content);
    message.success('内容已保存！');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">内容生成</Title>
          <Paragraph className="!text-gray-500 !mb-0">
            AI智能生成脚本和文案，支持多种风格和长度
          </Paragraph>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Hot Topics */}
          <Card title="🔥 热门话题" className="shadow-sm">
            <List
              dataSource={hotTopics}
              renderItem={(topic) => (
                <List.Item 
                  className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => form.setFieldValue('topic', topic.title)}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-1">
                      <Text strong className="text-sm">{topic.title}</Text>
                      <Tag color={topic.trend === 'hot' ? 'red' : topic.trend === 'rising' ? 'orange' : 'blue'}>
                        {topic.heat}°
                      </Tag>
                    </div>
                    <div className="flex gap-2">
                      <Tag className="m-0" size="small">{topic.platform}</Tag>
                      <Tag className="m-0" size="small">{topic.category}</Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Generation Form */}
          <Card title="生成设置" className="shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerate}
              initialValues={{
                duration: 60,
                versions: 1,
              }}
            >
              <Form.Item
                name="styleModel"
                label="选择风格模型"
              >
                <Select placeholder="选择风格模型" size="large">
                  {styleModels.map(model => (
                    <Option key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Brain size={16} />
                        {model.name}
                      </div>
                    </Option>
                  ))}
                  {styleModels.length === 0 && (
                    <Option disabled value="">请先创建风格模型</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                name="topic"
                label="话题/主题"
                rules={[{ required: true, message: '请输入话题' }]}
              >
                <TextArea 
                  placeholder="描述你想讲的话题或内容主题..." 
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                name="duration"
                label="视频时长（秒）"
              >
                <Slider 
                  min={15}
                  max={300}
                  step={15}
                  marks={{ 15: '15s', 60: '60s', 180: '3min', 300: '5min' }}
                />
              </Form.Item>

              <Form.Item
                name="tone"
                label="语气调整"
              >
                <Select placeholder="选择语气">
                  <Option value="normal">正常</Option>
                  <Option value="excited">兴奋</Option>
                  <Option value="calm">平静</Option>
                  <Option value="humorous">幽默</Option>
                </Select>
              </Form.Item>

              <Form.Item className="!mb-0">
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  icon={<Sparkles size={18} />}
                  loading={isGenerating}
                  className="w-full !bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isGenerating ? '生成中...' : '生成内容'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Right Panel - Generated Content */}
        <div className="lg:col-span-2">
          <Card 
            title="生成结果" 
            className="shadow-sm h-full"
            extra={
              generatedContent && (
                <Space>
                  <Button 
                    icon={<RefreshCw size={16} />} 
                    onClick={() => form.submit()}
                  >
                    重新生成
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<Save size={16} />} 
                    onClick={handleSaveContent}
                    className="!bg-purple-600"
                  >
                    保存内容
                  </Button>
                </Space>
              )
            }
          >
            {!generatedContent ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles size={48} className="text-purple-500" />
                </div>
                <Title level={3} className="!mb-2">开始创作</Title>
                <Paragraph className="!text-gray-500">
                  选择话题或输入主题，让AI为你生成高质量内容
                </Paragraph>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Tag icon={<Clock size={14} />} color="blue">
                    {form.getFieldValue('duration') || 60}秒
                  </Tag>
                  <Tag icon={<ThumbsUp size={14} />} color="green">
                    推荐使用
                  </Tag>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {generatedContent}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button icon={<Plus size={16} />}>生成另一版本</Button>
                  <Button>复制内容</Button>
                  <Button type="primary" className="ml-auto !bg-purple-600">
                    去发布
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
