import { Card, Typography, Row, Col, Statistic, Progress, Table, Tag, Select, Button } from 'antd';
import { BarChart3, TrendingUp, User, Heart, MessageCircle, Eye, Download } from 'lucide-react';

const { Title, Paragraph } = Typography;

export default function Analytics() {
  const analyticsData = [
    {
      id: 1,
      title: 'AI如何改变我们的生活',
      platform: '抖音',
      views: '125,000',
      likes: '8,200',
      comments: '1,250',
      shares: '3,500',
      conversion: '3.2%',
    },
    {
      id: 2,
      title: '2024年最值得学习的技能',
      platform: '小红书',
      views: '83,000',
      likes: '5,100',
      comments: '850',
      shares: '2,100',
      conversion: '2.8%',
    },
    {
      id: 3,
      title: '健康生活方式指南',
      platform: 'B站',
      views: '67,000',
      likes: '4,300',
      comments: '720',
      shares: '1,800',
      conversion: '2.5%',
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
      title: '播放量',
      dataIndex: 'views',
      key: 'views',
      render: (text: string) => (
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '点赞',
      dataIndex: 'likes',
      key: 'likes',
      render: (text: string) => (
        <div className="flex items-center gap-1">
          <Heart size={14} className="text-red-500" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '评论',
      dataIndex: 'comments',
      key: 'comments',
      render: (text: string) => (
        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '分享',
      dataIndex: 'shares',
      key: 'shares',
    },
    {
      title: '转化率',
      dataIndex: 'conversion',
      key: 'conversion',
      render: (text: string) => (
        <Tag color="green">{text}</Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">数据分析</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          全面分析你的内容表现，优化创作策略
        </Paragraph>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">数据概览</h3>
        <Select 
          defaultValue="7d" 
          style={{ width: 120 }}
          options={[
            { value: '7d', label: '近7天' },
            { value: '30d', label: '近30天' },
            { value: '90d', label: '近90天' },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic 
              title="总播放量" 
              value={275000} 
              prefix={<Eye size={20} className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
              suffix="次"
            />
            <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
              <TrendingUp size={14} />
              <span>12.5% 增长</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic 
              title="总点赞数" 
              value={17600} 
              prefix={<Heart size={20} className="text-red-500" />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix="个"
            />
            <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
              <TrendingUp size={14} />
              <span>8.3% 增长</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic 
              title="总评论数" 
              value={2820} 
              prefix={<MessageCircle size={20} className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
              suffix="条"
            />
            <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
              <TrendingUp size={14} />
              <span>5.2% 增长</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic 
              title="总粉丝数" 
              value={15200} 
              prefix={<User size={20} className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
            />
            <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
              <TrendingUp size={14} />
              <span>3.8% 增长</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">平台表现</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {
            [
              { name: '抖音', views: 125000, percentage: 45, color: 'red' },
              { name: '小红书', views: 83000, percentage: 30, color: 'orange' },
              { name: 'B站', views: 67000, percentage: 25, color: 'blue' },
            ].map((platform, idx) => (
              <Card key={idx} className="border-2 border-transparent hover:border-purple-200">
                <h4 className="font-semibold mb-2">{platform.name}</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">播放量</span>
                  <span className="font-semibold">{platform.views.toLocaleString()}</span>
                </div>
                <Progress 
                  percent={platform.percentage} 
                  strokeColor={platform.color}
                  size="small"
                />
                <div className="mt-2 text-right text-sm text-gray-500">
                  占比 {platform.percentage}%
                </div>
              </Card>
            ))
          }
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">内容表现</h3>
          <Button icon={<Download size={16} />} size="small">
            导出数据
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={analyticsData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

