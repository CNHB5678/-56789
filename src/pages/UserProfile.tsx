import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, MessageSquare, History, Edit, Settings, LogOut, Send, Search } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 模拟用户数据
  const [user] = useState({
    id: id || 'user1',
    username: 'AI爱好者',
    email: 'ai@example.com',
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: '热爱人工智能技术，专注于AI工具的研究和应用。',
    created_at: '2023-01-01'
  });

  // 模拟评论历史
  const [comments] = useState([
    {
      id: 'c1',
      resource_id: '1',
      resource_title: 'OpenAI GPT-4 官方文档',
      content: '非常详细的文档，对我理解GPT-4的能力和使用方法很有帮助。',
      created_at: '2024-01-02'
    },
    {
      id: 'c2',
      resource_id: '2',
      resource_title: 'AI绘画教程：从入门到精通',
      content: '教程写得很详细，跟着步骤操作成功生成了第一张AI绘画作品。',
      created_at: '2024-01-05'
    }
  ]);

  // 模拟消息
  const [messages] = useState([
    {
      id: 'm1',
      sender_id: 'user2',
      sender_name: '开发者小明',
      sender_avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: '你好，关于GPT-4的使用，我有一些问题想请教你。',
      read: false,
      created_at: '2024-01-10'
    },
    {
      id: 'm2',
      sender_id: 'user3',
      sender_name: 'AI研究员',
      sender_avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      content: '谢谢你分享的AI工具集，非常实用！',
      read: true,
      created_at: '2024-01-09'
    }
  ]);

  const [activeTab, setActiveTab] = useState('comments');
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Profile Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="mb-12 rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={user.avatar_url} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <Edit size={16} />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
                    <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
                      <MessageSquare size={16} /> 发消息
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{user.bio}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    加入于 {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">12</span>
                      <span className="text-gray-500">资源</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">28</span>
                      <span className="text-gray-500">评论</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800">56</span>
                      <span className="text-gray-500">关注者</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 font-medium transition-colors ${activeTab === 'comments' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'}
              `}
            >
              评论历史
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-medium transition-colors ${activeTab === 'messages' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'}
              `}
            >
              消息中心
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-colors ${activeTab === 'settings' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'}
              `}
            >
              账号设置
            </button>
          </div>

          {/* Tab Content */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">评论历史</h2>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <Link 
                          to={`/resource/${comment.resource_id}`}
                          className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {comment.resource_title}
                        </Link>
                        <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="flex h-[600px]">
                {/* Message List */}
                <div className="w-1/3 border-r border-gray-200 p-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="搜索消息..."
                      className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${selectedMessage?.id === message.id 
                          ? 'bg-blue-50 border border-blue-100' 
                          : 'hover:bg-gray-50'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={message.sender_avatar} 
                              alt={message.sender_name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-800 truncate">{message.sender_name}</p>
                              <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.content}</p>
                          </div>
                          {!message.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Detail */}
                <div className="w-2/3 flex flex-col">
                  {selectedMessage ? (
                    <>
                      {/* Message Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={selectedMessage.sender_avatar} 
                            alt={selectedMessage.sender_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{selectedMessage.sender_name}</p>
                          <p className="text-xs text-gray-500">{new Date(selectedMessage.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={selectedMessage.sender_avatar} 
                              alt={selectedMessage.sender_name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-[80%] bg-gray-100 rounded-lg p-3">
                            <p className="text-gray-700">{selectedMessage.content}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">{new Date(selectedMessage.created_at).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="输入消息..."
                              className="w-full px-4 py-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            />
                            <button 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      选择一条消息开始对话
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">账号设置</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-100 rounded-xl">
                    <h3 className="font-medium text-gray-800 mb-3">个人信息</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                        <input 
                          type="text" 
                          defaultValue={user.username}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                        <input 
                          type="email" 
                          defaultValue={user.email}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                        <textarea 
                          defaultValue={user.bio}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl">
                    <h3 className="font-medium text-gray-800 mb-3">账号安全</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">修改密码</span>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          点击修改
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">绑定手机号</span>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          立即绑定
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl">
                    <h3 className="font-medium text-gray-800 mb-3">其他设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">通知设置</span>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          点击修改
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">隐私设置</span>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          点击修改
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="w-full py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                      <LogOut size={18} /> 退出登录
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;