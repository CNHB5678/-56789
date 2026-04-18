import { Card, Row, Col, Statistic, Button, Typography, Progress, Tag } from 'antd';
import { 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Upload, 
  TrendingUp,
  Clock,
  Zap,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function Home() {
  const navigate = useNavigate();

  const quickActions = [
    { 
      title: '风格训练', 
      description: '创建你的专属风格模型',
      icon: <Brain className="text-purple-600" size={28} />,
      path: '/style',
      color: 'purple'
    },
    { 
      title: '生成内容', 
      description: 'AI智能生成脚本和文案',
      icon: <Sparkles className="text-pink-600" size={28} />,
      path: '/content',
      color: 'pink'
    },
    { 
      title: '评论回复', 
      description: 'AI自动回复粉丝评论',
      icon: <MessageSquare className="text-blue-600" size={28} />,
      path: '/comments',
      color: 'blue'
    },
    { 
      title: '多平台发布', 
      description: '一键发布到各大平台',
      icon: <Upload className="text-green-600" size={28} />,
      path: '/publish',
      color: 'green'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <Title level={2} className="!text-white !mb-2">
              欢迎使用瓦粒Agent 🎉
            </Title>
            <Paragraph className="!text-white/90 !text-lg !mb-0">
              打造懂你的数字分身，让AI帮你自动完成从选题到变现的全流程
            </Paragraph>
          </div>
          <Button 
            type="primary" 
            size="large" 
            className="!bg-white !text-purple-600 !h-12 !px-8 !font-semibold shadow-lg"
            onClick={() => navigate('/content')}
          >
            开始创作
            <Rocket className="ml-2" size={18} />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已创建内容" 
              value={12} 
              prefix={<Zap size={18} className="text-yellow-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="风格模型" 
              value={2} 
              prefix={<Brain size={18} className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已回复评论" 
              value={156} 
              prefix={<MessageSquare size={18} className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="总播放量" 
              value={125000} 
              prefix={<TrendingUp size={18} className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title="快速开始" 
        className="shadow-sm"
        extra={<Tag color="blue">推荐</Tag>}
      >
        <Row gutter={[16, 16]}>
          {quickActions.map((action, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card 
                hoverable
                className="text-center cursor-pointer border-2 border-transparent hover:border-purple-200"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${action.color}-50 flex items-center justify-center`}>
                  {action.icon}
                </div>
                <Title level={4} className="!mb-2">{action.title}</Title>
                <Paragraph className="!text-gray-500 !mb-0 !text-sm">
                  {action.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Progress Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="本月进度" className="shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>内容发布计划</span>
                  <span className="text-gray-500">8/15</span>
                </div>
                <Progress percent={53} status="active" strokeColor="#722ed1" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>粉丝互动回复</span>
                  <span className="text-gray-500">156/200</span>
                </div>
                <Progress percent={78} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>目标播放量</span>
                  <span className="text-gray-500">125k/200k</span>
                </div>
                <Progress percent={62} strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="最近活动" className="shadow-sm">
            <div className="space-y-3">
              {[
                { time: '5分钟前', action: '生成了新脚本', title: 'AI如何改变生活' },
                { time: '1小时前', action: '发布到抖音', title: '高效工作技巧' },
                { time: '3小时前', action: '回复了评论', title: '23条新评论' },
                { time: '昨天', action: '更新了风格模型', title: '专业版v2' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.action} · {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
