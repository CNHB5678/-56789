import { Link } from 'react-router-dom';
import { Book, Code, Database, Zap, TrendingUp, Clock, Users } from 'lucide-react';

const Home = () => {
  // 模拟数据
  const popularTutorials = [
    {
      id: '1',
      title: 'AI基础入门教程',
      description: '从零基础开始学习AI的核心概念和应用',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20tutorial%20cover%20with%20neural%20network%20visualization&image_size=landscape_16_9',
      view_count: 1200,
      difficulty: '入门'
    },
    {
      id: '2',
      title: '机器学习实战',
      description: '通过实际项目学习机器学习算法和应用',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20practical%20guide%20cover&image_size=landscape_16_9',
      view_count: 950,
      difficulty: '中级'
    },
    {
      id: '3',
      title: '深度学习进阶',
      description: '深入理解深度学习原理和最新技术',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20learning%20advanced%20concepts%20cover&image_size=landscape_16_9',
      view_count: 800,
      difficulty: '高级'
    }
  ];

  const latestResources = [
    {
      id: '1',
      name: 'AI绘画工具',
      description: '基于 Stable Diffusion 的在线绘画工具',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20art%20tool%20icon&image_size=square',
      category: '创意工具'
    },
    {
      id: '2',
      name: 'AI代码助手',
      description: '智能代码生成和调试工具',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20code%20assistant%20icon&image_size=square',
      category: '开发工具'
    },
    {
      id: '3',
      name: 'AI翻译器',
      description: '多语言智能翻译工具',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20translator%20icon&image_size=square',
      category: '实用工具'
    },
    {
      id: '4',
      name: 'AI聊天机器人',
      description: '智能对话助手',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20icon&image_size=square',
      category: '对话工具'
    }
  ];

  const categories = [
    { name: 'AI教程', icon: <Book />, link: '/tutorials' },
    { name: '开发工具', icon: <Code />, link: '/resources' },
    { name: '数据资源', icon: <Database />, link: '/resources' },
    { name: '实用工具', icon: <Zap />, link: '/resources' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 英雄区 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              探索AI的无限可能
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              发现优质AI教程、实用工具和资源，与社区一起学习成长
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/navigate" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                开始探索
              </Link>
              <Link to="/tutorials" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 font-medium py-3 px-6 rounded-lg transition-all">
                浏览教程
              </Link>
            </div>
          </div>
        </div>
        {/* 装饰元素 */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <div className="w-full h-full bg-gradient-to-l from-blue-500 to-transparent"></div>
        </div>
      </section>

      {/* 导航分类 */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          探索分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.link}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-blue-900">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门教程 */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900">
              热门教程
            </h2>
            <Link to="/tutorials" className="text-blue-700 hover:text-blue-900 flex items-center gap-2">
              查看全部 <TrendingUp size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularTutorials.map((tutorial) => (
              <Link 
                key={tutorial.id} 
                to={`/tutorials/${tutorial.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={tutorial.cover_image} 
                    alt={tutorial.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {tutorial.difficulty}
                    </span>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock size={14} className="mr-1" />
                      {tutorial.view_count} 次学习
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tutorial.description}
                  </p>
                  <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors">
                    开始学习
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最新资源 */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">
            最新资源工具
          </h2>
          <Link to="/resources" className="text-blue-700 hover:text-blue-900 flex items-center gap-2">
            查看全部 <TrendingUp size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestResources.map((resource) => (
            <Link 
              key={resource.id} 
              to={`/resources/${resource.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 mb-4">
                <img 
                  src={resource.icon} 
                  alt={resource.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {resource.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {resource.description}
              </p>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {resource.category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 社区部分 */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            加入我们的AI社区
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            与志同道合的AI爱好者一起学习、交流和成长，分享你的见解和经验
          </p>
          <Link to="/social" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 inline-block">
            加入社区
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;