# 灵剪Agent - 智能视频创作助手

<div align="center">

![灵剪Agent](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.10+-green)
![React](https://img.shields.io/badge/react-18.2-blue)
![Tauri](https://img.shields.io/badge/tauri-2.0-black)
![License](https://img.shields.io/badge/license-MIT-orange)

**基于 AI 的自动化视频剪辑工具，让创作更简单**

</div>

## ✨ 功能特性

### 🎙️ 音频处理
- **Whisper 本地转文字** - 支持中文、英文等多语言识别
- **逐句拆分** - 自动将音频内容分割成句子
- **关键词提取** - 智能识别并分类关键词（人物、地点、物体、动作等）
- **颜色标注** - 不同类型关键词使用不同颜色高亮显示

### 🖼️ 素材管理
- **多源爬取** - 支持 Unsplash、Pixabay、Pexels 等免费素材网站
- **音效爬取** - 支持 FreeSound、Mixkit 等音效库
- **本地素材** - 支持上传和管理本地图片、视频、音频
- **AI 识别** - 自动识别素材内容并打标签
- **语义匹配** - 基于 Sentence Transformers 的智能匹配

### 🎨 AI 生成
- **PNG 图片生成** - 9种风格可选：
  - 写实、动漫、插画、油画、素描
  - 3D、古风、国风、科幻
- **SVG 动画生成** - 5种动画效果：淡入、滑入、缩放、弹跳、旋转
- **智能补全** - 爬取失败自动记录，AI 生成补充

### ✂️ 视频剪辑
- **时间轴编辑** - 拖拽、裁剪、分割视频片段
- **轨道管理** - 视频、音频、字幕轨道
- **预览播放** - 实时预览编辑效果
- **网格辅助** - 三种网格样式（线条、圆点、随机圆点）
- **属性调整** - 位置、缩放、旋转、不透明度

### 📦 导出功能
- **剪映草稿** - 导出兼容剪映的项目文件
- **成片导出** - MP4 格式导出
- **素材导出** - 单独导出素材文件

## 🛠️ 技术栈

### 前端
- **Tauri 2.0** - 轻量级跨平台桌面应用
- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 原子化 CSS
- **Zustand** - 状态管理
- **TanStack Query** - 数据获取

### 后端
- **FastAPI** - 高性能 Python Web 框架
- **Python 3.10+** - 后端语言
- **SQLite** - 轻量级数据库
- **ChromaDB** - 向量数据库

### AI 服务
- **Whisper** - 语音识别
- **Sentence Transformers** - 语义匹配
- **Stable Diffusion** - 图片生成
- **CLIP** - 素材识别

### 视频处理
- **FFmpeg** - 视频编解码
- **OpenCV** - 视频分析

## 🚀 快速开始

### 环境要求

- Python >= 3.10
- Node.js >= 18.0.0
- npm >= 9.0.0
- FFmpeg

### 安装

```bash
# 克隆项目
git clone https://github.com/your-repo/lingjian-agent.git
cd lingjian-agent

# 运行安装脚本
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 启动

```bash
# 方式一：使用启动脚本
chmod +x scripts/start.sh
./scripts/start.sh

# 方式二：手动启动

# 终端 1：后端服务
cd backend
python3 -m uvicorn app.main:app --reload --port 8000

# 终端 2：前端开发
cd frontend
npm run dev
```

### Docker 部署

```bash
cd docker
docker-compose up -d
```

## 📁 项目结构

```
lingjian-agent/
├── frontend/              # Tauri + React 前端
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/       # 页面
│   │   ├── stores/      # Zustand 状态
│   │   ├── services/    # API 服务
│   │   └── types/       # TypeScript 类型
│   └── src-tauri/       # Tauri 配置
│
├── backend/              # FastAPI 后端
│   ├── app/
│   │   ├── api/        # API 路由
│   │   └── services/   # 业务逻辑
│   └── requirements.txt
│
├── ai_services/         # AI 服务模块
│   ├── whisper/        # 语音识别
│   ├── semantic/       # 语义匹配
│   ├── generator/      # 素材生成
│   └── recognizer.py   # 素材识别
│
├── scrapers/            # 爬虫模块
├── video_engine/        # 视频处理
├── docker/             # Docker 配置
├── docs/               # 文档
└── scripts/           # 脚本
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# 数据库
DATABASE_URL=sqlite+aiosqlite:///./data/lingjian.db

# AI 服务
WHISPER_MODEL=base
SD_API_URL=http://localhost:7860

# 爬虫设置
SCRAPER_REQUEST_DELAY=2.0
```

### API Keys（可选）

- **Unsplash** - https://unsplash.com/developers
- **Pixabay** - https://pixabay.com/api/docs/
- **Pexels** - https://www.pexels.com/api/

## 📖 使用指南

### 1. 创建项目
点击"新建项目"，输入项目名称和描述。

### 2. 导入音频
将音频文件拖拽到上传区域，系统自动转录。

### 3. 提取关键词
系统自动提取关键词并分类显示。

### 4. 爬取素材
输入关键词，选择素材类型（图片/视频/音效），开始爬取。

### 5. 匹配素材
系统根据关键词自动匹配合适的素材。

### 6. 剪辑编辑
在时间轴上拖拽、调整素材片段。

### 7. 导出
选择导出格式（剪映草稿/MP4），开始导出。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License
