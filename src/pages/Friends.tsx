import { useState } from 'react';
import { Users, UserPlus, Check, X, Search } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Friends = () => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'

  const friends = [
    {
      id: '1',
      username: 'AI爱好者',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20enthusiast%20avatar&image_size=square',
      status: 'online',
      lastSeen: '2小时前'
    },
    {
      id: '2',
      username: '开发者',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=developer%20avatar&image_size=square',
      status: 'offline',
      lastSeen: '昨天'
    },
    {
      id: '3',
      username: '设计师',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=designer%20avatar&image_size=square',
      status: 'online',
      lastSeen: '刚刚'
    }
  ];

  const friendRequests = [
    {
      id: '1',
      user: {
        id: '4',
        username: '数据科学家',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20scientist%20avatar&image_size=square'
      },
      requestTime: '1小时前'
    },
    {
      id: '2',
      user: {
        id: '5',
        username: 'AI研究员',
        avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20researcher%20avatar&image_size=square'
      },
      requestTime: '3小时前'
    }
  ];

  const handleAcceptRequest = (requestId: string) => {
    // 处理接受好友请求的逻辑
    console.log('Accept request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // 处理拒绝好友请求的逻辑
    console.log('Reject request:', requestId);
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          好友管理
        </h1>

        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'friends' ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            好友列表
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'requests' ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            好友请求 ({friendRequests.length})
          </button>
        </div>

        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索好友..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {activeTab === 'friends' ? (
            <div>
              {/* 好友列表 */}
              <div className="divide-y divide-gray-100">
                {friends.map((friend) => (
                  <div key={friend.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={friend.avatar_url}
                            alt={friend.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">{friend.username}</h4>
                          <p className="text-sm text-gray-500">
                            {friend.status === 'online' ? '在线' : `最后在线: ${friend.lastSeen}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-700 hover:bg-blue-800 text-white py-1.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-1">
                          <Users size={16} />
                          聊天
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-4 rounded-lg transition-colors text-sm">
                          更多
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* 好友请求列表 */}
              <div className="divide-y divide-gray-100">
                {friendRequests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.user.avatar_url}
                          alt={request.user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-blue-900">{request.user.username}</h4>
                          <p className="text-sm text-gray-500">
                            请求时间: {request.requestTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 添加好友 */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            添加好友
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="输入用户名或邮箱..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
              <UserPlus size={18} />
              发送请求
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;