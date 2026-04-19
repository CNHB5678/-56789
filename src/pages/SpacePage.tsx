import { useState } from 'react'
import { Folder, Clock, FileText, Download, Share2, Trash2, Play, Pause, X, RefreshCw } from 'lucide-react'

const SpacePage = () => {
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState([
    {
      id: '1',
      type: '视频下载',
      status: 'completed',
      progress: 100,
      name: '示例视频.mp4',
      created_at: '2026-04-19 10:00:00',
      updated_at: '2026-04-19 10:05:00'
    },
    {
      id: '2',
      type: '音频提取',
      status: 'processing',
      progress: 65,
      name: '示例音频.mp3',
      created_at: '2026-04-19 10:10:00',
      updated_at: '2026-04-19 10:12:00'
    },
    {
      id: '3',
      type: '视频去水印',
      status: 'queued',
      progress: 0,
      name: '去水印视频.mp4',
      created_at: '2026-04-19 10:15:00',
      updated_at: '2026-04-19 10:15:00'
    }
  ])
  const [files, setFiles] = useState([
    {
      id: '1',
      name: '示例视频.mp4',
      size: '10.5 MB',
      type: 'video/mp4',
      created_at: '2026-04-19 10:05:00',
      share_url: 'https://example.com/share/abc123',
      share_expires_at: '2026-04-20 10:05:00'
    },
    {
      id: '2',
      name: '示例音频.mp3',
      size: '5.2 MB',
      type: 'audio/mp3',
      created_at: '2026-04-19 09:30:00',
      share_url: null,
      share_expires_at: null
    },
    {
      id: '3',
      name: '字幕文件.srt',
      size: '128 KB',
      type: 'text/srt',
      created_at: '2026-04-19 09:00:00',
      share_url: null,
      share_expires_at: null
    }
  ])

  const handleTaskAction = (taskId: string, action: string) => {
    // 模拟任务操作
    console.log(`Task ${taskId} action: ${action}`)
  }

  const handleFileAction = (fileId: string, action: string) => {
    // 模拟文件操作
    console.log(`File ${fileId} action: ${action}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'queued':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">个人空间</h1>
        <p className="text-gray-600">任务管理、文件管理和历史记录</p>
      </div>

      {/* 个人空间选项卡 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tasks')}
          >
            任务管理
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('files')}
          >
            文件管理
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            历史记录
          </button>
        </div>

        {/* 任务管理 */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">任务列表</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{task.name}</h4>
                        <p className="text-sm text-gray-500">{task.type} · {task.created_at}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : task.status === 'queued' ? '队列中' : '失败'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{task.progress}%</span>
                      <div className="flex space-x-2">
                        {task.status === 'processing' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'pause')}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Pause size={16} />
                          </button>
                        )}
                        {task.status === 'queued' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'start')}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Play size={16} />
                          </button>
                        )}
                        {(task.status === 'processing' || task.status === 'queued') && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'cancel')}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {task.status === 'failed' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'retry')}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'download')}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 文件管理 */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">文件列表</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        文件名
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        大小
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (
                      <tr key={file.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.type.split('/')[1].toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFileAction(file.id, 'download')}
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleFileAction(file.id, 'share')}
                              className="text-green-600 hover:text-green-900 p-1"
                            >
                              <Share2 size={16} />
                            </button>
                            <button
                              onClick={() => handleFileAction(file.id, 'delete')}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">历史记录</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{task.type}</h4>
                        <p className="text-sm text-gray-500">{task.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : task.status === 'queued' ? '队列中' : '失败'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>创建时间: {task.created_at}</span>
                      <span>更新时间: {task.updated_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 存储空间信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Folder className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">存储空间</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">已用空间</span>
              <span className="font-medium text-gray-800">15.8 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">总空间</span>
              <span className="font-medium text-gray-800">10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0.16%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">任务统计</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">今日任务</span>
              <span className="font-medium text-gray-800">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">总任务数</span>
              <span className="font-medium text-gray-800">128</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">成功率</span>
              <span className="font-medium text-green-600">98%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">文件统计</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">视频文件</span>
              <span className="font-medium text-gray-800">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">音频文件</span>
              <span className="font-medium text-gray-800">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">其他文件</span>
              <span className="font-medium text-gray-800">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpacePage