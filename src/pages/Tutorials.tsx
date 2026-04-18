import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, BookOpen, Star, TrendingUp } from 'lucide-react';

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // 模拟教程数据
  const tutorials = [
    {
      id: '1',
      title: 'AI基础入门教程',
      description: '从零基础开始学习AI的核心概念和应用',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20basics%20tutorial%20cover&image_size=landscape_16_9',
      category: '基础理论',
      difficulty: '入门',
      duration: 120, // 分钟
      view_count: 1200,
      like_count: 480,
      rating: 4.8
    },
    {
      id: '2',
      title: '机器学习实战',
      description: '通过实际项目学习机器学习算法和应用',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20practical%20guide&image_size=landscape_16_9',
      category: '机器学习',
      difficulty: '中级',
      duration: 180,
      view_count: 950,
      like_count: 380,
      rating: 4.7
    },
    {
      id: '3',
      title: '深度学习进阶',
      description: '深入理解深度学习原理和最新技术',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20learning%20advanced%20concepts&image_size=landscape_16_9',
      category: '深度学习',
      difficulty: '高级',
      duration: 240,
      view_count: 800,
      like_count: 320,
      rating: 4.9
    },
    {
      id: '4',
      title: '自然语言处理入门',
      description: '学习NLP的基础概念和常用技术',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20language%20processing%20tutorial&image_size=landscape_16_9',
      category: '自然语言处理',
      difficulty: '入门',
      duration: 90,
      view_count: 750,
      like_count: 300,
      rating: 4.6
    },
    {
      id: '5',
      title: '计算机视觉实战',
      description: '通过项目学习计算机视觉技术',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20vision%20practical%20guide&image_size=landscape_16_9',
      category: '计算机视觉',
      difficulty: '中级',
      duration: 150,
      view_count: 700,
      like_count: 280,
      rating: 4.7
    },
    {
      id: '6',
      title: 'AI模型部署',
      description: '学习如何部署和优化AI模型',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20model%20deployment%20guide&image_size=landscape_16_9',
      category: '模型部署',
      difficulty: '高级',
      duration: 120,
      view_count: 650,
      like_count: 260,
      rating: 4.8
    }
  ];

  const categories = ['all', '基础理论', '机器学习', '深度学习', '自然语言处理', '计算机视觉', '模型部署'];
  const difficultyLevels = ['all', '入门', '中级', '高级'];

  // 筛选教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          AI教程
        </h1>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索教程..."
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
                  <option key={category} value={category}>
                    {category === 'all' ? '全部分类' : category}
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
                  <option key={level} value={level}>
                    {level === 'all' ? '全部难度' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 教程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map(tutorial => (
            <Link
              key={tutorial.id}
              to={`/tutorials/${tutorial.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={tutorial.cover_image}
                  alt={tutorial.title}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {tutorial.category}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${tutorial.difficulty === '入门' ? 'bg-green-100 text-green-800' : tutorial.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{tutorial.duration} 分钟</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    <span>{tutorial.view_count} 次学习</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="font-medium">{tutorial.rating}</span>
                  </div>
                  <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    开始学习
                  </button>
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

export default Tutorials;