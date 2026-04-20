import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter, ChevronDown } from 'lucide-react';

const Home: React.FC = () => {
  // 模拟资源数据
  const [resources, setResources] = useState([
    {
      id: '1',
      title: 'OpenAI GPT-4 官方文档',
      description: 'OpenAI最新的GPT-4模型官方文档，包含API使用指南、参数说明和最佳实践。',
      url: 'https://openai.com/gpt-4',
      category: '资源',
      tags: ['OpenAI', 'GPT-4', 'API', '文档'],
      user_id: 'user1',
      created_at: '2024-01-01'
    },
    {
      id: '2',
      title: 'AI绘画教程：从入门到精通',
      description: '详细介绍如何使用Midjourney、DALL-E等AI工具进行绘画创作，适合初学者。',
      url: 'https://example.com/ai-art-tutorial',
      category: '教程',
      tags: ['AI绘画', 'Midjourney', 'DALL-E', '教程'],
      user_id: 'user2',
      created_at: '2024-01-02'
    },
    {
      id: '3',
      title: 'ChatGPT 插件开发指南',
      description: '教你如何开发ChatGPT插件，扩展AI助手的功能，打造个性化的AI工具。',
      url: 'https://example.com/chatgpt-plugin-dev',
      category: '教程',
      tags: ['ChatGPT', '插件开发', 'AI', '教程'],
      user_id: 'user3',
      created_at: '2024-01-03'
    },
    {
      id: '4',
      title: 'AI工具集：100个实用AI工具推荐',
      description: '精选100个实用的AI工具，涵盖办公、设计、编程、学习等多个领域。',
      url: 'https://example.com/ai-tools-collection',
      category: '工具',
      tags: ['AI工具', '工具集', '推荐', '资源'],
      user_id: 'user4',
      created_at: '2024-01-04'
    },
    {
      id: '5',
      title: '2024年AI发展趋势报告',
      description: '全面分析2024年AI领域的发展趋势，包括技术突破、应用场景和市场预测。',
      url: 'https://example.com/ai-trends-2024',
      category: '资讯',
      tags: ['AI趋势', '2024', '报告', '资讯'],
      user_id: 'user5',
      created_at: '2024-01-05'
    },
    {
      id: '6',
      title: 'AI编程助手对比：GitHub Copilot vs Cursor',
      description: '详细对比GitHub Copilot和Cursor这两款AI编程助手的功能、性能和使用体验。',
      url: 'https://example.com/ai-coding-assistants',
      category: '工具',
      tags: ['AI编程', 'GitHub Copilot', 'Cursor', '对比'],
      user_id: 'user6',
      created_at: '2024-01-06'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['全部', '教程', '工具', '资讯', '资源'];

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === '全部' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              发现全球优质AI资源
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              从AI教程、工具到最新资讯，我们为您精选了最有价值的AI资源，助您在AI时代保持领先。
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索AI资源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white border border-gray-200 shadow-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 mx-auto">
              加载更多 <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;