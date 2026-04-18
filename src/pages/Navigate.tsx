import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, Code, Database, Zap, Brain, Settings, Layers, Star } from 'lucide-react';

const Navigate = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // 模拟分类数据
  const categories = [
    { id: 'all', name: '全部', icon: <Layers /> },
    { id: 'tutorials', name: 'AI教程', icon: <Book /> },
    { id: 'tools', name: '开发工具', icon: <Code /> },
    { id: 'data', name: '数据资源', icon: <Database /> },
    { id: 'utilities', name: '实用工具', icon: <Zap /> },
    { id: 'models', name: 'AI模型', icon: <Brain /> },
    { id: 'settings', name: '配置工具', icon: <Settings /> }
  ];

  const difficultyLevels = [
    { id: 'all', name: '全部难度' },
    { id: 'beginner', name: '入门' },
    { id: 'intermediate', name: '中级' },
    { id: 'advanced', name: '高级' }
  ];

  // 模拟推荐资源数据
  const recommendedResources = [
    {
      id: '1',
      title: 'AI基础入门教程',
      type: 'tutorial',
      category: 'tutorials',
      difficulty: 'beginner',
      description: '从零基础开始学习AI的核心概念和应用',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20basics%20tutorial%20cover&image_size=landscape_16_9',
      rating: 4.8,
      views: 1200
    },
    {
      id: '2',
      title: 'AI绘画工具集',
      type: 'tool',
      category: 'utilities',
      difficulty: 'beginner',
      description: '包含多种AI绘画工具的使用指南和对比',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20art%20tools%20collection&image_size=landscape_16_9',
      rating: 4.5,
      views: 950
    },
    {
      id: '3',
      title: '机器学习实战项目',
      type: 'tutorial',
      category: 'tutorials',
      difficulty: 'intermediate',
      description: '通过实际项目学习机器学习算法和应用',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20projects&image_size=landscape_16_9',
      rating: 4.7,
      views: 800
    },
    {
      id: '4',
      title: 'AI代码助手对比',
      type: 'tool',
      category: 'tools',
      difficulty: 'intermediate',
      description: '主流AI代码助手的功能对比和使用技巧',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20code%20assistants%20comparison&image_size=landscape_16_9',
      rating: 4.6,
      views: 750
    }
  ];

  // 筛选资源
  const filteredResources = recommendedResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          AI资源导航
        </h1>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索AI资源..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="md:w-1/4">
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

            {/* 难度筛选 */}
            <div className="md:w-1/4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficultyLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
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

        {/* 推荐资源 */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            {selectedCategory === 'all' ? '推荐资源' : `${categories.find(c => c.id === selectedCategory)?.name}资源`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <Link
                key={resource.id}
                to={resource.type === 'tutorial' ? `/tutorials/${resource.id}` : `/resources/${resource.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {resource.type === 'tutorial' ? '教程' : '工具'}
                    </span>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{resource.difficulty === 'beginner' ? '入门' : resource.difficulty === 'intermediate' ? '中级' : '高级'}</span>
                    <span>{resource.views} 次浏览</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigate;