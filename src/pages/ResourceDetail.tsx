import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ThumbsUp, MessageSquare, Share2, ChevronRight, ChevronLeft, Image, Video, Send, Download, Code, Clock } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const [resource, setResource] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');

  // 模拟资源数据
  useEffect(() => {
    // 模拟获取资源数据
    setResource({
      id: id,
      name: 'AI绘画工具',
      description: '基于 Stable Diffusion 的在线绘画工具，支持多种风格和参数调整',
      url: 'https://example.com/ai-art',
      icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20art%20tool%20icon&image_size=square',
      category: '创意工具',
      features: [
        '支持多种艺术风格',
        '可调整各种参数',
        '支持高分辨率输出',
        '提供API接口',
        '支持批量生成'
      ],
      usageGuide: '1. 访问官方网站\n2. 注册账号\n3. 选择艺术风格\n4. 输入提示词\n5. 调整参数\n6. 生成图片\n7. 下载或分享',
      view_count: 2500,
      like_count: 1200,
      rating: 4.9,
      author: {
        id: '1',
        username: 'AI工具开发者',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20tool%20developer%20avatar&image_size=square'
      }
    });

    // 模拟获取评论数据
    setComments([
      {
        id: '1',
        content: '这个工具非常好用，生成的图片质量很高！',
        user: {
          id: '2',
          username: '创意设计师',
          avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20designer%20avatar&image_size=square'
        },
        created_at: '2024-01-01T10:00:00Z',
        like_count: 15
      },
      {
        id: '2',
        content: '操作简单，效果惊艳，推荐给所有需要创意灵感的人！',
        user: {
          id: '3',
          username: '艺术家',
          avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=artist%20avatar&image_size=square'
        },
        created_at: '2024-01-02T15:30:00Z',
        like_count: 10
      }
    ]);
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    const newComment = {
      id: Date.now().toString(),
      content: commentText,
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url
      },
      created_at: new Date().toISOString(),
      like_count: 0
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  if (!resource) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 资源头部 */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {resource.name}
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                {resource.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {resource.category}
                </span>
                <div className="flex items-center">
                  <Download size={16} className="mr-1" />
                  <span>{resource.view_count} 次使用</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-400" />
                  <span>{resource.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src={resource.author.avatar_url} 
                  alt={resource.author.username} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{resource.author.username}</p>
                  <p className="text-sm text-blue-100">工具开发者</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <img 
                        src={resource.icon} 
                        alt={resource.name} 
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    访问工具
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 资源内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧内容 */}
          <div className="lg:w-2/3">
            {/* 功能特点 */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                功能特点
              </h2>
              <ul className="space-y-3">
                {resource.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 使用指南 */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                使用指南
              </h2>
              <div className="prose max-w-none">
                {resource.usageGuide.split('\n').map((line: string, index: number) => (
                  <p key={index} className="text-gray-700 mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* 评论区域 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                用户评价 ({comments.length})
              </h3>
              
              {/* 评论输入 */}
              <div className="mb-8">
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="flex gap-4">
                    <img 
                      src={user.avatar_url || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder="写下你的评价..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      ></textarea>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-2">
                          <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Image size={18} className="text-gray-600" />
                          </button>
                          <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Video size={18} className="text-gray-600" />
                          </button>
                        </div>
                        <button 
                          type="submit" 
                          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          发布评价
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-600">
                    <Link to="/login" className="text-blue-700 hover:underline">登录</Link> 后才能发表评价
                  </p>
                )}
              </div>

              {/* 评论列表 */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img 
                      src={comment.user.avatar_url} 
                      alt={comment.user.username} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-900">{comment.user.username}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <ThumbsUp size={16} className="text-gray-600" />
                        </button>
                      </div>
                      <p className="mt-2 text-gray-700">
                        {comment.content}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <button className="hover:text-blue-700 transition-colors">
                          回复
                        </button>
                        <span className="mx-2">•</span>
                        <span>{comment.like_count} 人点赞</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                工具信息
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">分类</p>
                  <p className="font-medium">{resource.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">使用次数</p>
                  <p className="font-medium">{resource.view_count} 次</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">评分</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="font-medium">{resource.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">开发者</p>
                  <div className="flex items-center gap-2">
                    <img 
                      src={resource.author.avatar_url} 
                      alt={resource.author.username} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium">{resource.author.username}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    访问工具
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;