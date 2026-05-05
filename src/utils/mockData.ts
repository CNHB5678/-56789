import { Category, Tool, Topic } from '../types';

export const categories: Category[] = [
  {
    id: 'writing',
    name: 'AI 写作',
    icon: 'pencil',
    subCategories: ['文案写作', '内容创作', '论文助手'],
    description: '提供各种AI写作工具，帮助您快速生成高质量内容'
  },
  {
    id: 'design',
    name: 'AI 设计',
    icon: 'palette',
    subCategories: ['图像生成', 'UI设计', '海报制作'],
    description: 'AI设计工具，让创意快速变现'
  },
  {
    id: 'video',
    name: 'AI 视频',
    icon: 'video',
    subCategories: ['视频生成', '视频编辑', '短视频制作'],
    description: 'AI视频制作工具，轻松打造专业视频内容'
  },
  {
    id: 'coding',
    name: 'AI 编程',
    icon: 'code',
    subCategories: ['代码生成', '代码补全', '智能调试'],
    description: 'AI编程助手，提升开发效率'
  },
  {
    id: 'office',
    name: 'AI 办公',
    icon: 'briefcase',
    subCategories: ['文档处理', '表格分析', '演示文稿'],
    description: 'AI办公工具，让工作更高效'
  },
  {
    id: 'learning',
    name: 'AI 学习',
    icon: 'book',
    subCategories: ['语言学习', '知识问答', '学习规划'],
    description: 'AI学习助手，让学习更高效'
  },
  {
    id: 'voice',
    name: 'AI 语音',
    icon: 'microphone',
    subCategories: ['语音合成', '语音识别', '声音克隆'],
    description: 'AI语音工具，让声音更有温度'
  },
  {
    id: 'image',
    name: 'AI 图像处理',
    icon: 'image',
    subCategories: ['图像修复', '图像增强', '背景移除'],
    description: 'AI图像处理工具，让图片更完美'
  },
  {
    id: 'productivity',
    name: 'AI 效率工具',
    icon: 'zap',
    subCategories: ['日程管理', '任务规划', '智能提醒'],
    description: 'AI效率工具，让生活更有序'
  }
];

export const tools: Tool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chatgpt%20logo%20simple%20minimal&image_size=square',
    description: 'OpenAI推出的智能对话机器人，能够回答各种问题、撰写文本、生成代码等',
    category: 'writing',
    tags: ['对话', '写作', '代码'],
    features: ['自然语言对话', '文本生成', '代码编写', '知识问答'],
    pricing: {
      type: 'freemium',
      price: '$20/月起'
    },
    officialUrl: 'https://chat.openai.com',
    rating: 4.8,
    reviewCount: 12567,
    views: 987654,
    createdAt: new Date('2022-11-30')
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=midjourney%20logo%20simple%20minimal&image_size=square',
    description: '强大的AI图像生成工具，通过文字描述生成高质量图片',
    category: 'design',
    tags: ['图像生成', '艺术创作'],
    features: ['文字转图像', '风格迁移', '高清输出', '多维度控制'],
    pricing: {
      type: 'paid',
      price: '$10/月起'
    },
    officialUrl: 'https://www.midjourney.com',
    rating: 4.7,
    reviewCount: 8934,
    views: 765432,
    createdAt: new Date('2022-02-14')
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stable%20diffusion%20logo%20simple%20minimal&image_size=square',
    description: '开源的AI图像生成模型，可以本地部署运行',
    category: 'design',
    tags: ['开源', '图像生成', '本地部署'],
    features: ['文字转图像', '开源免费', '本地运行', '高度可定制'],
    pricing: {
      type: 'free'
    },
    officialUrl: 'https://stability.ai',
    rating: 4.6,
    reviewCount: 15678,
    views: 876543,
    createdAt: new Date('2022-08-22')
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=github%20copilot%20logo%20simple%20minimal&image_size=square',
    description: 'GitHub和OpenAI合作开发的AI编程助手，在编辑器中实时提供代码建议',
    category: 'coding',
    tags: ['编程', '代码补全', 'IDE插件'],
    features: ['实时代码补全', '多语言支持', '自然语言转代码', '代码解释'],
    pricing: {
      type: 'paid',
      price: '$10/月'
    },
    officialUrl: 'https://github.com/copilot',
    rating: 4.5,
    reviewCount: 23456,
    views: 1234567,
    createdAt: new Date('2021-10-26')
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=notion%20logo%20simple%20minimal&image_size=square',
    description: '集成在Notion中的AI功能，帮助您更高效地写作和组织内容',
    category: 'office',
    tags: ['笔记', '写作', '文档处理'],
    features: ['智能写作', '内容总结', '格式调整', '多语言支持'],
    pricing: {
      type: 'freemium',
      price: '$8/月'
    },
    officialUrl: 'https://www.notion.so',
    rating: 4.4,
    reviewCount: 9876,
    views: 654321,
    createdAt: new Date('2023-02-22')
  },
  {
    id: 'runway-ml',
    name: 'Runway ML',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=runway%20ml%20logo%20simple%20minimal&image_size=square',
    description: '专业的AI视频创作平台，提供各种视频生成和编辑功能',
    category: 'video',
    tags: ['视频生成', '视频编辑', '专业工具'],
    features: ['文字转视频', '视频风格迁移', 'AI视频编辑', '专业输出'],
    pricing: {
      type: 'freemium',
      price: '$12/月起'
    },
    officialUrl: 'https://runwayml.com',
    rating: 4.6,
    reviewCount: 5432,
    views: 432109,
    createdAt: new Date('2018-06-01')
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elevenlabs%20logo%20simple%20minimal&image_size=square',
    description: '高质量的AI语音合成工具，支持声音克隆',
    category: 'voice',
    tags: ['语音合成', '声音克隆', '音频处理'],
    features: ['高质量语音生成', '声音克隆', '多语言支持', '情感控制'],
    pricing: {
      type: 'freemium',
      price: '$5/月起'
    },
    officialUrl: 'https://elevenlabs.io',
    rating: 4.7,
    reviewCount: 7654,
    views: 543210,
    createdAt: new Date('2022-01-01')
  },
  {
    id: 'rembg',
    name: 'RemBG',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rembg%20logo%20simple%20minimal&image_size=square',
    description: 'AI背景移除工具，一键去除图片背景',
    category: 'image',
    tags: ['背景移除', '图像处理', '免费'],
    features: ['一键背景移除', '高清输出', '批量处理', '完全免费'],
    pricing: {
      type: 'free'
    },
    officialUrl: 'https://github.com/danielgatis/rembg',
    rating: 4.5,
    reviewCount: 12345,
    views: 876543,
    createdAt: new Date('2020-05-20')
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grammarly%20logo%20simple%20minimal&image_size=square',
    description: 'AI语法检查和写作助手，帮助您提升写作质量',
    category: 'writing',
    tags: ['语法检查', '写作', '校对'],
    features: ['实时语法检查', '拼写纠正', '风格建议', '抄袭检测'],
    pricing: {
      type: 'freemium',
      price: '$12/月'
    },
    officialUrl: 'https://www.grammarly.com',
    rating: 4.6,
    reviewCount: 34567,
    views: 2345678,
    createdAt: new Date('2009-01-01')
  },
  {
    id: 'canva',
    name: 'Canva AI',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=canva%20logo%20simple%20minimal&image_size=square',
    description: 'Canva的AI设计助手，让设计更简单',
    category: 'design',
    tags: ['设计', '模板', '海报制作'],
    features: ['AI设计助手', '丰富模板库', '智能配色', '一键生成'],
    pricing: {
      type: 'freemium',
      price: '$12.99/月'
    },
    officialUrl: 'https://www.canva.com',
    rating: 4.7,
    reviewCount: 45678,
    views: 3456789,
    createdAt: new Date('2013-01-01')
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=perplexity%20ai%20logo%20simple%20minimal&image_size=square',
    description: 'AI搜索引擎，提供带引用的准确回答',
    category: 'learning',
    tags: ['搜索', '问答', '研究'],
    features: ['智能搜索', '引用链接', '深度研究', '多模态支持'],
    pricing: {
      type: 'freemium',
      price: '$20/月'
    },
    officialUrl: 'https://www.perplexity.ai',
    rating: 4.8,
    reviewCount: 18901,
    views: 1567890,
    createdAt: new Date('2022-08-01')
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cursor%20editor%20logo%20simple%20minimal&image_size=square',
    description: '专为AI编程设计的代码编辑器',
    category: 'coding',
    tags: ['编程', 'IDE', 'AI编程'],
    features: ['智能代码补全', '代码理解', '重构建议', '多光标编辑'],
    pricing: {
      type: 'freemium',
      price: '$20/月'
    },
    officialUrl: 'https://cursor.sh',
    rating: 4.6,
    reviewCount: 8765,
    views: 654321,
    createdAt: new Date('2023-01-01')
  }
];

export const topics: Topic[] = [
  {
    id: 'ai-writing-tools',
    title: 'AI 写作工具大全',
    description: '收集全网最优质的AI写作工具，从文案到论文，一应俱全',
    toolIds: ['chatgpt', 'grammarly', 'notion-ai'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ai%20writing%20tools%20banner%20modern%20design&image_size=landscape_16_9'
  },
  {
    id: 'ai-image-tools',
    title: 'AI 图像创作工具',
    description: '精选AI图像生成和编辑工具，让创意可视化',
    toolIds: ['midjourney', 'stable-diffusion', 'canva', 'rembg'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ai%20image%20tools%20banner%20modern%20design&image_size=landscape_16_9'
  },
  {
    id: 'coding-assistants',
    title: 'AI 编程助手推荐',
    description: '提升编程效率的AI工具，从代码补全到项目重构',
    toolIds: ['github-copilot', 'cursor'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ai%20coding%20tools%20banner%20modern%20design&image_size=landscape_16_9'
  }
];
