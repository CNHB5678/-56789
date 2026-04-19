import { useState } from 'react'
import { Brain, FileText, MessageSquare, Scissors, Download, Check } from 'lucide-react'

const AIPage = () => {
  const [activeTab, setActiveTab] = useState('subtitle')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('')
  const [subtitles, setSubtitles] = useState<any[]>([])
  const [summary, setSummary] = useState<string[]>([])
  const [clips, setClips] = useState<any[]>([])

  const handleGenerateSubtitles = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始生成字幕...')
    // 模拟字幕生成过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在加载 Whisper 模型...')
      } else if (progress < 70) {
        setProcessingStatus('正在识别语音...')
      } else if (progress < 90) {
        setProcessingStatus('正在生成字幕...')
      } else {
        setProcessingStatus('生成完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setSubtitles([
            {
              id: '1',
              start: '00:00:00',
              end: '00:00:05',
              text: '大家好，欢迎来到我的频道'
            },
            {
              id: '2',
              start: '00:00:05',
              end: '00:00:10',
              text: '今天我要给大家介绍一个非常好用的工具'
            },
            {
              id: '3',
              start: '00:00:10',
              end: '00:00:15',
              text: '它可以帮助你快速下载无水印视频'
            }
          ])
        }, 1000)
      }
    }, 300)
  }

  const handleGenerateSummary = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始生成摘要...')
    // 模拟摘要生成过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 15
      setProcessingProgress(progress)
      if (progress < 50) {
        setProcessingStatus('正在分析视频内容...')
      } else if (progress < 90) {
        setProcessingStatus('正在生成摘要...')
      } else {
        setProcessingStatus('生成完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setSummary([
            '视频介绍了一款无水印视频下载工具',
            '工具支持多个平台，包括 B 站、抖音、快手等',
            '工具具有智能去水印、最高画质下载等功能',
            '工具还支持音频提取和音轨分离',
            '工具提供个人空间后台下载功能'
          ])
        }, 1000)
      }
    }, 250)
  }

  const handleGenerateClip = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始智能剪辑...')
    // 模拟智能剪辑过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在分析视频高潮部分...')
      } else if (progress < 70) {
        setProcessingStatus('正在生成短视频...')
      } else if (progress < 90) {
        setProcessingStatus('正在渲染视频...')
      } else {
        setProcessingStatus('剪辑完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setClips([
            {
              id: '1',
              name: '高潮片段 1.mp4',
              duration: '00:01:00',
              thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20clip%20thumbnail&image_size=square_hd'
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 辅助创作</h1>
        <p className="text-gray-600">智能字幕生成、视频摘要、智能剪辑等 AI 功能</p>
      </div>

      {/* AI 功能选项卡 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'subtitle' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('subtitle')}
          >
            智能字幕生成
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'summary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('summary')}
          >
            视频内容摘要
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'clip' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('clip')}
          >
            AI 智能剪辑
          </button>
        </div>

        {/* 智能字幕生成 */}
        {activeTab === 'subtitle' && (
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
              <h3 className="font-medium text-gray-800 mb-3">字幕选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                    <option value="auto">自动检测</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="srt">SRT</option>
                    <option value="ass">ASS</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGenerateSubtitles}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    <span>生成字幕</span>
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

            {/* 字幕结果 */}
            {subtitles.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">生成结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            开始时间
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            结束时间
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            字幕内容
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subtitles.map((subtitle) => (
                          <tr key={subtitle.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subtitle.start}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subtitle.end}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {subtitle.text}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200 flex items-center space-x-2">
                    <Download size={16} />
                    <span>下载字幕文件</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 视频内容摘要 */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MessageSquare size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGenerateSummary}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    <span>生成摘要</span>
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

            {/* 摘要结果 */}
            {summary.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">生成结果</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <ul className="space-y-3">
                    {summary.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-1 rounded-full mt-1">
                          <Check size={14} className="text-blue-600" />
                        </div>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI 智能剪辑 */}
        {activeTab === 'clip' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Scissors size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传视频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">剪辑选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">短视频时长</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="60">60 秒</option>
                    <option value="30">30 秒</option>
                    <option value="15">15 秒</option>
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
                onClick={handleGenerateClip}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>剪辑中...</span>
                  </>
                ) : (
                  <>
                    <Scissors size={18} />
                    <span>智能剪辑</span>
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

            {/* 剪辑结果 */}
            {clips.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">剪辑结果</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clips.map((clip) => (
                    <div key={clip.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="relative">
                        <img
                          src={clip.thumbnail}
                          alt={clip.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {clip.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 mb-2">{clip.name}</h4>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2">
                          <Download size={16} />
                          <span>下载</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI 功能特点 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">智能字幕</h3>
          </div>
          <p className="text-gray-600">使用 Whisper v3 生成 SRT/ASS 格式字幕，支持 99 种语言</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">内容摘要</h3>
          </div>
          <p className="text-gray-600">自动提取视频核心内容，生成 3-5 个关键要点</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Scissors className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">智能剪辑</h3>
          </div>
          <p className="text-gray-600">自动识别视频高潮部分，生成 60 秒短视频</p>
        </div>
      </div>
    </div>
  )
}

export default AIPage