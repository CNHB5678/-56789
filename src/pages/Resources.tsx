import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Star, TrendingUp, Download, Code, Database, Zap, Brain } from 'lucide-react';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 模拟资源数据
  const resources = [
    {
      id: '1',
      name: 'AI绘画工具',
      description: '基于 Stable Diffusion 的在线绘画工具，支持多种风格和参数调整',
      url: 'https://example.com/ai-art',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20art%20tool%20icon&image_size=square',
      category: '创意工具',
      view_count: 2500,
      like_count: 1200,
      rating: 4.9
    },
    {
      id: '2',
      name: 'AI代码助手',
      description: '智能代码生成和调试工具，支持多种编程语言',
      url: 'https://example.com/ai-code',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20code%20assistant%20icon&image_size=square',
      category: '开发工具',
      view_count: 2000,
      like_count: 950,
      rating: 4.8
    },
    {
      id: '3',
      name: 'AI翻译器',
      description: '多语言智能翻译工具，支持文本、文档和网页翻译',
      url: 'https://example.com/ai-translate',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20translator%20icon&image_size=square',
      category: '实用工具',
      view_count: 1800,
      like_count: 850,
      rating: 4.7
    },
    {
      id: '4',
      name: 'AI聊天机器人',
      description: '智能对话助手，支持多种场景和个性化设置',
      url: 'https://example.com/ai-chat',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20icon&image_size=square',
      category: '对话工具',
      view_count: 3000,
      like_count: 1500,
      rating: 4.9
    },
    {
      id: '5',
      name: 'AI数据分析工具',
      description: '智能数据分析和可视化工具，支持多种数据格式',
      url: 'https://example.com/ai-data',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20data%20analysis%20icon&image_size=square',
      category: '数据工具',
      view_count: 1500,
      like_count: 700,
      rating: 4.6
    },
    {
      id: '6',
      name: 'AI语音助手',
      description: '智能语音识别和合成工具，支持多种语言和场景',
      url: 'https://example.com/ai-voice',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20voice%20assistant%20icon&image_size=square',
      category: '语音工具',
      view_count: 1200,
      like_count: 550,
      rating: 4.5
    }
  ];

  const categories = [
    { id: 'all', name: '全部', icon: <ExternalLink /> },
    { id: '开发工具', name: '开发工具', icon: <Code /> },
    { id: '创意工具', name: '创意工具', icon: <Zap /> },
    { id: '实用工具', name: '实用工具', icon: <Database /> },
    { id: '对话工具', name: '对话工具', icon: <Brain /> },
    { id: '数据工具', name: '数据工具', icon: <Database /> },
    { id: '语音工具', name: '语音工具', icon: <Zap /> }
  ];

  // 筛选资源
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          AI资源工具
        </h1>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索资源工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分类导航 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            分类导航
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to="#"
                className={`p-4 rounded-xl flex flex-col items-center text-center transition-all ${selectedCategory === category.id ? 'bg-blue-700 text-white' : 'bg-white shadow-md hover:shadow-lg'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.id);
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedCategory === category.id ? 'bg-blue-600' : 'bg-blue-100 text-blue-700'}`}>
                  {category.icon}
                </div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 资源列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map(resource => (
            <Link
              key={resource.id}
              to={`/resources/${resource.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <img 
                      src={resource.icon} 
                      alt={resource.name} 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {resource.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {resource.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="font-medium">{resource.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Download size={14} className="mr-1" />
                    <span>{resource.view_count} 次使用</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    访问工具
                  </a>
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    详情
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              上一页
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-700 text-white">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;