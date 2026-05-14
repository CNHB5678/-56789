# 灵剪Agent

智能视频创作助手 - 基于 AI 的自动化视频剪辑工具

## 功能特性

- 🎙️ **音频转文案**: 使用 Whisper 本地转文字，逐句拆分，关键词提取
- 🖼️ **智能素材匹配**: 爬取/生成匹配的图片、视频、音效素材
- ✂️ **AI剪辑**: 一键成片 + 人工精修
- 📦 **多格式导出**: 剪映草稿、MP4成片、单独素材

## 技术栈

- **前端**: Tauri 2.0 + React + TypeScript
- **后端**: FastAPI + Python
- **AI**: Whisper, Stable Diffusion, Sentence Transformers
- **视频**: FFmpeg
- **数据库**: SQLite + ChromaDB

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- Python >= 3.10
- FFmpeg
- (可选) NVIDIA GPU for AI features

### 安装

```bash
# 克隆项目
git clone https://github.com/your-repo/lingjian-agent.git
cd lingjian-agent

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
pip install -r requirements.txt

# 返回项目根目录
cd ..
```

### 开发

```bash
# 启动后端
cd backend
uvicorn app.main:app --reload --port 8000

# 启动前端 (新终端)
cd frontend
npm run tauri dev
```

### Docker 部署

```bash
cd docker
docker-compose up -d
```

## 项目结构

```
lingjian-agent/
├── frontend/          # Tauri + React 前端
├── backend/           # FastAPI 后端
├── ai_services/      # AI 服务模块
├── scrapers/         # 素材爬虫
├── video_engine/     # 视频处理引擎
├── docker/           # Docker 配置
└── docs/             # 文档
```

## 开发指南

### 添加新的 AI 服务

1. 在 `ai_services/` 创建新模块
2. 实现服务类
3. 在 `backend/app/services/` 暴露 API

### 添加新的爬虫

1. 继承 `scrapers/base.py` 的 `BaseScraper`
2. 实现 `search()` 和 `download()` 方法
3. 在 `ScraperManager` 注册

## License

MIT
