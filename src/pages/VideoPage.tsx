import { useState } from 'react'
import { Video, Download, FileText, Trash2, Repeat, Clock, Crop, Eye } from 'lucide-react'

const VideoPage = () => {
  const [activeTab, setActiveTab] = useState('watermark')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('')
  const [processedVideos, setProcessedVideos] = useState<any[]>([])

  const handleRemoveWatermark = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始去水印...')
    // 模拟去水印过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在分析视频...')
      } else if (progress < 70) {
        setProcessingStatus('正在处理水印...')
      } else if (progress < 90) {
        setProcessingStatus('正在渲染视频...')
      } else {
        setProcessingStatus('处理完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setProcessedVideos([
            {
              id: '1',
              name: 'video-no-watermark.mp4',
              size: '10.5 MB',
              duration: '05:23',
              format: 'MP4'
            }
          ])
        }, 1000)
      }
    }, 300)
  }

  const handleConvertFormat = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始转换格式...')
    // 模拟格式转换过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 15
      setProcessingProgress(progress)
      if (progress < 50) {
        setProcessingStatus('正在分析视频...')
      } else if (progress < 90) {
        setProcessingStatus('正在转换格式...')
      } else {
        setProcessingStatus('转换完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setProcessedVideos([
            {
              id: '1',
              name: 'video-converted.mov',
              size: '12.8 MB',
              duration: '05:23',
              format: 'MOV'
            }
          ])
        }, 1000)
      }
    }, 250)
  }

  const handleAdjustSpeed = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始调整倍速...')
    // 模拟倍速调整过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在分析视频...')
      } else if (progress < 70) {
        setProcessingStatus('正在调整倍速...')
      } else if (progress < 90) {
        setProcessingStatus('正在渲染视频...')
      } else {
        setProcessingStatus('调整完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setProcessedVideos([
            {
              id: '1',
              name: 'video-2x.mp4',
              size: '8.2 MB',
              duration: '02:41',
              format: 'MP4',
              speed: '2x'
            }
          ])
        }, 1000)
      }
    }, 300)
  }

  const handleCropVideo = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始裁剪视频...')
    // 模拟视频裁剪过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在分析视频...')
      } else if (progress < 70) {
        setProcessingStatus('正在裁剪视频...')
      } else if (progress < 90) {
        setProcessingStatus('正在渲染视频...')
      } else {
        setProcessingStatus('裁剪完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setProcessedVideos([
            {
              id: '1',
              name: 'video-cropped.mp4',
              size: '7.5 MB',
              duration: '05:23',
              format: 'MP4',
              resolution: '1080x1920'
            }
          ])
        }, 1000)
      }
    }, 300)
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">视频处理</h1>
        <p className="text-gray-600">专业视频去水印、格式转换、倍速调整、裁剪工具</p>
      </div>

      {/* 视频处理选项卡 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'watermark' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('watermark')}
          >
            视频去水印
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'convert' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('convert')}
          >
            格式转换
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'speed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('speed')}
          >
            倍速调整
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'crop' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('crop')}
          >
            视频裁剪
          </button>
        </div>

        {/* 视频去水印 */}
        {activeTab === 'watermark' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FileText size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">去水印选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">去水印方法</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="ai">AI 智能去水印</option>
                    <option value="fixed">固定位置去水印</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRemoveWatermark}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>去除水印</span>
                  </>
                )}
              </button>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 处理结果 */}
            {processedVideos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">处理结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                            时长
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            格式
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedVideos.map((video) => (
                          <tr key={video.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {video.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.format}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                <Download size={16} />
                                <span>下载</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 格式转换 */}
        {activeTab === 'convert' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Repeat size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">转换选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                    <option value="wmv">WMV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">视频质量</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="high">高画质</option>
                    <option value="medium">中等画质</option>
                    <option value="low">低画质</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleConvertFormat}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>转换中...</span>
                  </>
                ) : (
                  <>
                    <Repeat size={18} />
                    <span>转换格式</span>
                  </>
                )}
              </button>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 处理结果 */}
            {processedVideos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">转换结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                            时长
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            格式
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedVideos.map((video) => (
                          <tr key={video.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {video.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.format}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                <Download size={16} />
                                <span>下载</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 倍速调整 */}
        {activeTab === 'speed' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Clock size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">倍速选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">倍速值</label>
                  <input
                    type="number"
                    min="0.25"
                    max="4"
                    step="0.1"
                    defaultValue="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">支持 0.25x-4x 任意倍速</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAdjustSpeed}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>调整中...</span>
                  </>
                ) : (
                  <>
                    <Clock size={18} />
                    <span>调整倍速</span>
                  </>
                )}
              </button>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 处理结果 */}
            {processedVideos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">调整结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                            时长
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            格式
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            倍速
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedVideos.map((video) => (
                          <tr key={video.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {video.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.format}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.speed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                <Download size={16} />
                                <span>下载</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 视频裁剪 */}
        {activeTab === 'crop' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Crop size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">裁剪选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分辨率</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1920x1080">1920x1080 (16:9)</option>
                    <option value="1080x1920">1080x1920 (9:16)</option>
                    <option value="1080x1080">1080x1080 (1:1)</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCropVideo}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>裁剪中...</span>
                  </>
                ) : (
                  <>
                    <Crop size={18} />
                    <span>裁剪视频</span>
                  </>
                )}
              </button>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 处理结果 */}
            {processedVideos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">裁剪结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                            时长
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            格式
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            分辨率
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedVideos.map((video) => (
                          <tr key={video.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {video.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.format}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.resolution}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                <Download size={16} />
                                <span>下载</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 视频处理特点 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Trash2 className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">智能去水印</h3>
          </div>
          <p className="text-gray-600">支持固定位置水印去除和 AI 智能去水印</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Repeat className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">多格式转换</h3>
          </div>
          <p className="text-gray-600">批量转换为 MP4、MOV、AVI 等剪辑软件兼容格式</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">灵活倍速</h3>
          </div>
          <p className="text-gray-600">0.25x-4x 任意倍速调整，支持精确到小数点后两位</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Crop className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">精准裁剪</h3>
          </div>
          <p className="text-gray-600">自定义分辨率和画面比例，适配不同平台</p>
        </div>
      </div>
    </div>
  )
}

export default VideoPage