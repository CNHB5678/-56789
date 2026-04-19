import { useState, useEffect } from 'react'
import { Music, Download, FileText, SplitSquareVertical, Repeat, Volume2 } from 'lucide-react'

const AudioPage = () => {
  const [activeTab, setActiveTab] = useState('extract')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('')
  const [audioFiles, setAudioFiles] = useState<any[]>([])
  const [separatedTracks, setSeparatedTracks] = useState<any[]>([])

  // 滚动动画效果
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-reveal')
      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight - 100
        if (isVisible) {
          element.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleExtractAudio = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始提取音频...')
    // 模拟音频提取过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProcessingProgress(progress)
      if (progress < 50) {
        setProcessingStatus('正在分析视频...')
      } else if (progress < 90) {
        setProcessingStatus('正在提取音频...')
      } else {
        setProcessingStatus('提取完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setAudioFiles([
            {
              id: '1',
              name: 'example-audio.mp3',
              size: '5.2 MB',
              duration: '05:23',
              format: 'MP3',
              bitrate: '320kbps'
            }
          ])
        }, 1000)
      }
    }, 300)
  }

  const handleSeparateTracks = () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStatus('开始分离音轨...')
    // 模拟音轨分离过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setProcessingProgress(progress)
      if (progress < 30) {
        setProcessingStatus('正在加载 AI 模型...')
      } else if (progress < 70) {
        setProcessingStatus('正在分离音轨...')
      } else if (progress < 90) {
        setProcessingStatus('正在生成文件...')
      } else {
        setProcessingStatus('分离完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          setProcessingStatus('')
          setSeparatedTracks([
            {
              id: '1',
              name: 'vocals.mp3',
              type: '人声',
              size: '1.8 MB'
            },
            {
              id: '2',
              name: 'drums.mp3',
              type: '鼓',
              size: '1.2 MB'
            },
            {
              id: '3',
              name: 'bass.mp3',
              type: '贝斯',
              size: '800 KB'
            },
            {
              id: '4',
              name: 'piano.mp3',
              type: '钢琴',
              size: '1.0 MB'
            },
            {
              id: '5',
              name: 'other.mp3',
              type: '其他乐器',
              size: '1.5 MB'
            }
          ])
        }, 1000)
      }
    }, 400)
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center scroll-reveal">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">音频处理</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">专业音频提取、音轨分离和格式转换工具</p>
      </div>

      {/* 音频处理选项卡 */}
      <div className="bg-white rounded-3xl shadow-xl p-8 scroll-reveal">
        <div className="flex border-b border-gray-100 mb-8">
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'extract' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('extract')}
          >
            音频提取
          </button>
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'separate' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('separate')}
          >
            音轨分离
          </button>
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'convert' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('convert')}
          >
            格式转换
          </button>
        </div>

        {/* 音频提取 */}
        {activeTab === 'extract' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-blue-500 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl shadow-lg mb-6">
                  <FileText size={36} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">上传视频文件</h3>
                <p className="text-gray-600 mb-6">支持 MP4、MOV、AVI 等常见视频格式</p>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">提取选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
                  <select className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm">
                    <option value="mp3">MP3 (320kbps)</option>
                    <option value="aac">AAC</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">音频质量</label>
                  <select className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm">
                    <option value="320">320kbps (高音质)</option>
                    <option value="192">192kbps</option>
                    <option value="128">128kbps</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleExtractAudio}
                disabled={isProcessing}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <Music size={20} />
                    <span>提取音频</span>
                  </>
                )}
              </button>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 提取结果 */}
            {audioFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">提取结果</h3>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            文件名
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            大小
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            时长
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            格式
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            比特率
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {audioFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                              {file.name}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                              {file.size}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                              {file.duration}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                              {file.format}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                              {file.bitrate}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors duration-200">
                                <Download size={18} />
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

        {/* 音轨分离 */}
        {activeTab === 'separate' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <SplitSquareVertical size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传音频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP3、WAV、FLAC 等常见音频格式</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200">
                  选择文件
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">分离选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分离模式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="5stems">5 音轨分离（人声、鼓、贝斯、钢琴、其他）</option>
                    <option value="2stems">2 音轨分离（人声 + 伴奏）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="mp3">MP3 (320kbps)</option>
                    <option value="wav">WAV</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSeparateTracks}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>分离中...</span>
                  </>
                ) : (
                  <>
                    <SplitSquareVertical size={18} />
                    <span>分离音轨</span>
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

            {/* 分离结果 */}
            {separatedTracks.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">分离结果</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {separatedTracks.map((track) => (
                    <div key={track.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Volume2 size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{track.type}</h4>
                          <p className="text-sm text-gray-500">{track.name}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{track.size}</span>
                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
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

        {/* 格式转换 */}
        {activeTab === 'convert' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Repeat size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">上传音频文件</h3>
                <p className="text-gray-600 mb-4">支持 MP3、WAV、FLAC、AAC 等格式</p>
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
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">音频质量</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="320">320kbps (高音质)</option>
                    <option value="192">192kbps</option>
                    <option value="128">128kbps</option>
                    <option value="96">96kbps (低音质)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 flex items-center space-x-2"
              >
                <Repeat size={18} />
                <span>转换格式</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 技术特点 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-reveal">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg">
              <Music className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">高音质提取</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">从视频中提取 320kbps 高音质音频，保留原始音频质量</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-xl shadow-lg">
              <SplitSquareVertical className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">AI 音轨分离</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">基于 Meta Demucs v4 模型，自动分离人声、鼓、贝斯、钢琴、其他乐器 5 个音轨</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl shadow-lg">
              <Repeat className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">多格式支持</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">支持 MP3、AAC、WAV、FLAC 等常见音频格式批量转换</p>
        </div>
      </div>
    </div>
  )
}

export default AudioPage