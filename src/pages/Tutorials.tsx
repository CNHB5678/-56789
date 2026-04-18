import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, BookOpen, Star, TrendingUp, ChevronRight, Heart, Play, Bookmark } from 'lucide-react';

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

  // 学习进度数据
  const [learningProgress, setLearningProgress] = useState({
    '1': 65,  // 65% 完成
    '2': 0,   // 未开始
    '3': 100, // 已完成
    '4': 30,  // 30% 完成
    '5': 0,   // 未开始
    '6': 0    // 未开始
  });

  // 收藏状态
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);

  // 卡片引用，用于动画效果
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 监听滚动，实现卡片渐入效果
  useEffect(() => {
    const handleScroll = () => {
      cardRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          if (isVisible) {
            ref.style.opacity = '1';
            ref.style.transform = 'translateY(0) scale(1)';
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 筛选教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // 切换收藏状态
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary-900 mb-12">
          AI教程
        </h1>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索教程..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="md:w-1/4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-4 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 appearance-none bg-white"
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
                className="w-full pl-4 pr-10 py-4 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 appearance-none bg-white"
              >
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? '全部难度' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 智能分类导航 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-primary-700 mb-4">快速分类</h3>
            <div className="flex flex-wrap gap-3">
              {categories.slice(1).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category ? 'bg-secondary-500 text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === 'all' ? 'bg-secondary-500 text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
              >
                全部
              </button>
            </div>
          </div>
        </div>

        {/* 教程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial, index) => {
            const progress = learningProgress[tutorial.id as keyof typeof learningProgress] || 0;
            const isCompleted = progress === 100;
            const isFavorite = favorites.includes(tutorial.id);
            
            return (
              <div
                key={tutorial.id}
                ref={el => cardRefs.current[index] = el}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-600 transform hover:translate-y-[-4px] hover:shadow-xl opacity-0 transform translate-y-10 scale-95"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Link to={`/tutorials/${tutorial.id}`} className="block group">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={tutorial.cover_image}
                      alt={tutorial.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* 预览播放按钮 */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play size={24} className="text-secondary-500" />
                      </div>
                    </div>
                    
                    {/* 学习进度条 */}
                    {progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-200">
                        <div 
                          className={`h-full transition-all duration-500 ${isCompleted ? 'bg-success-500' : 'bg-secondary-500'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                        {tutorial.category}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${tutorial.difficulty === '入门' ? 'bg-success-100 text-success-800' : tutorial.difficulty === '中级' ? 'bg-warning-100 text-warning-800' : 'bg-primary-800 text-white'}`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-primary-900 mb-3 line-clamp-2 group-hover:text-secondary-600 transition-colors duration-300">
                      {tutorial.title}
                    </h3>
                    
                    <p className="text-primary-600 mb-6 line-clamp-2">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-primary-600 mb-6">
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
                        <Star size={16} className="text-warning-500 mr-1" />
                        <span className="font-medium text-primary-900">{tutorial.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* 收藏按钮 */}
                        <button 
                          onClick={(e) => toggleFavorite(e, tutorial.id)}
                          className={`p-2 rounded-full transition-all duration-300 ${isFavorite ? 'bg-secondary-100 text-secondary-500' : 'bg-primary-100 text-primary-400 hover:bg-primary-200'}`}
                          aria-label={isFavorite ? '取消收藏' : '收藏'}
                        >
                          <Heart size={18} />
                        </button>
                        
                        {/* 学习按钮 */}
                        <button className="bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2 hover:shadow-md">
                          {isCompleted ? '复习' : progress > 0 ? '继续学习' : '开始学习'}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
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

export default Tutorials;