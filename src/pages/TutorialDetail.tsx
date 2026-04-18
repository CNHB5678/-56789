import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, Star, ThumbsUp, MessageSquare, Share2, ChevronRight, ChevronLeft, Image, Video, Send } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const TutorialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const [tutorial, setTutorial] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [currentSection, setCurrentSection] = useState(0);

  // 模拟教程数据
  useEffect(() => {
    // 模拟获取教程数据
    setTutorial({
      id: id,
      title: 'AI基础入门教程',
      description: '从零基础开始学习AI的核心概念和应用',
      content: '这是一个详细的AI基础入门教程，包含人工智能的基本概念、发展历史、主要技术领域和应用场景等内容。',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20basics%20tutorial%20cover&image_size=landscape_16_9',
      category: '基础理论',
      difficulty: '入门',
      duration: 120,
      author: {
        id: '1',
        username: 'AI专家',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20AI%20expert%20avatar&image_size=square'
      },
      sections: [
        { id: 1, title: 'AI概述', content: '人工智能的定义、发展历史和主要分支' },
        { id: 2, title: '机器学习基础', content: '机器学习的基本概念和工作原理' },
        { id: 3, title: '深度学习简介', content: '深度学习的基本原理和应用' },
        { id: 4, title: 'AI应用场景', content: 'AI在各个领域的应用案例' },
        { id: 5, title: '未来发展趋势', content: 'AI技术的发展方向和挑战' }
      ],
      view_count: 1200,
      like_count: 480,
      rating: 4.8
    });

    // 模拟获取评论数据
    setComments([
      {
        id: '1',
        content: '这是一个非常好的入门教程，内容清晰易懂！',
        user: {
          id: '2',
          username: '学习者1',
          avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%201&image_size=square'
        },
        created_at: '2024-01-01T10:00:00Z',
        like_count: 10
      },
      {
        id: '2',
        content: '感谢分享，对我帮助很大！',
        user: {
          id: '3',
          username: '学习者2',
          avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%202&image_size=square'
        },
        created_at: '2024-01-02T15:30:00Z',
        like_count: 5
      }
    ]);

    // 模拟学习进度
    setProgress(30);
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

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
    // 这里可以添加保存进度的逻辑
  };

  if (!tutorial) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 教程头部 */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {tutorial.title}
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                {tutorial.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {tutorial.category}
                </span>
                <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {tutorial.difficulty}
                </span>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{tutorial.duration} 分钟</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>{tutorial.view_count} 次学习</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-400" />
                  <span>{tutorial.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src={tutorial.author.avatar_url} 
                  alt={tutorial.author.username} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{tutorial.author.username}</p>
                  <p className="text-sm text-blue-100">AI专家</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={tutorial.cover_image} 
                  alt={tutorial.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      学习进度
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-700 h-2.5 rounded-full transition-all" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{progress}% 完成</span>
                      <span>第 {currentSection + 1} / {tutorial.sections.length} 节</span>
                    </div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors">
                    继续学习
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 教程内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧章节导航 */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                章节导航
              </h3>
              <ul className="space-y-2">
                {tutorial.sections.map((section: any, index: number) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${currentSection === index ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.title}</span>
                        {currentSection === index && (
                          <ChevronRight size={16} className="text-blue-700" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧内容和评论 */}
          <div className="lg:w-3/4">
            {/* 内容区域 */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {tutorial.sections[currentSection].title}
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ThumbsUp size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">
                  {tutorial.sections[currentSection].content}
                </p>
                <p className="text-gray-700 mb-6">
                  这里是详细的教程内容，包括理论知识、代码示例和实践练习等。通过学习这些内容，你将对AI有更深入的了解。
                </p>
                <p className="text-gray-700">
                  建议在学习过程中积极思考，尝试将所学知识应用到实际项目中，这样可以更好地掌握AI技术。
                </p>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${currentSection === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  disabled={currentSection === 0}
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                >
                  <ChevronLeft size={16} />
                  上一节
                </button>
                <button 
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${currentSection === tutorial.sections.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  disabled={currentSection === tutorial.sections.length - 1}
                  onClick={() => setCurrentSection(Math.min(tutorial.sections.length - 1, currentSection + 1))}
                >
                  下一节
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  学习进度
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-blue-700 font-medium">{progress}%</span>
                </div>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                评论 ({comments.length})
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
                        placeholder="写下你的评论..."
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
                          发布评论
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-600">
                    <Link to="/login" className="text-blue-700 hover:underline">登录</Link> 后才能发表评论
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
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;