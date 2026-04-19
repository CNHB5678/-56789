import { useState, useEffect } from 'react'
import { Play, Pause, Download as DownloadIcon, FileText, List, Clock, Check, AlertTriangle, ExternalLink } from 'lucide-react'

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('single')
  const [url, setUrl] = useState('')
  const [batchUrls, setBatchUrls] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [options, setOptions] = useState({
    quality: 'highest',
    noWatermark: true,
    noAudio: false,
    saveToSpace: true
  })

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

  const handleParseUrl = () => {
    setIsParsing(true)
    // 模拟解析过程
    setTimeout(() => {
      setVideoInfo({
        title: '示例视频标题',
        author: '示例作者',
        duration: '05:23',
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20editing%20software%20interface%20professional%20dark%20mode&image_size=landscape_16_9',
        availableQualities: ['1080p', '720p', '480p', '360p']
      })
      setIsParsing(false)
    }, 1500)
  }

  const handleDownload = () => {
    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadStatus('开始下载...')
    // 模拟下载过程
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setDownloadProgress(progress)
      if (progress < 30) {
        setDownloadStatus('正在解析视频信息...')
      } else if (progress < 60) {
        setDownloadStatus('正在下载视频...')
      } else if (progress < 90) {
        setDownloadStatus('正在处理视频...')
      } else {
        setDownloadStatus('下载完成！')
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsDownloading(false)
          setDownloadStatus('')
        }, 1000)
      }
    }, 200)
  }

  const handleOpenCaptureWindow = () => {
    // 模拟打开采集窗口
    alert('采集窗口已打开，请完成验证以获取最高画质')
  }

  return (
    <div className="space-y-12">
      {/* 英雄区域 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 md:py-32 animate-fade-in">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              全功能音视频素材处理工具
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
              专为内容创作者打造的一站式无水印视频下载 + 音视频处理平台
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5">
                开始使用
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
                了解更多
              </button>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-68.8C58.9,-62.8,72.2,-49.3,78.4,-33.8C84.5,-18.3,83.5,-0.9,81,14.8C78.4,30.5,74.3,43.5,65.3,55.3C56.4,67.1,42.5,77.8,27.4,82.5C12.3,87.2,-3.9,86,-18.5,80.7C-33.1,75.4,-46,66,-55.3,53.2C-64.6,40.3,-70.3,24.1,-72.4,7.3C-74.4,-9.5,-73,-26.9,-65.3,-39.8C-57.6,-52.6,-43.6,-60.9,-28.9,-66.3C-14.3,-71.6,0.8,-74,15.2,-72.5C29.6,-71,44.7,-68.8,44.7,-68.8Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* 下载选项卡 */}
      <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl scroll-reveal">
        <div className="flex border-b border-gray-100 mb-8">
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'single' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('single')}
          >
            单视频下载
          </button>
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'batch' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('batch')}
          >
            批量下载
          </button>
          <button
            className={`px-6 py-4 font-medium border-b-3 transition-all duration-300 ${activeTab === 'playlist' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('playlist')}
          >
            合集/播放列表
          </button>
        </div>

        {/* 单视频下载 */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">视频链接</label>
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="粘贴视频链接（支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等）"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow"
                  rows={3}
                />
              </div>
              <div className="md:w-64 flex items-end">
                <button
                  onClick={handleParseUrl}
                  disabled={isParsing || !url.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {isParsing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>解析中...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      <span>解析</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 视频信息 */}
            {videoInfo && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                  <div className="md:w-64">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-40 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-900 mb-4">{videoInfo.title}</h3>
                    <div className="flex items-center text-gray-600 mb-6 space-x-8">
                      <span className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{videoInfo.duration}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <FileText size={16} />
                        <span>{videoInfo.author}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {videoInfo.availableQualities.map((quality: string) => (
                        <button
                          key={quality}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${options.quality === quality ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setOptions({ ...options, quality })}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 下载选项 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="noWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-6 h-6 text-blue-600 border-gray-200 rounded focus:ring-3 focus:ring-blue-500"
                  />
                  <label htmlFor="noWatermark" className="text-gray-700 font-medium">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="noAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-6 h-6 text-blue-600 border-gray-200 rounded focus:ring-3 focus:ring-blue-500"
                  />
                  <label htmlFor="noAudio" className="text-gray-700 font-medium">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="saveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-6 h-6 text-blue-600 border-gray-200 rounded focus:ring-3 focus:ring-blue-500"
                  />
                  <label htmlFor="saveToSpace" className="text-gray-700 font-medium">
                    保存到个人空间（后台下载）
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleOpenCaptureWindow}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                  >
                    <ExternalLink size={16} />
                    <span>打开采集窗口（解锁最高画质）</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 下载按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !videoInfo}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>下载中...</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon size={20} />
                    <span>开始下载</span>
                  </>
                )}
              </button>
            </div>

            {/* 下载进度 */}
            {isDownloading && (
              <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>{downloadStatus}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 批量下载 */}
        {activeTab === 'batch' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">批量链接</label>
              <textarea
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                placeholder="粘贴多个视频链接，每个链接一行"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={5}
              />
              <p className="mt-3 text-sm text-gray-500">支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等平台链接</p>
            </div>

            {/* 批量下载选项 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="batchNoWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchNoWatermark" className="text-gray-700 font-medium">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="batchNoAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchNoAudio" className="text-gray-700 font-medium">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="batchSaveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchSaveToSpace" className="text-gray-700 font-medium">
                    保存到个人空间（后台下载）
                  </label>
                </div>
              </div>
            </div>

            {/* 批量下载按钮 */}
            <div className="flex justify-center">
              <button
                disabled={!batchUrls.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <List size={20} />
                <span>批量下载</span>
              </button>
            </div>
          </div>
        )}

        {/* 合集/播放列表 */}
        {activeTab === 'playlist' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">合集/播放列表链接</label>
                <input
                  type="text"
                  placeholder="粘贴 UP 主主页、合集、番剧、收藏夹链接"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="md:w-56 flex items-end">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <List size={18} />
                  <span>解析</span>
                </button>
              </div>
            </div>

            {/* 合集选项 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="playlistNoWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistNoWatermark" className="text-gray-700 font-medium">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="playlistNoAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistNoAudio" className="text-gray-700 font-medium">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="playlistSaveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistSaveToSpace" className="text-gray-700 font-medium">
                    保存到个人空间（后台下载）
                  </label>
                </div>
              </div>
            </div>

            {/* 下载按钮 */}
            <div className="flex justify-center">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-10 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <List size={20} />
                <span>下载合集</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 核心亮点 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-reveal">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg">
              <Check className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">全平台覆盖</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等 1000+ 平台</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-xl shadow-lg">
              <Check className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">最高画质</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">默认下载平台支持的最高分辨率，B 站 4K、抖音 1080P 60 帧、YouTube 8K</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl shadow-lg">
              <Check className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">无水印</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">所有平台优先下载无水印版本，成功率 95% 以上</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-pink-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 p-3 rounded-xl shadow-lg">
              <Check className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-xl text-gray-900">后台下载</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">保存到个人空间后可关闭浏览器，任务在服务器继续运行</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage