import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import { ExternalLink, Star, MessageCircle, Heart, Share2, User as UserIcon, Send } from 'lucide-react';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 模拟资源数据
  const [resource] = useState({
    id: id || '1',
    title: 'OpenAI GPT-4 官方文档',
    description: 'OpenAI最新的GPT-4模型官方文档，包含API使用指南、参数说明和最佳实践。GPT-4是OpenAI推出的最先进的语言模型，具有更强的推理能力、更大的上下文窗口和更准确的回答。本文档详细介绍了如何使用GPT-4 API，包括请求格式、参数设置、费率计算等内容。',
    url: 'https://openai.com/gpt-4',
    category: '资源',
    tags: ['OpenAI', 'GPT-4', 'API', '文档', '人工智能', '语言模型'],
    user_id: 'user1',
    created_at: '2024-01-01'
  });

  // 模拟评论数据
  const [comments, setComments] = useState([
    {
      id: 'c1',
      resource_id: id || '1',
      user_id: 'user2',
      username: 'AI爱好者',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: '非常详细的文档，对我理解GPT-4的能力和使用方法很有帮助。',
      created_at: '2024-01-02'
    },
    {
      id: 'c2',
      resource_id: id || '1',
      user_id: 'user3',
      username: '开发者小明',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'API文档写得很清晰，示例也很实用，已经成功集成到我的项目中了。',
      created_at: '2024-01-03'
    }
  ]);

  // 模拟相关资源
  const [relatedResources] = useState([
    {
      id: '7',
      title: 'OpenAI API 最佳实践',
      description: '介绍如何优化OpenAI API的使用，包括提示工程、速率限制和成本控制等方面。',
      url: 'https://example.com/openai-best-practices',
      category: '资源',
      tags: ['OpenAI', 'API', '最佳实践', '资源'],
      user_id: 'user4',
      created_at: '2024-01-07'
    },
    {
      id: '8',
      title: 'GPT-4 vs GPT-3.5：详细对比',
      description: '详细对比GPT-4和GPT-3.5的性能差异、功能特点和适用场景。',
      url: 'https://example.com/gpt4-vs-gpt35',
      category: '资讯',
      tags: ['GPT-4', 'GPT-3.5', '对比', '资讯'],
      user_id: 'user5',
      created_at: '2024-01-08'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: `c${comments.length + 1}`,
        resource_id: id || '1',
        user_id: 'currentUser',
        username: '当前用户',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        content: newComment,
        created_at: new Date().toISOString().split('T')[0]
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Resource Detail Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">首页</Link>
            <span>/</span>
            <Link to={`/category/${resource.category}`} className="hover:text-blue-600 transition-colors">{resource.category}</Link>
            <span>/</span>
            <span className="text-gray-700">{resource.title}</span>
          </div>

          {/* Resource Card */}
          <div className="mb-12 rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8">
              {/* Category Badge */}
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {resource.category}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                {resource.title}
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {resource.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all"
                >
                  访问链接 <ExternalLink size={18} />
                </a>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                  <Heart size={18} /> 收藏
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                  <Share2 size={18} /> 分享
                </button>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">OpenAI</p>
                    <p className="text-xs text-gray-500">{new Date(resource.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle size={16} />
                    <span className="text-sm">{comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12 rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">用户评论</h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="分享你的想法..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        发表评论 <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img 
                        src={comment.avatar_url} 
                        alt={comment.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-800">{comment.username}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                          回复
                        </button>
                        <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                          点赞
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Resources */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">相关资源</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedResources.map((resource) => (
                  <ResourceCard key={resource.id} {...resource} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetail;