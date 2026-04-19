import { useState } from 'react'
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

  const handleParseUrl = () => {
    setIsParsing(true)
    // 模拟解析过程
    setTimeout(() => {
      setVideoInfo({
        title: '示例视频标题',
        author: '示例作者',
        duration: '05:23',
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20thumbnail%20preview&image_size=square_hd',
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
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">视频下载</h1>
        <p className="text-gray-600">支持 1000+ 平台无水印视频下载，默认最高画质</p>
      </div>

      {/* 下载选项卡 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'single' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('single')}
          >
            单视频下载
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'batch' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('batch')}
          >
            批量下载
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'playlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('playlist')}
          >
            合集/播放列表
          </button>
        </div>

        {/* 单视频下载 */}
        {activeTab === 'single' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">视频链接</label>
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="粘贴视频链接（支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等）"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="md:w-48 flex items-end">
                <button
                  onClick={handleParseUrl}
                  disabled={isParsing || !url.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="md:w-48">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-800 mb-2">{videoInfo.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="mr-4">作者：{videoInfo.author}</span>
                      <span>时长：{videoInfo.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {videoInfo.availableQualities.map((quality: string) => (
                        <span
                          key={quality}
                          className={`px-3 py-1 rounded-full text-sm ${options.quality === quality ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setOptions({ ...options, quality })}
                        >
                          {quality}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 下载选项 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="noWatermark" className="ml-2 text-gray-700">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="noAudio" className="ml-2 text-gray-700">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="saveToSpace" className="ml-2 text-gray-700">
                    保存到个人空间（后台下载）
                  </label>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleOpenCaptureWindow}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>下载中...</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon size={18} />
                    <span>开始下载</span>
                  </>
                )}
              </button>
            </div>

            {/* 下载进度 */}
            {isDownloading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{downloadStatus}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 批量下载 */}
        {activeTab === 'batch' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">批量链接</label>
              <textarea
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                placeholder="粘贴多个视频链接，每个链接一行"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
              />
              <p className="mt-2 text-sm text-gray-500">支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等平台链接</p>
            </div>

            {/* 批量下载选项 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="batchNoWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchNoWatermark" className="ml-2 text-gray-700">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="batchNoAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchNoAudio" className="ml-2 text-gray-700">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="batchSaveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="batchSaveToSpace" className="ml-2 text-gray-700">
                    保存到个人空间（后台下载）
                  </label>
                </div>
              </div>
            </div>

            {/* 批量下载按钮 */}
            <div className="flex justify-center">
              <button
                disabled={!batchUrls.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <List size={18} />
                <span>批量下载</span>
              </button>
            </div>
          </div>
        )}

        {/* 合集/播放列表 */}
        {activeTab === 'playlist' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">合集/播放列表链接</label>
                <input
                  type="text"
                  placeholder="粘贴 UP 主主页、合集、番剧、收藏夹链接"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48 flex items-end">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <List size={18} />
                  <span>解析</span>
                </button>
              </div>
            </div>

            {/* 合集选项 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">下载选项</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="playlistNoWatermark"
                    checked={options.noWatermark}
                    onChange={(e) => setOptions({ ...options, noWatermark: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistNoWatermark" className="ml-2 text-gray-700">
                    无水印（默认）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="playlistNoAudio"
                    checked={options.noAudio}
                    onChange={(e) => setOptions({ ...options, noAudio: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistNoAudio" className="ml-2 text-gray-700">
                    一键去声（剪辑素材）
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="playlistSaveToSpace"
                    checked={options.saveToSpace}
                    onChange={(e) => setOptions({ ...options, saveToSpace: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="playlistSaveToSpace" className="ml-2 text-gray-700">
                    保存到个人空间（后台下载）
                  </label>
                </div>
              </div>
            </div>

            {/* 下载按钮 */}
            <div className="flex justify-center">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 flex items-center space-x-2"
              >
                <List size={18} />
                <span>下载合集</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 核心亮点 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">全平台覆盖</h3>
          </div>
          <p className="text-gray-600">支持 B 站、抖音、快手、小红书、视频号、TikTok、YouTube 等 1000+ 平台</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">最高画质</h3>
          </div>
          <p className="text-gray-600">默认下载平台支持的最高分辨率，B 站 4K、抖音 1080P 60 帧、YouTube 8K</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">无水印</h3>
          </div>
          <p className="text-gray-600">所有平台优先下载无水印版本，成功率 95% 以上</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-lg text-gray-800">后台下载</h3>
          </div>
          <p className="text-gray-600">保存到个人空间后可关闭浏览器，任务在服务器继续运行</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage