import { useState } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Messages = () => {
  const { user } = useUserStore();
  const [selectedChat, setSelectedChat] = useState('1');
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: '1',
      user: {
        id: '2',
        username: 'AI爱好者',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20enthusiast%20avatar&image_size=square',
        status: 'online'
      },
      lastMessage: '你好，最近在学习什么AI技术？',
      lastMessageTime: '2小时前',
      unread: 2
    },
    {
      id: '2',
      user: {
        id: '3',
        username: '开发者',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=developer%20avatar&image_size=square',
        status: 'offline'
      },
      lastMessage: '我发现了一个很好的AI工具，推荐给你',
      lastMessageTime: '昨天',
      unread: 0
    },
    {
      id: '3',
      user: {
        id: '4',
        username: '设计师',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=designer%20avatar&image_size=square',
        status: 'online'
      },
      lastMessage: 'AI生成的设计素材真的很有用',
      lastMessageTime: '3天前',
      unread: 0
    }
  ];

  const messages = [
    {
      id: '1',
      senderId: '2',
      content: '你好，最近在学习什么AI技术？',
      timestamp: '2小时前',
      isOwn: false
    },
    {
      id: '2',
      senderId: '2',
      content: '我最近在研究深度学习的应用',
      timestamp: '2小时前',
      isOwn: false
    },
    {
      id: '3',
      senderId: user?.id,
      content: '我在学习机器学习基础，感觉有些难度',
      timestamp: '1小时前',
      isOwn: true
    },
    {
      id: '4',
      senderId: '2',
      content: '可以从简单的项目开始，逐步深入',
      timestamp: '1小时前',
      isOwn: false
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    // 这里可以添加发送消息的逻辑
    setMessageText('');
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          消息中心
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧聊天列表 */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px] flex flex-col">
              {/* 搜索框 */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索消息..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* 聊天列表 */}
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat === chat.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={chat.user.avatar_url}
                            alt={chat.user.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${chat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">{chat.user.username}</h4>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{chat.lastMessageTime}</p>
                        {chat.unread > 0 && (
                          <div className="mt-1 bg-blue-700 text-white text-xs font-medium px-2 py-0.5 rounded-full w-6 h-6 flex items-center justify-center">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧聊天界面 */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px] flex flex-col">
              {/* 聊天头部 */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedChatData?.user.avatar_url}
                      alt={selectedChatData?.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${selectedChatData?.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">{selectedChatData?.user.username}</h4>
                    <p className="text-xs text-gray-500">{selectedChatData?.user.status === 'online' ? '在线' : '离线'}</p>
                  </div>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isOwn ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 消息输入 */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="输入消息..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;