import { useState } from 'react'
import { User, Download, Bell, Settings as SettingsIcon, Save, X } from 'lucide-react'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [userInfo, setUserInfo] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    role: '免费用户'
  })
  const [downloadSettings, setDownloadSettings] = useState({
    defaultQuality: 'highest',
    defaultNoWatermark: true,
    defaultNoAudio: false,
    saveToSpace: true,
    downloadDir: '默认目录'
  })
  const [notificationSettings, setNotificationSettings] = useState({
    taskComplete: true,
    taskFailed: true,
    systemUpdates: false,
    promotional: false
  })

  const handleSaveSettings = () => {
    // 模拟保存设置
    console.log('保存设置:', { userInfo, downloadSettings, notificationSettings })
    alert('设置保存成功！')
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">个人设置</h1>
        <p className="text-gray-600">管理个人信息、下载设置和通知偏好</p>
      </div>

      {/* 设置选项卡 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            个人信息
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'download' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('download')}
          >
            下载设置
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'notification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('notification')}
          >
            通知设置
          </button>
        </div>

        {/* 个人信息 */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4">个人信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户类型</label>
                  <input
                    type="text"
                    value={userInfo.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <input
                    type="password"
                    placeholder="输入新密码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 下载设置 */}
        {activeTab === 'download' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4">下载设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">默认画质</label>
                  <select
                    value={downloadSettings.defaultQuality}
                    onChange={(e) => setDownloadSettings({ ...downloadSettings, defaultQuality: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="highest">最高画质</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="defaultNoWatermark"
                      checked={downloadSettings.defaultNoWatermark}
                      onChange={(e) => setDownloadSettings({ ...downloadSettings, defaultNoWatermark: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="defaultNoWatermark" className="ml-2 text-gray-700">
                      默认无水印
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="defaultNoAudio"
                      checked={downloadSettings.defaultNoAudio}
                      onChange={(e) => setDownloadSettings({ ...downloadSettings, defaultNoAudio: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="defaultNoAudio" className="ml-2 text-gray-700">
                      默认去声
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveToSpace"
                      checked={downloadSettings.saveToSpace}
                      onChange={(e) => setDownloadSettings({ ...downloadSettings, saveToSpace: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="saveToSpace" className="ml-2 text-gray-700">
                      默认保存到个人空间
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">下载目录</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={downloadSettings.downloadDir}
                      onChange={(e) => setDownloadSettings({ ...downloadSettings, downloadDir: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200">
                      浏览
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通知设置 */}
        {activeTab === 'notification' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4">通知设置</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">任务完成通知</label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.taskComplete}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, taskComplete: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">任务失败通知</label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.taskFailed}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, taskFailed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">系统更新通知</label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemUpdates}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">促销活动通知</label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.promotional}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, promotional: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 保存按钮 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 flex items-center space-x-2"
          >
            <Save size={18} />
            <span>保存设置</span>
          </button>
        </div>
      </div>

      {/* 账户安全 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">账户安全</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">两步验证</span>
              <span className="text-gray-500 text-sm">未启用</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">登录设备</span>
              <span className="text-gray-500 text-sm">1 台设备</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">密码更新</span>
              <span className="text-gray-500 text-sm">30 天前</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <SettingsIcon className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">系统设置</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">语言</span>
              <span className="text-gray-500 text-sm">简体中文</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">主题</span>
              <span className="text-gray-500 text-sm">浅色模式</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">版本</span>
              <span className="text-gray-500 text-sm">v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage