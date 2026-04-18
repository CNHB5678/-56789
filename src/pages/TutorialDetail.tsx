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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* 教程头部 */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {tutorial.title}
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                {tutorial.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="bg-primary-600 text-white text-xs font-medium px-4 py-2 rounded-full">
                  {tutorial.category}
                </span>
                <span className={`text-xs font-medium px-4 py-2 rounded-full ${tutorial.difficulty === '入门' ? 'bg-green-600 text-white' : tutorial.difficulty === '中级' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}`}>
                  {tutorial.difficulty}
                </span>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{tutorial.duration} 分钟</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{tutorial.view_count} 次学习</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-secondary-400" />
                  <span>{tutorial.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src={tutorial.author.avatar_url} 
                  alt={tutorial.author.username} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="font-medium text-lg">{tutorial.author.username}</p>
                  <p className="text-sm text-primary-100">AI专家</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src={tutorial.cover_image} 
                  alt={tutorial.title} 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary-900 mb-3">
                      学习进度
                    </h3>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-3 text-sm text-neutral-600">
                      <span>{progress}% 完成</span>
                      <span>第 {currentSection + 1} / {tutorial.sections.length} 节</span>
                    </div>
                  </div>
                  <button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 rounded-lg transition-colors duration-300 shadow-md">
                    继续学习
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 教程内容 */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧章节导航 */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-primary-900 mb-6">
                章节导航
              </h3>
              <ul className="space-y-3">
                {tutorial.sections.map((section: any, index: number) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${currentSection === index ? 'bg-primary-100 text-primary-700 shadow-sm' : 'hover:bg-neutral-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.title}</span>
                        {currentSection === index && (
                          <ChevronRight size={18} className="text-primary-600" />
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
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-primary-900">
                  {tutorial.sections[currentSection].title}
                </h2>
                <div className="flex gap-3">
                  <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-300">
                    <ThumbsUp size={20} className="text-neutral-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-300">
                    <Share2 size={20} className="text-neutral-600" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  {tutorial.sections[currentSection].content}
                </p>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  这里是详细的教程内容，包括理论知识、代码示例和实践练习等。通过学习这些内容，你将对AI有更深入的了解。
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  建议在学习过程中积极思考，尝试将所学知识应用到实际项目中，这样可以更好地掌握AI技术。
                </p>
              </div>
              <div className="flex justify-between mt-10">
                <button 
                  className={`flex items-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${currentSection === 0 ? 'text-neutral-400 cursor-not-allowed' : 'hover:bg-neutral-50'}`}
                  disabled={currentSection === 0}
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                >
                  <ChevronLeft size={18} />
                  上一节
                </button>
                <button 
                  className={`flex items-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${currentSection === tutorial.sections.length - 1 ? 'text-neutral-400 cursor-not-allowed' : 'hover:bg-neutral-50'}`}
                  disabled={currentSection === tutorial.sections.length - 1}
                  onClick={() => setCurrentSection(Math.min(tutorial.sections.length - 1, currentSection + 1))}
                >
                  下一节
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                  学习进度
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-primary-700 font-medium min-w-[40px] text-center">{progress}%</span>
                </div>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-8">
                评论 ({comments.length})
              </h3>
              
              {/* 评论输入 */}
              <div className="mb-10">
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="flex gap-4">
                    <img 
                      src={user.avatar_url || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'} 
                      alt={user.username} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder="写下你的评论..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-300"
                        rows={3}
                      ></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-3">
                          <button type="button" className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-300">
                            <Image size={20} className="text-neutral-600" />
                          </button>
                          <button type="button" className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-300">
                            <Video size={20} className="text-neutral-600" />
                          </button>
                        </div>
                        <button 
                          type="submit" 
                          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg transition-colors duration-300 font-medium"
                        >
                          发布评论
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p className="text-neutral-600">
                    <Link to="/login" className="text-primary-700 hover:underline font-medium">登录</Link> 后才能发表评论
                  </p>
                )}
              </div>

              {/* 评论列表 */}
              <div className="space-y-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img 
                      src={comment.user.avatar_url} 
                      alt={comment.user.username} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-primary-900">{comment.user.username}</h4>
                          <p className="text-sm text-neutral-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-300">
                          <ThumbsUp size={18} className="text-neutral-600" />
                        </button>
                      </div>
                      <p className="mt-3 text-neutral-700 leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="mt-3 text-sm text-neutral-500">
                        <button className="hover:text-primary-700 transition-colors duration-300 font-medium">
                          回复
                        </button>
                        <span className="mx-3">•</span>
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