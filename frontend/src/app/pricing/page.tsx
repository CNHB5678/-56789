import Link from 'next/link';
import { Check, Film, ArrowRight, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const plans = [
    {
      name: '免费版',
      icon: Sparkles,
      price: '¥0',
      period: '/月',
      description: '适合个人体验和轻度创作',
      features: [
        '每月 3 次免费创作',
        '基础 AI 配图',
        '标准清晰度导出',
        '剪映草稿导出',
        '社区支持',
      ],
      cta: '免费开始',
      popular: false,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-white/5',
      borderColor: 'border-white/10',
    },
    {
      name: '专业版',
      icon: Zap,
      price: '¥99',
      period: '/月',
      description: '适合内容创作者和自媒体',
      features: [
        '每月 100 次创作',
        '高级 AI 配图模型',
        '高清 1080P 导出',
        '智能音乐匹配',
        '批量生成功能',
        '优先处理队列',
        '微信通知提醒',
        '邮件技术支持',
      ],
      cta: '立即订阅',
      popular: true,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-b from-blue-500/10 to-purple-500/10',
      borderColor: 'border-blue-500/50',
    },
    {
      name: '企业版',
      icon: Crown,
      price: '¥499',
      period: '/月',
      description: '适合团队和商业用途',
      features: [
        '无限次创作',
        '最高级 AI 模型',
        '4K 超清导出',
        '自定义品牌模板',
        'API 接口访问',
        '团队协作功能',
        '专属客户经理',
        '7×24 小时支持',
        'SLA 服务保障',
      ],
      cta: '联系我们',
      popular: false,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-white/5',
      borderColor: 'border-white/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">剪映AI草稿</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">首页</Link>
              <Link href="/pricing" className="text-white font-medium">定价</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">关于</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  免费注册
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              简单透明的
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}定价方案
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              选择适合你的方案，开启 AI 视频创作之旅。随时升级或取消，无隐藏费用。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl ${plan.bgColor} border ${plan.borderColor} p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular ? 'shadow-xl shadow-purple-500/20 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className={`w-full py-6 text-base ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-8">常见问题</h2>
            <div className="space-y-4 text-left">
              {[
                {
                  q: '可以随时更换套餐吗？',
                  a: '是的，你可以随时升级或降级套餐。升级立即生效，降级将在当前计费周期结束后生效。',
                },
                {
                  q: '创作次数如何计算？',
                  a: '每次提交一个视频创作任务消耗一次创作额度，无论视频时长。未使用的额度不累积到下月。',
                },
                {
                  q: '支持哪些支付方式？',
                  a: '支持微信支付、支付宝、银行卡等多种支付方式。企业版可开具增值税专用发票。',
                },
                {
                  q: '导出的草稿可以在剪映中直接使用吗？',
                  a: '完全可以！导出的是剪映原生草稿格式，导入剪映后可以继续编辑所有元素。',
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
