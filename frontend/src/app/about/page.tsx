import Link from 'next/link';
import { Film, Sparkles, Target, Users, Heart, ArrowRight, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: '使命',
      description: '让每个人都能用AI轻松创作出专业级视频内容，降低视频创作门槛，释放创造力。',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: '愿景',
      description: '成为全球领先的AI视频创作平台，重新定义人机协作的内容生产方式。',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: '价值观',
      description: '用户至上、技术驱动、持续创新、开放协作。我们相信AI应该服务于人，而非替代人。',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { number: '10万+', label: '注册用户' },
    { number: '500万+', label: '创作视频' },
    { number: '99.9%', label: '服务可用性' },
    { number: '50+', label: '团队成员' },
  ];

  const team = [
    {
      name: '技术团队',
      icon: Users,
      desc: '来自一线互联网公司的AI算法工程师和全栈开发者，深耕计算机视觉和自然语言处理领域。',
      color: 'from-blue-500 to-purple-500',
    },
    {
      name: '产品团队',
      icon: Heart,
      desc: '拥有多年视频工具产品经验，深刻理解创作者痛点，致力于打造极致用户体验。',
      color: 'from-pink-500 to-rose-500',
    },
    {
      name: '设计团队',
      icon: Sparkles,
      desc: '追求美学与功能的完美平衡，用设计让复杂的AI技术变得简单易用。',
      color: 'from-amber-500 to-orange-500',
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
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">定价</Link>
              <Link href="/about" className="text-white font-medium">关于</Link>
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

      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            用AI重新定义
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              视频创作方式
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            我们是一支热爱技术、相信AI力量的团队。剪映AI草稿诞生于对视频创作效率的极致追求——
            从一段文案到一个精美的短视频，只需要几分钟。
          </p>
        </div>
      </section>

      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">我们的信念</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              驱动我们前行的核心价值
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">团队介绍</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              一群充满激情的创造者，正在构建视频创作的未来
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.name}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                加入我们，一起创造未来
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                我们正在寻找对AI和视频创作充满热情的伙伴。如果你也想改变世界，欢迎加入我们。
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-base px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  立即开始体验
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
