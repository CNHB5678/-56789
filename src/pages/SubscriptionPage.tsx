import { useState } from 'react'
import { CreditCard, Check, Star, Users, Shield, Zap, Download, Music, Brain, Video } from 'lucide-react'

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('free')

  const plans = [
    {
      id: 'free',
      name: '免费版',
      price: '¥0',
      billing: '永久免费',
      features: [
        '基础视频下载功能',
        '有限的处理次数',
        '10 GB 存储空间',
        '支持主流平台',
        '无水印下载',
        '基础音频提取'
      ],
      cta: '当前使用'
    },
    {
      id: 'pro',
      name: 'Pro 版',
      price: '¥99',
      billing: '每月',
      features: [
        '无限制下载和处理',
        '高级 AI 功能',
        '50 GB 存储空间',
        '支持所有平台',
        '无水印下载',
        'AI 音轨分离',
        '智能字幕生成',
        '视频内容摘要',
        'AI 智能剪辑'
      ],
      cta: '升级到 Pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: '¥999',
      billing: '每月',
      features: [
        '无限制下载和处理',
        '高级 AI 功能',
        '500 GB 存储空间',
        '支持所有平台',
        '无水印下载',
        'AI 音轨分离',
        '智能字幕生成',
        '视频内容摘要',
        'AI 智能剪辑',
        '团队协作',
        '批量处理',
        '定制化服务'
      ],
      cta: '联系销售'
    }
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = () => {
    // 模拟订阅操作
    console.log('订阅计划:', selectedPlan)
    alert('订阅成功！')
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">订阅管理</h1>
        <p className="text-gray-600">选择适合您的订阅计划，解锁更多高级功能</p>
      </div>

      {/* 订阅计划 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${selectedPlan === plan.id ? 'border-blue-600' : 'border-gray-200'}`}
          >
            {plan.popular && (
              <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                最受欢迎
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                <span className="text-gray-500 ml-2">{plan.billing}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 rounded-md font-medium transition-all duration-200 ${selectedPlan === plan.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 功能对比 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">功能对比</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  功能
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  免费版
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pro 版
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  企业版
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Download size={18} className="text-blue-600" />
                    <span>视频下载</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Music size={18} className="text-blue-600" />
                    <span>音频处理</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Brain size={18} className="text-blue-600" />
                    <span>AI 辅助创作</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-gray-400">×</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Video size={18} className="text-blue-600" />
                    <span>视频处理</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="text-blue-600" />
                    <span>团队协作</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-gray-400">×</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-gray-400">×</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Check size={18} className="text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Shield size={18} className="text-blue-600" />
                    <span>存储空间</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10 GB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  50 GB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  500 GB
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 订阅按钮 */}
      {selectedPlan !== 'free' && (
        <div className="flex justify-center">
          <button
            onClick={handleSubscribe}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-200 flex items-center space-x-2"
          >
            <CreditCard size={18} />
            <span>立即订阅</span>
          </button>
        </div>
      )}

      {/* 常见问题 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">常见问题</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">如何取消订阅？</h4>
            <p className="text-gray-600">您可以在个人设置页面的订阅管理中取消订阅，取消后当前订阅周期结束后将不再扣费。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">订阅后可以退款吗？</h4>
            <p className="text-gray-600">订阅后 7 天内可以申请全额退款，超过 7 天将不予退款。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">企业版如何定制化服务？</h4>
            <p className="text-gray-600">企业版用户可以联系我们的销售团队，根据您的具体需求提供定制化服务方案。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage