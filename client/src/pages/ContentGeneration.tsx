import { Card, Button, Typography, Form, Input, Select, Tag, Space, Alert } from 'antd';
import { Sparkles, Calendar, Target, Clock, TrendingUp, ChevronRight } from 'lucide-react';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function ContentGeneration() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">内容生成</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          AI智能生成脚本和文案，让你的创作更高效
        </Paragraph>
      </div>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">生成新内容</h3>
        </div>

        <Form layout="vertical">
          <Form.Item label="内容类型" rules={[{ required: true, message: '请选择内容类型' }]}>
            <Select 
              size="large" 
              placeholder="请选择内容类型"
              options={[
                { value: 'video', label: '视频脚本' },
                { value: 'article', label: '文章文案' },
                { value: 'social', label: '社交媒体' },
                { value: 'ad', label: '广告创意' },
              ]}
            />
          </Form.Item>

          <Form.Item label="主题" rules={[{ required: true, message: '请输入主题' }]}>
            <Input placeholder="请输入内容主题" size="large" />
          </Form.Item>

          <Form.Item label="风格选择" rules={[{ required: true, message: '请选择风格' }]}>
            <Select 
              size="large" 
              placeholder="请选择风格"
              options={[
                { value: 'professional', label: '专业严肃' },
                { value: 'casual', label: '轻松随意' },
                { value: 'humorous', label: '幽默风趣' },
                { value: 'inspirational', label: '励志向上' },
              ]}
            />
          </Form.Item>

          <Form.Item label="目标受众" rules={[{ required: true, message: '请选择目标受众' }]}>
            <Select 
              size="large" 
              placeholder="请选择目标受众"
              options={[
                { value: 'young', label: '年轻人' },
                { value: 'adult', label: '成年人' },
                { value: 'professional', label: '专业人士' },
                { value: 'students', label: '学生' },
              ]}
            />
          </Form.Item>

          <Form.Item label="详细要求" rules={[{ required: true, message: '请输入详细要求' }]}>
            <TextArea rows={4} placeholder="请输入详细要求，包括长度、结构、重点内容等" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" className="!bg-purple-600">
              生成内容
              <Sparkles className="ml-2" size={18} />
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">热门话题推荐</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'AI如何改变我们的生活',
              category: '科技',
              trend: '上升',
              views: '12.5万',
              description: '探讨人工智能在各个领域的应用和影响'
            },
            {
              title: '2024年最值得学习的技能',
              category: '职场',
              trend: '热门',
              views: '8.3万',
              description: '未来职场必备的核心技能分析'
            },
            {
              title: '健康生活方式指南',
              category: '健康',
              trend: '稳定',
              views: '6.7万',
              description: '如何在忙碌的生活中保持健康的生活习惯'
            },
          ].map((topic, idx) => (
            <Card 
              key={idx} 
              hoverable 
              className="border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{topic.title}</h4>
                <Tag color={
                  topic.trend === '上升' ? 'green' : 
                  topic.trend === '热门' ? 'red' : 'blue'
                }>
                  {topic.trend}
                </Tag>
              </div>
              <Tag color="purple" className="mb-2">{topic.category}</Tag>
              <p className="text-sm text-gray-500 mb-3">{topic.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  <span>{topic.views} 浏览</span>
                </div>
                <Button 
                  type="text" 
                  size="small" 
                  className="!text-purple-600"
                  icon={<ChevronRight size={14} />}
                >
                  生成
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}