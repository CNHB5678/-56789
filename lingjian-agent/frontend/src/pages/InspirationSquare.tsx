import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Play,
  Sparkles,
  TrendingUp,
  Clock,
  User,
  Smile,
  Send
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  emojis: string[];
  timestamp: Date;
  likes: number;
}

interface Work {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  likes: number;
  comments: Comment[];
  views: number;
  createdAt: Date;
  tags: string[];
}

const mockWorks: Work[] = [
  {
    id: '1',
    userId: 'user1',
    username: '视频创作者A',
    title: 'AI生成的创意短片',
    description: '使用灵剪Agent制作的一段创意视频，展现了AI在视频创作中的无限可能。',
    thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=创意短片',
    videoUrl: '#',
    likes: 128,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        username: '创意达人',
        content: '太棒了！',
        emojis: ['👍', '🎉'],
        timestamp: new Date('2026-05-13T10:00:00'),
        likes: 5
      }
    ],
    views: 1024,
    createdAt: new Date('2026-05-13'),
    tags: ['AI创意', '短片', '科技']
  },
  {
    id: '2',
    userId: 'user2',
    username: '内容创作者B',
    title: '产品展示视频',
    description: '为新品发布会制作的宣传视频，包含多个动画效果。',
    thumbnail: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=产品展示',
    videoUrl: '#',
    likes: 89,
    comments: [],
    views: 567,
    createdAt: new Date('2026-05-12'),
    tags: ['产品', '展示', '宣传']
  }
];

const popularTags = ['AI创作', '动画', '短片', '科技', '创意', '教程', 'Vlog', '音乐'];

export default function InspirationSquare() {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');
  const [works, setWorks] = useState<Work[]>(mockWorks);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuthStore();

  const popularEmojis = ['👍', '❤️', '🎉', '😂', '😮', '😢', '🙏', '💯'];

  const handleLike = (workId: string) => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    setWorks(works.map(work => 
      work.id === workId 
        ? { ...work, likes: work.likes + 1 }
        : work
    ));
    toast.success('已点赞！');
  };

  const handleComment = (workId: string) => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    if (!newComment.trim() && selectedEmojis.length === 0) {
      toast.error('请输入评论内容或选择表情');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      username: user?.username || '匿名用户',
      content: newComment,
      emojis: selectedEmojis,
      timestamp: new Date(),
      likes: 0
    };

    setWorks(works.map(work =>
      work.id === workId
        ? { ...work, comments: [...work.comments, comment] }
        : work
    ));

    setNewComment('');
    setSelectedEmojis([]);
    toast.success('评论成功！');
  };

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">灵感广场</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'trending'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              热门
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'latest'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              最新
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {works.map(work => (
          <div key={work.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{work.username}</h3>
                    <p className="text-sm text-gray-500">{new Date(work.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="relative w-48 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer group flex-shrink-0">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary-500 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{work.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{work.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {work.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(work.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{work.likes}</span>
                      </button>
                      <button
                        onClick={() => setShowComments(showComments === work.id ? null : work.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{work.comments.length}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>分享</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Play className="w-3 h-3" />
                      <span>{work.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {showComments === work.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {work.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {comment.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {comment.content}
                          </p>
                          {comment.emojis.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {comment.emojis.map((emoji, idx) => (
                                <span key={idx} className="text-base">{emoji}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <button className="text-xs text-gray-500 hover:text-primary-500">
                              回复
                            </button>
                            <button className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {popularEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => toggleEmoji(emoji)}
                          className={`text-base p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            selectedEmojis.includes(emoji) ? 'bg-gray-200 dark:bg-gray-600' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                      <button className="text-base p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                        <Smile className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="发表你的评论..."
                        className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleComment(work.id);
                        }}
                      />
                      <button
                        onClick={() => handleComment(work.id)}
                        className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedEmojis.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        选择的表情: {selectedEmojis.join(' ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
