# 灵剪Agent - 技术规格说明书

**版本**: 1.0.0
**日期**: 2026-05-14
**状态**: 设计中

---

## 目录

1. [项目概述](#1-项目概述)
2. [系统架构](#2-系统架构)
3. [前端架构 (Tauri + React)](#3-前端架构-tauri--react)
4. [后端架构 (FastAPI)](#4-后端架构-fastapi)
5. [数据模型](#5-数据模型)
6. [AI模块设计](#6-ai模块设计)
7. [素材爬虫模块](#7-素材爬虫模块)
8. [视频剪辑引擎](#8-视频剪辑引擎)
9. [Web端设计](#9-web端设计)
10. [部署方案](#10-部署方案)

---

## 1. 项目概述

### 1.1 项目目标

**灵剪Agent** 是一款智能视频创作助手，通过AI技术实现：

- **音频转文案**：自动识别音频内容，生成逐句标注的文案
- **智能素材匹配**：根据文案关键词，自动爬取/生成匹配的图片、视频、音效素材
- **一键剪辑**：AI辅助+人工精修，快速生成专业视频

### 1.2 核心特性

| 类别 | 功能 |
|------|------|
| 音频处理 | Whisper本地转文字、逐句拆分、关键词提取（颜色标注） |
| 素材来源 | 网络爬取 + 本地素材（自动识别打标）+ AI生成 |
| 素材匹配 | 关键词匹配 + 语义相似度匹配 |
| 音效处理 | 爬取+AI生成（不含背景音乐） |
| 剪辑功能 | 时间轴、预览、转场动画、字幕样式、网格显示 |
| 导出功能 | 剪映草稿、成片、单独素材导出 |

### 1.3 技术栈概览

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
├─────────────────────────────────────────────────────────────┤
│  Tauri桌面端 (React + TypeScript)  │  Next.js Web端 (可选)  │
├─────────────────────────────────────────────────────────────┤
│                        API网关层 (FastAPI)                   │
├─────────────────────────────────────────────────────────────┤
│  Python服务  │  FFmpeg  │  AI推理 (Whisper/SD/语义匹配)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              灵剪Agent                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       Tauri 桌面端                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │   主界面    │  │  素材库面板  │  │    剪辑工作区           │ │   │
│  │  │  - 音频导入 │  │  - 分类浏览 │  │    - 时间轴编辑器       │ │   │
│  │  │  - 项目管理 │  │  - 搜索过滤 │  │    - 预览播放器         │ │   │
│  │  │  - 设置    │  │  - 素材预览 │  │    - 属性面板           │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │                    状态管理 (Zustand)                   │ │   │
│  │  │  - 项目状态  - 编辑器状态  - 素材缓存状态                │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                        │
│                                   │ Tauri IPC / HTTP                       │
│                                   ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     FastAPI API 网关                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │   │
│  │  │ /audio   │ │ /media   │ │ /project │ │ /ai                │ │   │
│  │  │ 转录接口  │ │ 素材接口  │ │ 项目接口  │ │ AI生成接口          │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                        │
│          ┌────────────────────────┼────────────────────────┐            │
│          │                        │                        │            │
│          ▼                        ▼                        ▼            │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │  音频处理服务  │    │    素材服务      │    │     AI 服务集群       │  │
│  │  - Whisper   │    │  - 爬虫引擎      │    │  ┌────────────────┐ │  │
│  │  - 音频分析   │    │  - 本地存储      │    │  │  语义匹配服务   │ │  │
│  │  - 音效处理   │    │  - 素材识别      │    │  │  (Sentence-    │ │  │
│  │             │    │  - 向量存储      │    │  │   Transformers)│ │  │
│  │             │    │                 │    │  └────────────────┘ │  │
│  │             │    │                 │    │  ┌────────────────┐ │  │
│  │             │    │                 │    │  │  SVG生成服务   │ │  │
│  │             │    │                 │    │  │  (drawsvg)    │ │  │
│  │             │    │                 │    │  └────────────────┘ │  │
│  │             │    │                 │    │  ┌────────────────┐ │  │
│  │             │    │                 │    │  │  PNG生成服务   │ │  │
│  │             │    │                 │    │  │  (Stable       │ │  │
│  │             │    │                 │    │  │   Diffusion)  │ │  │
│  │             │    │                 │    │  └────────────────┘ │  │
│  └──────────────┘    └──────────────────┘    └──────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      数据存储层                                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐    │   │
│  │  │  SQLite    │  │  ChromaDB  │  │   本地文件系统          │    │   │
│  │  │  项目数据   │  │  向量索引   │  │   素材文件/缓存        │    │   │
│  │  └────────────┘  └────────────┘  └────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Docker 容器层                                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │   │
│  │  │ ComfyUI  │ │ FFmpeg   │ │ Whisper  │ │  其他AI服务容器      │ │   │
│  │  │ (SD服务) │ │ (视频)   │ │ (语音)   │ │                     │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

                              (可选)

                    ┌─────────────────────┐
                    │    Web 访问端       │
                    │   Next.js 14       │
                    │   (轻量界面)        │
                    └─────────────────────┘
```

### 2.2 目录结构

```
lingjian-agent/
├── src/                          # Tauri/Rust后端
│   ├── main.rs                   # Tauri入口
│   ├── commands/                 # Tauri命令
│   │   ├── mod.rs
│   │   ├── audio.rs             # 音频相关命令
│   │   ├── media.rs             # 素材相关命令
│   │   ├── project.rs           # 项目相关命令
│   │   └── ai.rs               # AI相关命令
│   └── lib.rs
│
├── frontend/                     # React前端
│   ├── src/
│   │   ├── components/          # React组件
│   │   │   ├── layout/         # 布局组件
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   │
│   │   │   ├── audio/          # 音频处理
│   │   │   │   ├── AudioUploader.tsx
│   │   │   │   ├── TranscriptEditor.tsx
│   │   │   │   └── KeywordPanel.tsx
│   │   │   │
│   │   │   ├── media/          # 素材库
│   │   │   │   ├── MediaLibrary.tsx
│   │   │   │   ├── MediaGrid.tsx
│   │   │   │   ├── MediaPreview.tsx
│   │   │   │   └── MediaFilters.tsx
│   │   │   │
│   │   │   ├── editor/         # 剪辑编辑器
│   │   │   │   ├── EditorWorkspace.tsx
│   │   │   │   ├── Timeline/
│   │   │   │   │   ├── Timeline.tsx
│   │   │   │   │   ├── Track.tsx
│   │   │   │   │   ├── Clip.tsx
│   │   │   │   │   └── Playhead.tsx
│   │   │   │   ├── Preview/
│   │   │   │   │   ├── VideoPreview.tsx
│   │   │   │   │   └── GridOverlay.tsx
│   │   │   │   └── PropertyPanel/
│   │   │   │       ├── ClipProperties.tsx
│   │   │   │       ├── TextProperties.tsx
│   │   │   │       └── AnimationSettings.tsx
│   │   │   │
│   │   │   └── common/          # 通用组件
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Dropdown.tsx
│   │   │
│   │   ├── hooks/              # React Hooks
│   │   │   ├── useAudio.ts
│   │   │   ├── useMedia.ts
│   │   │   ├── useEditor.ts
│   │   │   └── useProject.ts
│   │   │
│   │   ├── stores/             # Zustand状态管理
│   │   │   ├── audioStore.ts
│   │   │   ├── mediaStore.ts
│   │   │   ├── editorStore.ts
│   │   │   └── projectStore.ts
│   │   │
│   │   ├── services/           # API服务
│   │   │   ├── api.ts
│   │   │   ├── audioService.ts
│   │   │   ├── mediaService.ts
│   │   │   └── aiService.ts
│   │   │
│   │   ├── types/              # TypeScript类型
│   │   │   ├── audio.ts
│   │   │   ├── media.ts
│   │   │   ├── editor.ts
│   │   │   └── project.ts
│   │   │
│   │   ├── styles/             # 样式
│   │   │   ├── globals.css
│   │   │   └── components/
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
│
├── backend/                      # FastAPI后端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI入口
│   │   ├── config.py           # 配置
│   │   │
│   │   ├── api/                # API路由
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── audio.py    # 音频接口
│   │   │   │   ├── media.py    # 素材接口
│   │   │   │   ├── project.py  # 项目接口
│   │   │   │   ├── ai.py       # AI接口
│   │   │   │   └── export.py   # 导出接口
│   │   │   │
│   │   │   └── deps.py         # 依赖注入
│   │   │
│   │   ├── core/               # 核心模块
│   │   │   ├── __init__.py
│   │   │   ├── database.py     # 数据库连接
│   │   │   ├── security.py    # 安全认证
│   │   │   └── exceptions.py   # 异常处理
│   │   │
│   │   ├── models/             # 数据模型
│   │   │   ├── __init__.py
│   │   │   ├── project.py
│   │   │   ├── audio.py
│   │   │   ├── media.py
│   │   │   └── editor.py
│   │   │
│   │   ├── schemas/            # Pydantic模型
│   │   │   ├── __init__.py
│   │   │   ├── project.py
│   │   │   ├── audio.py
│   │   │   ├── media.py
│   │   │   └── editor.py
│   │   │
│   │   ├── services/           # 业务逻辑
│   │   │   ├── __init__.py
│   │   │   ├── audio_service.py
│   │   │   ├── media_service.py
│   │   │   ├── project_service.py
│   │   │   ├── ai_service.py
│   │   │   └── export_service.py
│   │   │
│   │   ├── crud/               # CRUD操作
│   │   │   ├── __init__.py
│   │   │   ├── project.py
│   │   │   ├── audio.py
│   │   │   └── media.py
│   │   │
│   │   └── utils/              # 工具函数
│   │       ├── __init__.py
│   │       ├── file_utils.py
│   │       └── text_utils.py
│   │
│   ├── requirements.txt
│   └── pyproject.toml
│
├── ai_services/                  # AI服务模块
│   ├── whisper/                # 语音识别
│   │   ├── __init__.py
│   │   ├── transcriber.py
│   │   └── keyword_extractor.py
│   │
│   ├── semantic/                # 语义匹配
│   │   ├── __init__.py
│   │   ├── embeddings.py
│   │   └── matcher.py
│   │
│   ├── generator/              # 素材生成
│   │   ├── __init__.py
│   │   ├── svg_generator.py
│   │   ├── image_generator.py
│   │   └── video_generator.py
│   │
│   └── requirements.txt
│
├── scrapers/                    # 爬虫模块
│   ├── __init__.py
│   ├── base.py                 # 爬虫基类
│   ├── unsplash.py             # Unsplash爬虫
│   ├── pixabay.py              # Pixabay爬虫
│   ├── pexels.py               # Pexels爬虫
│   ├── sound_effects.py        # 音效爬虫
│   └── config.py               # 爬虫配置
│
├── video_engine/                # 视频引擎
│   ├── __init__.py
│   ├── ffmpeg_wrapper.py       # FFmpeg封装
│   ├── timeline.py             # 时间轴处理
│   ├── compositor.py           # 合成器
│   ├── exporter.py             # 导出器
│   └── capcut_export.py        # 剪映导出
│
├── docker/                      # Docker配置
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.ai
│   └── nginx.conf
│
├── web/                         # Web端 (Next.js)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   └── ...
│
├── docs/                        # 文档
│   ├── SPEC.md
│   ├── API.md
│   └── DEPLOY.md
│
├── scripts/                     # 脚本
│   ├── setup.sh
│   ├── build.sh
│   └── dev.sh
│
├── Cargo.toml                   # Rust依赖
├── package.json                  # 前端依赖
├── pyproject.toml               # Python依赖
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. 前端架构 (Tauri + React)

### 3.1 组件架构

```
┌─────────────────────────────────────────────────────────────────┐
│                       MainLayout                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┬─────────────────────────────────────────┐  │
│  │     Sidebar     │              MainContent                 │  │
│  │                 │                                         │  │
│  │  ┌───────────┐  │  ┌─────────────────────────────────────┐│  │
│  │  │  项目列表  │  │  │                                     ││  │
│  │  └───────────┘  │  │                                     ││  │
│  │                 │  │                                     ││  │
│  │  ┌───────────┐  │  │           动态内容区域               ││  │
│  │  │  音频导入  │  │  │    (根据选中项目显示不同界面)        ││  │
│  │  └───────────┘  │  │                                     ││  │
│  │                 │  │                                     ││  │
│  │  ┌───────────┐  │  │                                     ││  │
│  │  │  素材库   │  │  │                                     ││  │
│  │  └───────────┘  │  │                                     ││  │
│  │                 │  │                                     ││  │
│  │  ┌───────────┐  │  │                                     ││  │
│  │  │  剪辑工作台 │ │  │                                     ││  │
│  │  └───────────┘  │  │                                     ││  │
│  │                 │  │                                     ││  │
│  │  ┌───────────┐  │  │                                     ││  │
│  │  │  设置    │  │  │                                     ││  │
│  │  └───────────┘  │  └─────────────────────────────────────┘│  │
│  └─────────────────┴─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 核心组件说明

#### 3.2.1 音频处理模块

| 组件 | 功能 | 状态 |
|------|------|------|
| AudioUploader | 拖拽上传音频文件 | ✅ |
| TranscriptEditor | 显示转录文案，支持高亮编辑 | ✅ |
| KeywordPanel | 显示提取的关键词（颜色分类） | ✅ |
| AudioWaveform | 音频波形显示 | ⬜ |

#### 3.2.2 素材库模块

| 组件 | 功能 | 状态 |
|------|------|------|
| MediaLibrary | 素材库主容器 | ✅ |
| MediaGrid | 网格视图显示素材 | ✅ |
| MediaList | 列表视图显示素材 | ⬜ |
| MediaPreview | 素材预览（图片/视频/音频） | ✅ |
| MediaFilters | 筛选器（类型/格式/标签） | ✅ |
| MediaSearch | 搜索框 | ✅ |

#### 3.2.3 剪辑编辑器模块

| 组件 | 功能 | 状态 |
|------|------|------|
| EditorWorkspace | 编辑器工作区容器 | ✅ |
| Timeline | 时间轴主容器 | ✅ |
| Track | 轨道组件 | ✅ |
| Clip | 片段组件 | ✅ |
| Playhead | 播放头 | ✅ |
| VideoPreview | 视频预览播放器 | ✅ |
| GridOverlay | 网格叠加层 | ✅ |
| PropertyPanel | 属性面板 | ✅ |
| AnimationSettings | 动画设置 | ✅ |

### 3.3 状态管理 (Zustand)

```typescript
// 示例：编辑器状态
interface EditorState {
  // 项目数据
  project: Project | null;

  // 时间轴数据
  tracks: Track[];
  playheadPosition: number;
  selectedClipId: string | null;

  // 编辑器工具
  activeTool: 'select' | 'cut' | 'trim';

  // 预览设置
  playbackSpeed: number;
  volume: number;
  showGrid: boolean;
  gridSettings: GridSettings;

  // 操作
  setProject: (project: Project) => void;
  addTrack: (track: Track) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  setPlayheadPosition: (position: number) => void;
  // ...
}
```

---

## 4. 后端架构 (FastAPI)

### 4.1 API路由结构

```
/api/v1
├── /audio
│   ├── POST   /transcribe           # 转录音频
│   ├── POST   /extract-keywords     # 提取关键词
│   ├── GET    /{audio_id}/waveform  # 获取波形
│   └── GET    /{audio_id}/segments  # 获取分段
│
├── /media
│   ├── GET    /                      # 获取素材列表
│   ├── POST   /upload                # 上传素材
│   ├── DELETE /{media_id}            # 删除素材
│   ├── GET    /{media_id}/preview    # 获取预览
│   ├── POST   /search                # 搜索素材
│   ├── POST   /scrape                 # 爬取素材
│   └── GET    /categories            # 获取分类
│
├── /project
│   ├── GET    /                      # 获取项目列表
│   ├── POST   /                      # 创建项目
│   ├── GET    /{project_id}          # 获取项目详情
│   ├── PUT    /{project_id}          # 更新项目
│   ├── DELETE /{project_id}          # 删除项目
│   └── GET    /{project_id}/export   # 导出项目
│
├── /ai
│   ├── POST   /match                 # 语义匹配
│   ├── POST   /generate/svg          # 生成SVG动画
│   ├── POST   /generate/image        # 生成PNG图片
│   ├── POST   /generate/video        # 生成视频
│   ├── POST   /recognize             # 识别素材内容
│   └── POST   /scrape-missing        # 爬取缺失素材
│
├── /editor
│   ├── GET    /timeline              # 获取时间轴
│   ├── POST   /timeline/clip         # 添加片段
│   ├── PUT    /timeline/clip/{id}    # 更新片段
│   ├── DELETE /timeline/clip/{id}    # 删除片段
│   └── POST   /render                 # 渲染预览
│
└── /export
    ├── POST   /video                 # 导出视频
    ├── POST   /capcut                # 导出剪映草稿
    ├── POST   /assets                 # 导出素材
    └── GET    /progress/{task_id}    # 获取导出进度
```

### 4.2 服务层设计

```python
# 示例：音频服务
class AudioService:
    def __init__(self, whisper_model):
        self.whisper = whisper_model

    async def transcribe(self, audio_path: str) -> TranscriptionResult:
        """转录音频"""
        pass

    def extract_keywords(self, text: str) -> List[Keyword]:
        """提取关键词"""
        pass

    def get_waveform(self, audio_path: str) -> WaveformData:
        """获取波形数据"""
        pass
```

### 4.3 数据库模型

#### 4.3.1 项目表 (projects)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(255) | 项目名称 |
| description | TEXT | 项目描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| settings | JSON | 项目设置 |

#### 4.3.2 音频表 (audio_files)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目 |
| file_path | VARCHAR(500) | 文件路径 |
| duration | FLOAT | 时长(秒) |
| transcription | TEXT | 转录文本 |
| segments | JSON | 分段数据 |
| keywords | JSON | 关键词数据 |

#### 4.3.3 素材表 (media_files)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目 |
| file_path | VARCHAR(500) | 文件路径 |
| media_type | ENUM | 类型(图片/视频/音频/动画) |
| format | VARCHAR(50) | 格式 |
| duration | FLOAT | 时长(视频/音频) |
| tags | JSON | 标签 |
| embeddings | BLOB | 向量嵌入 |
| source | ENUM | 来源(爬取/生成/本地) |
| matched_keywords | JSON | 匹配的关键词 |

#### 4.3.4 时间轴表 (timeline)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目 |
| tracks | JSON | 轨道数据 |

---

## 5. 数据模型

### 5.1 TypeScript 类型定义

```typescript
// 项目
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  audioFile?: AudioFile;
  timeline: Timeline;
  mediaLibrary: MediaFile[];
}

// 音频
interface AudioFile {
  id: string;
  filePath: string;
  fileName: string;
  duration: number;
  waveformData: number[];
  transcription: Transcription;
}

interface Transcription {
  fullText: string;
  segments: AudioSegment[];
  keywords: Keyword[];
}

interface AudioSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  keywords: Keyword[];
}

interface Keyword {
  word: string;
  category: 'person' | 'location' | 'object' | 'action' | 'emotion' | 'other';
  color: string;
  position: { start: number; end: number };
}

// 素材
interface MediaFile {
  id: string;
  projectId: string;
  filePath: string;
  fileName: string;
  mediaType: 'image' | 'video' | 'audio' | 'svg';
  format: string;
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: string;
  tags: string[];
  source: 'scraped' | 'generated' | 'local';
  matchedSegments: string[];
}

// 时间轴
interface Timeline {
  duration: number;
  tracks: Track[];
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'effect';
  clips: Clip[];
  muted: boolean;
  locked: boolean;
  visible: boolean;
}

interface Clip {
  id: string;
  mediaId?: string;
  startTime: number;
  endTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  position: { x: number; y: number };
  scale: { x: number; y: number };
  rotation: number;
  opacity: number;
  volume: number;
  animations: Animation[];
  transitions: Transition[];
}

// 动画
interface Animation {
  type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'custom';
  direction?: 'in' | 'out';
  duration: number;
  delay: number;
  easing: string;
}

// 网格设置
interface GridSettings {
  enabled: boolean;
  type: 'lines' | 'dots' | 'random-dots';
  color: string;
  opacity: number;
  spacing: number;
  dotSize?: number;
}
```

### 5.2 Pydantic Schema

```python
# 项目Schema
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 音频Schema
class AudioSegmentSchema(BaseModel):
    id: str
    start_time: float
    end_time: float
    text: str

class KeywordSchema(BaseModel):
    word: str
    category: str
    color: str

class TranscriptionSchema(BaseModel):
    full_text: str
    segments: List[AudioSegmentSchema]
    keywords: List[KeywordSchema]

# 素材Schema
class MediaFileBase(BaseModel):
    file_name: str
    media_type: MediaType
    tags: List[str] = []

class MediaFileCreate(MediaFileBase):
    project_id: UUID
    file_path: str

class MediaFileResponse(MediaFileBase):
    id: UUID
    thumbnail: Optional[str]
    source: MediaSource

    class Config:
        from_attributes = True
```

---

## 6. AI模块设计

### 6.1 Whisper 语音识别

```python
# whisper/transcriber.py
class WhisperTranscriber:
    def __init__(self, model_name: str = "base"):
        self.model = WhisperModel(model_name, device="cuda")

    async def transcribe(self, audio_path: str) -> TranscriptionResult:
        """转录音频并返回分段结果"""
        segments, info = self.model.transcribe(
            audio_path,
            beam_size=5,
            language="auto",
            condition_on_previous_text=True
        )

        return TranscriptionResult(
            full_text=info.text if hasattr(info, 'text') else "",
            segments=[
                Segment(
                    start=s.start,
                    end=s.end,
                    text=s.text
                ) for s in segments
            ]
        )
```

### 6.2 关键词提取

```python
# whisper/keyword_extractor.py
class KeywordExtractor:
    CATEGORIES = {
        'person': '#FF6B6B',      # 红色
        'location': '#4ECDC4',    # 青色
        'object': '#45B7D1',      # 蓝色
        'action': '#96CEB4',      # 绿色
        'emotion': '#FFEAA7',     # 黄色
        'other': '#DFE6E9'        # 灰色
    }

    def extract_keywords(self, text: str) -> List[Keyword]:
        """使用NLP提取关键词并分类"""
        # 使用 spaCy 或 HanLP 进行实体识别和关键词提取
        # 返回带颜色标注的关键词列表
        pass
```

### 6.3 语义匹配 (Sentence Transformers)

```python
# semantic/matcher.py
class SemanticMatcher:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.embeddings_cache = {}

    async def find_matches(
        self,
        query_keywords: List[str],
        candidate_media: List[MediaFile],
        threshold: float = 0.6
    ) -> List[MatchResult]:
        """语义匹配关键词和素材"""

        # 生成查询向量
        query_embedding = self.model.encode(query_keywords)

        # 生成候选素材向量
        for media in candidate_media:
            if media.id not in self.embeddings_cache:
                media_embedding = self.model.encode(media.tags)
                self.embeddings_cache[media.id] = media_embedding

        # 计算相似度
        matches = []
        for media in candidate_media:
            similarity = cosine_similarity(
                query_embedding,
                self.embeddings_cache[media.id]
            )
            if similarity >= threshold:
                matches.append(MatchResult(
                    media_id=media.id,
                    similarity=similarity,
                    matched_keywords=self._get_matched_keywords(query_keywords, media.tags)
                ))

        return sorted(matches, key=lambda x: x.similarity, reverse=True)
```

### 6.4 SVG动画生成

```python
# generator/svg_generator.py
import drawsvg as draw

class SVGGenerator:
    ANIMATION_TYPES = ['fade', 'scale', 'bounce', 'slide', 'rotate']

    def generate_animation(
        self,
        keywords: List[str],
        animation_type: str = 'fade',
        duration: float = 1.0
    ) -> str:
        """根据关键词生成SVG动画"""

        d = draw.Drawing(800, 600)

        # 根据关键词生成图形
        shapes = self._generate_shapes_from_keywords(keywords)

        for shape in shapes:
            if animation_type == 'fade':
                shape.append(draw.animate(
                    'opacity',
                    dur=f"{duration}s",
                    values="0;1",
                    fill="freeze"
                ))
            elif animation_type == 'bounce':
                # 弹跳动画
                pass
            # ...

        return d.as_str()
```

### 6.5 图片生成 (Stable Diffusion)

```python
# generator/image_generator.py
class ImageGenerator:
    def __init__(self, sd_api_url: str = "http://localhost:7860"):
        self.api_url = f"{sd_api_url}/sdapi/v1"

    async def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = 512,
        height: int = 512,
        style: str = "photorealistic"
    ) -> ImageResult:
        """通过Stable Diffusion生成图片"""

        style_prompts = {
            "photorealistic": "photorealistic, 8k, highly detailed",
            "anime": "anime style, vibrant colors",
            "illustration": "digital illustration, artstation",
            "oil_painting": "oil painting style, classical",
            "sketch": "pencil sketch, hand drawn"
        }

        payload = {
            "prompt": f"{prompt}, {style_prompts.get(style, '')}",
            "negative_prompt": negative_prompt or "blurry, low quality, deformed",
            "width": width,
            "height": height,
            "steps": 30,
            "cfg_scale": 7.5
        }

        response = requests.post(f"{self.api_url}/txt2img", json=payload)

        return ImageResult(
            image_base64=response.json()['images'][0],
            seed=response.json().get('parameters', {}).get('seed')
        )
```

### 6.6 素材识别

```python
# ai_services/recognizer.py
class MediaRecognizer:
    def __init__(self):
        self.image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.video_model = VideoRecognitionModel()

    async def recognize_image(self, image_path: str) -> RecognitionResult:
        """识别图片内容"""
        # 使用CLIP模型识别图片内容
        # 返回标签和描述
        pass

    async def recognize_video(self, video_path: str) -> List[VideoSegment]:
        """识别视频内容并分段"""
        # 提取关键帧
        # 识别每帧内容
        # 返回时间戳和内容描述
        pass

    async def extract_key_frames(self, video_path: str) -> List[KeyFrame]:
        """提取关键帧"""
        # 使用场景检测算法提取关键帧
        pass
```

---

## 7. 素材爬虫模块

### 7.1 爬虫架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     ScraperManager                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    BaseScraper                              │ │
│  │  - rate_limit()    - retry()    - parse()                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│        ┌─────────────────────┼─────────────────────┐            │
│        │                     │                     │            │
│        ▼                     ▼                     ▼            │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐     │
│  │ Unsplash │         │  Pixabay  │         │   Pexels  │     │
│  │ Scraper  │         │  Scraper  │         │  Scraper  │     │
│  └───────────┘         └───────────┘         └───────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   SoundEffectScraper                        │ │
│  │  - freesound.org   - soundbible.com   - mixkit.co           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   MissingAssetTracker                       │ │
│  │  - 记录爬取失败的关键词                                       │ │
│  │  - 标记为"待AI生成"                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 爬虫基类

```python
# scrapers/base.py
class BaseScraper:
    def __init__(self):
        self.session = httpx.AsyncClient()
        self.rate_limit_delay = 1.0  # 请求间隔
        self.max_retries = 3

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        """搜索素材"""
        raise NotImplementedError

    async def download(self, url: str, save_path: str) -> bool:
        """下载素材"""
        for attempt in range(self.max_retries):
            try:
                response = await self.session.get(url, timeout=30)
                response.raise_for_status()
                # 保存文件
                return True
            except Exception as e:
                await asyncio.sleep(self.rate_limit_delay)
        return False

    async def close(self):
        await self.session.aclose()
```

### 7.3 素材下载流程

```python
# scrapers/manager.py
class ScraperManager:
    def __init__(self):
        self.scrapers = {
            'unsplash': UnsplashScraper(),
            'pixabay': PixabayScraper(),
            'pexels': PexelsScraper(),
            'sound': SoundEffectScraper()
        }
        self.missing_tracker = MissingAssetTracker()

    async def scrape_for_keywords(
        self,
        keywords: List[str],
        media_type: str = 'image'
    ) -> ScrapeResult:
        """根据关键词爬取素材"""

        results = []
        missing_keywords = []

        for keyword in keywords:
            found = False
            for scraper_name, scraper in self.scrapers.items():
                items = await scraper.search(keyword, limit=10)
                if items:
                    results.extend(items)
                    found = True

            if not found:
                missing_keywords.append(keyword)
                await self.missing_tracker.add_missing(keyword, media_type)

        return ScrapeResult(
            scraped=results,
            missing_keywords=missing_keywords
        )
```

---

## 8. 视频剪辑引擎

### 8.1 FFmpeg封装

```python
# video_engine/ffmpeg_wrapper.py
class FFmpegWrapper:
    def __init__(self):
        self.ffmpeg_path = "ffmpeg"  # 或 Docker中的路径

    async def extract_audio(self, video_path: str, output_path: str):
        """提取音频"""
        cmd = [
            self.ffmpeg_path, '-i', video_path,
            '-vn', '-acodec', 'libmp3lame',
            '-y', output_path
        ]
        await subprocess.run(cmd)

    async def trim_video(
        self,
        input_path: str,
        output_path: str,
        start: float,
        duration: float
    ):
        """裁剪视频片段"""
        cmd = [
            self.ffmpeg_path, '-ss', str(start),
            '-i', input_path,
            '-t', str(duration),
            '-c', 'copy',
            '-y', output_path
        ]
        await subprocess.run(cmd)

    async def generate_waveform(self, audio_path: str, output_path: str):
        """生成音频波形图"""
        cmd = [
            self.ffmpeg_path, '-i', audio_path,
            '-filter_complex', 'compand,showwavespic=s=800x200',
            '-frames:v', '1',
            '-y', output_path
        ]
        await subprocess.run(cmd)

    async def composite_video(
        self,
        inputs: List[CompositionInput],
        output_path: str
    ):
        """合成视频"""
        # 实现复杂的多轨道视频合成
        pass
```

### 8.2 时间轴处理

```python
# video_engine/timeline.py
@dataclass
class TimelineProcessor:
    timeline: Timeline
    ffmpeg: FFmpegWrapper

    async def render_preview(self) -> bytes:
        """渲染预览视频"""

        # 收集所有需要的片段
        clips = self._collect_active_clips()

        # 创建临时文件列表
        temp_files = []
        for i, clip in enumerate(clips):
            temp_file = f"/tmp/clip_{i}.mp4"
            await self.ffmpeg.trim_video(
                clip.source_path,
                temp_file,
                clip.in_point,
                clip.duration
            )
            temp_files.append(temp_file)

        # 合并片段
        # 应用转场
        # 添加字幕
        # 输出预览

    async def export_video(self, output_path: str, quality: str = 'high'):
        """导出最终视频"""
        pass
```

### 8.3 剪映导出

```python
# video_engine/capcut_export.py
class CapCutExporter:
    """导出剪映草稿格式"""

    def export_draft(self, timeline: Timeline, output_dir: str) -> str:
        """导出剪映草稿"""

        # 创建草稿目录结构
        draft_dir = Path(output_dir)
        media_dir = draft_dir / "media"
        media_dir.mkdir(parents=True, exist_ok=True)

        # 生成 draft_content.json
        content = self._generate_draft_content(timeline)
        with open(draft_dir / "draft_content.json", 'w') as f:
            json.dump(content, f, indent=2)

        # 生成 draft_meta_info.json
        meta = self._generate_draft_meta(timeline)
        with open(draft_dir / "draft_meta_info.json", 'w') as f:
            json.dump(meta, f, indent=2)

        # 复制媒体文件
        self._copy_media_files(timeline, media_dir)

        return str(draft_dir)

    def _generate_draft_content(self, timeline: Timeline) -> dict:
        """生成剪映草稿内容"""
        return {
            "canvas_config": {
                "height": 1080,
                "ratio": "16:9",
                "width": 1920
            },
            "fps": 30.0,
            "duration": timeline.duration * 1000000,  # 微秒
            "materials": {
                "videos": self._export_videos(timeline),
                "images": self._export_images(timeline),
                "audios": self._export_audios(timeline)
            },
            "tracks": self._export_tracks(timeline)
        }
```

---

## 9. Web端设计

### 9.1 页面结构

```
/ (首页 - 项目列表)
/projects (项目列表)
/projects/:id (项目详情)
/editor/:id (编辑器)
/settings (设置)
/login (登录)
```

### 9.2 Web端功能

| 功能 | 说明 |
|------|------|
| 项目管理 | 查看、创建、编辑、删除项目 |
| 素材浏览 | 浏览和搜索素材库 |
| 轻量编辑 | 基础的剪辑功能 |
| 预览 | 视频预览（不含复杂编辑） |

### 9.3 与桌面端共享

- 共用同一套 FastAPI 后端
- 共享数据库和文件系统
- Web端作为轻量访问接口

---

## 10. 部署方案

### 10.1 Docker Compose 配置

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    ports:
      - "8000:8000"
    volumes:
      - ../data:/app/data
      - ../media:/app/media
    environment:
      - DATABASE_URL=sqlite:///./data/lingjian.db
      - CHROMA_DB_PATH=/app/data/chromadb
    depends_on:
      - redis

  ai-service:
    build:
      context: ..
      dockerfile: docker/Dockerfile.ai
    ports:
      - "7860:7860"  # ComfyUI
      - "8001:8001"  # Whisper
    volumes:
      - ../models:/app/models
      - ../media:/app/media
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

### 10.2 本地开发模式

```bash
# 1. 启动后端服务
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2. 启动AI服务 (Docker)
docker-compose -f docker/docker-compose.yml up ai-service

# 3. 启动前端
cd frontend
npm install
npm run tauri dev
```

### 10.3 生产部署模式

```bash
# 1. 构建桌面端
npm run tauri build

# 2. 构建Docker镜像
docker-compose -f docker/docker-compose.yml build

# 3. 启动服务
docker-compose -f docker/docker-compose.yml up -d
```

---

## 附录

### A. 依赖清单

#### 前端依赖
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-shell": "^2.0.0",
    "zustand": "^4.5.0",
    "react-router-dom": "^6.22.0",
    "i18next": "^23.10.0",
    "react-i18next": "^14.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "@tanstack/react-query": "^5.24.0",
    "axios": "^1.6.7"
  }
}
```

#### 后端依赖
```txt
# backend/requirements.txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
sqlalchemy==2.0.25
aiosqlite==0.19.0
httpx==0.26.0
python-multipart==0.0.6
```

#### AI服务依赖
```txt
# ai_services/requirements.txt
torch==2.2.0
transformers==4.37.0
sentence-transformers==2.3.1
faster-whisper==1.0.3
clip==0.1.0
Pillow==10.2.0
```

### B. 环境变量

```bash
# .env.example
# 数据库
DATABASE_URL=sqlite:///./data/lingjian.db
CHROMA_DB_PATH=./data/chromadb

# AI服务
WHISPER_MODEL=base
SD_API_URL=http://localhost:7860
COMFYUI_URL=http://localhost:7860

# 爬虫
UNSPLASH_API_KEY=
PIXABAY_API_KEY=

# 文件路径
MEDIA_ROOT=./media
TEMP_DIR=./temp
```

---

**文档状态**: 待完善
**下一步**: 确认后开始详细设计和实现
