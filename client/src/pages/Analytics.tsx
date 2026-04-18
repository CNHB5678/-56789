import { Card, Typography, Tabs, Select, DatePicker, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, ThumbsUp, MessageSquare } from 'lucide-react';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function Analytics() {
  // Mock data
  const viewsData = [
    { date: '04-15', 抖音: 12500, 小红书: 8200, B站: 5600 },
    { date: '04-16', 抖音: 18200, 小红书: 9800, B站: 6700 },
    { date: '04-17', 抖音: 24600, 小红书: 12500, B站: 8900 },
    { date: '04-18', 抖音: 19800, 小红书: 10200, B站: 7300 },
  ];

  const engagementData = [
    { name: '抖音', views: 75100, likes: 12300, comments: 2100, shares: 890 },
    { name: '小红书', views: 40700, likes: 8700, comments: 1500, shares: 450 },
    { name: 'B站', views: 28500, likes: 5400, comments: 980, shares: 230 },
  ];

  const categoryData = [
    { name: '科技', value: 45 },
    { name: '职场', value: 30 },
    { name: '生活', value: 15 },
    { name: '其他', value: 10 },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">数据分析</Title>
          <Paragraph className="!text-gray-500 !mb-0">
            查看各平台数据和内容表现，优化创作策略
          </Paragraph>
        </div>
        <Space>
          <RangePicker />
          <Select defaultValue="7days" style={{ width: 120 }}>
            <Select.Option value="7days">最近7天</Select.Option>
            <Select.Option value="30days">最近30天</Select.Option>
            <Select.Option value="90days">最近90天</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">144.3K</div>
              <div className="text-sm text-gray-500">总播放量</div>
              <div className="text-xs text-green-600 mt-1">↑ 23.5% 较上周</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <ThumbsUp size={24} className="text-pink-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">26.4K</div>
              <div className="text-sm text-gray-500">总点赞</div>
              <div className="text-xs text-green-600 mt-1">↑ 18.2% 较上周</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">4.6K</div>
              <div className="text-sm text-gray-500">总评论</div>
              <div className="text-xs text-green-600 mt-1">↑ 31.7% 较上周</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">12.8K</div>
              <div className="text-sm text-gray-500">新增粉丝</div>
              <div className="text-xs text-green-600 mt-1">↑ 15.3% 较上周</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs
        defaultActiveKey="overview"
        items={[
          { key: 'overview', label: '数据概览' },
          { key: 'content', label: '内容分析' },
          { key: 'audience', label: '粉丝画像' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card title="各平台播放趋势" className="shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="抖音" stroke="#fe2c55" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="小红书" stroke="#ff2442" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="B站" stroke="#00a1d6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Chart */}
        <Card title="互动数据对比" className="shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card title="内容分类分布" className="shadow-sm lg:col-span-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Insights */}
        <Card title="AI 优化建议" className="shadow-sm lg:col-span-2">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-purple-600" />
                <span className="font-semibold text-purple-800">热点趋势</span>
              </div>
              <p className="text-gray-600 text-sm">
                科技类内容正在快速增长，建议增加相关选题，特别是 AI 工具应用方向。
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-blue-600" />
                <span className="font-semibold text-blue-800">发布时间</span>
              </div>
              <p className="text-gray-600 text-sm">
                数据显示晚上 8-10 点是最佳发布时间，周末发布的内容互动率更高。
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp size={18} className="text-green-600" />
                <span className="font-semibold text-green-800">内容优化</span>
              </div>
              <p className="text-gray-600 text-sm">
                开头 3 秒的互动率提升 20% 可以显著提升完播率，建议增加更强的钩子。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
