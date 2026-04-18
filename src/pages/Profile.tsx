import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Calendar, Clock, BookOpen, Users, MessageSquare, Award, Settings, LogOut } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Profile = () => {
  const { user, logout } = useUserStore();
  const [learningStats, setLearningStats] = useState({
    coursesCompleted: 5,
    learningTime: 1200, // 分钟
    certificates: 3
  });
  const [friends, setFriends] = useState([
    {
      id: '1',
      username: 'AI爱好者',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20enthusiast%20avatar&image_size=square',
      status: 'online'
    },
    {
      id: '2',
      username: '开发者',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=developer%20avatar&image_size=square',
      status: 'offline'
    },
    {
      id: '3',
      username: '设计师',
      avatar_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=designer%20avatar&image_size=square',
      status: 'online'
    }
  ]);

  useEffect(() => {
    // 这里可以添加获取用户详细信息的逻辑
  }, []);

  if (!user) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          个人中心
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧个人信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 h-32"></div>
              <div className="px-6 py-4">
                <div className="flex justify-center -mt-16">
                  <img
                    src={user.avatar_url || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-bold text-blue-900">{user.username}</h2>
                  <p className="text-gray-600">等级 {user.level}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-700 h-2 rounded-full" 
                        style={{ width: `${(user.experience % 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      经验值: {user.experience} / {user.level * 100}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">在线时长</p>
                      <p className="font-medium">{Math.floor(user.online_time / 60)} 小时 {user.online_time % 60} 分钟</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">学习时长</p>
                      <p className="font-medium">{Math.floor(user.learning_time / 60)} 小时 {user.learning_time % 60} 分钟</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Edit size={16} />
                    编辑资料
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 学习统计 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-6">
                学习统计
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">已完成课程</p>
                      <p className="text-2xl font-bold text-blue-900">{learningStats.coursesCompleted}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">学习时长</p>
                      <p className="text-2xl font-bold text-blue-900">{Math.floor(learningStats.learningTime / 60)}h</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">获得证书</p>
                      <p className="text-2xl font-bold text-blue-900">{learningStats.certificates}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近学习 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-6">
                最近学习
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20basics%20tutorial%20cover&image_size=landscape_16_9"
                    alt="AI基础入门教程"
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">AI基础入门教程</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-2/3 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">30%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20practical%20guide&image_size=landscape_16_9"
                    alt="机器学习实战"
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">机器学习实战</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-2/3 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">60%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 好友列表 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-blue-900">
                  好友列表
                </h3>
                <Link to="/social/friends" className="text-blue-700 hover:text-blue-900 flex items-center gap-1">
                  查看全部
                </Link>
              </div>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar_url}
                          alt={friend.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></span>
                      </div>
                      <span className="font-medium text-blue-900">{friend.username}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/profile/${friend.id}`} className="text-gray-600 hover:text-blue-700">
                        <User size={18} />
                      </Link>
                      <Link to={`/social/messages`} className="text-gray-600 hover:text-blue-700">
                        <MessageSquare size={18} />
                      </Link>
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

export default Profile;