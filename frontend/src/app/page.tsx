import Link from 'next/link';
import { Sparkles, Layout, Film, MessageCircle, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI生图',
      description: '智能理解文案内容，自动生成高质量配图，让视频画面更生动',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layout,
      title: '智能布局',
      description: 'AI自动优化字幕、转场和音乐节奏，专业级排版一键生成',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Film,
      title: '剪映原生',
      description: '直接导出剪映草稿文件，在剪映中继续编辑，无缝衔接创作流程',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: MessageCircle,
      title: '微信通知',
      description: '创作完成即时推送微信通知，随时随地掌握项目进度',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">剪映AI草稿</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">功能</a>
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

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>AI驱动的新一代视频创作工具</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            AI视频创作，
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              一键生成剪映草稿
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            只需输入文案，AI自动为你生成专业级短视频。智能配图、自动剪辑、节奏配乐，
            直接导出剪映格式，让创作效率提升10倍。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/25"
              >
                开始创作
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-base px-8 py-6 border border-white/20 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition-colors"
            >
              <Play className="mr-2 w-5 h-5" />
              查看演示
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              强大功能，简单操作
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              从文案到成片，AI为你搞定一切
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
