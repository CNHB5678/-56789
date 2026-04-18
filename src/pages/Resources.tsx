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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary-900 mb-12">
          AI资源工具
        </h1>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索资源工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm appearance-none bg-white"
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
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary-900 mb-8">
            分类导航
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to="#"
                className={`p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${selectedCategory === category.id ? 'bg-primary-600 text-white shadow-md' : 'bg-white shadow-md hover:shadow-lg'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.id);
                }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${selectedCategory === category.id ? 'bg-primary-500' : 'bg-primary-100 text-primary-700'}`}>
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
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                    <img 
                      src={resource.icon} 
                      alt={resource.name} 
                      className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-900 group-hover:text-primary-700 transition-colors duration-300">
                      {resource.name}
                    </h3>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-3 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>
                </div>
                <p className="text-neutral-600 mb-6 line-clamp-3">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Star size={16} className="text-secondary-400 mr-1" />
                    <span className="font-medium text-primary-900">{resource.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Download size={14} className="mr-1" />
                    <span>{resource.view_count} 次使用</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <ExternalLink size={16} />
                    访问工具
                  </a>
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 rounded-lg transition-colors duration-300 text-center shadow-sm"
                  >
                    详情
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300">
              上一页
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-600 text-white shadow-md">
              1
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300">
              2
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300">
              3
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;