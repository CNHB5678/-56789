import { Link } from 'react-router-dom';
import { Users, MessageSquare, UserPlus, Award, BarChart3 } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Social = () => {
  const { user } = useUserStore();

  if (!user) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          社交中心
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 好友管理 */}
          <Link to="/social/friends" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              好友管理
            </h3>
            <p className="text-gray-600">
              查看好友列表，发送好友请求
            </p>
          </Link>

          {/* 消息中心 */}
          <Link to="/social/messages" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              消息中心
            </h3>
            <p className="text-gray-600">
              查看和发送私信消息
            </p>
          </Link>

          {/* 用户等级 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              用户等级
            </h3>
            <p className="text-gray-600 mb-4">
              当前等级: {user.level}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-700 h-2 rounded-full" 
                style={{ width: `${(user.experience % 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              经验值: {user.experience} / {user.level * 100}
            </p>
          </div>

          {/* 社区统计 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              社区统计
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">在线用户</span>
                <span className="font-medium">128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">今日活跃</span>
                <span className="font-medium">512</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总用户数</span>
                <span className="font-medium">10,240</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            最近活动
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-gray-700">
                  <span className="font-medium text-blue-900">AI爱好者</span> 成为了你的好友
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  2小时前
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-gray-700">
                  <span className="font-medium text-blue-900">开发者</span> 给你发送了一条消息
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  5小时前
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="text-gray-700">
                  你获得了 <span className="font-medium text-blue-900">学习达人</span> 成就
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  昨天
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;