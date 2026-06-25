# 剪映AI草稿生成Agent — 产品设计文档

> 版本: v1.0 | 日期: 2026-06-26 | 状态: 待审核

## 一、产品概述

### 1.1 产品定位

一款类花生AI的AI视频创作SaaS平台，核心差异化能力是**自动生成剪映专业版可直接打开的草稿文件**。用户上传音频或输入文案后，AI自动完成语音识别、文案分析、分镜规划、AI生图、智能布局、入场动画编排，最终输出可在剪映中二次编辑的草稿文件和MP4预览视频。

### 1.2 参考产品

- **花生AI** (huasheng.cn)：文案/音频驱动的AI视频创作平台，提供对话式编辑和一键成片
- **本产品差异点**：输出剪映原生草稿文件（.zip草稿包），而非仅MP4视频；支持用户在剪映中做专业级二次编辑

### 1.3 MVP范围

| 维度 | MVP支持 |
|------|---------|
| 视频比例 | 仅16:9横屏 |
| 输入方式 | 音频上传 + 文案输入（TTS配音） |
| 输出 | 剪映草稿包(.zip) + MP4视频预览/导出 |
| 编辑方式 | 可视化分镜编辑器（拖拽/缩放/替换/调整） |
| 用户系统 | 手机号+验证码/密码登录，找回密码，微信绑定（UI先行） |
| 通知 | 微信公众号任务完成通知 + 菜单查进度 |
| 字幕 | 用户可选开启/关闭，多样式选择 |
| BGM | 用户上传BGM，不提供BGM库 |
| 音效 | 支持（MVP基础音效集） |
| AI服务 | 国内大模型API（豆包ASR/TTS、通义千问NLP、通义万相/即梦图像） |
| 透明图 | AI直出透明PNG优先，AI抠图兜底 |

---

## 二、系统架构

### 2.1 架构总览

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (Next.js 14)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│  │ 登录/注册 │ │ 个人空间  │ │ 创作向导  │ │ 可视化分镜编辑器    │ │
│  │·找回密码 │ │·项目列表  │ │·上传音频  │ │·预览编辑区(16:9)  │ │
│  │·微信登录 │ │·用量统计  │ │·文案校对  │ │·拖拽/缩放/调整     │ │
│  │(UI预留)  │ │·回收站   │ │·音色选择  │ │·分镜时间线         │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
│         ↓ WebSocket实时进度    ↓ 导出下载/草稿包                  │
└─────────────────┬───────────────────────────────────────────────┘
                  │ REST API + WebSocket
┌─────────────────▼───────────────────────────────────────────────┐
│                    API Gateway (FastAPI)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────────┐ │
│  │ 用户认证  │ │ 项目CRUD  │ │ 任务查询  │ │ WebSocket进度推送   │ │
│  │微信绑定   │ │草稿/视频下载│ │用量统计  │ │ 导出服务           │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────────────┘ │
└────────┬─────────────────┬──────────────────┬───────────────────┘
         │                 │                  │
    ┌────▼────┐     ┌──────▼──────┐    ┌──────▼──────┐
    │PostgreSQL│    │    Redis     │    │  阿里云OSS  │
    │ 用户/项目│    │ 任务队列/缓存│    │ 图片/音频/   │
    │ 分镜/草稿│    │ 进度状态     │    │ 草稿/视频    │
    └─────────┘    └─────────────┘    └─────────────┘
                          │
              ┌───────────▼───────────┐
              │  Celery 任务队列       │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Pipeline Wkr │  │ Pipeline Wkr │  │ Notification │
│ (ASR+NLP     │  │ (图像生成+抠图│  │ Wkr          │
│  +分镜+布局) │  │  +动画+合成) │  │(微信通知)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────────────────────────────────────────┐
│              AI 服务适配层                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐   │
│  │豆包ASR│ │通义NLP│ │万相/即梦│ │AI抠图服务    │   │
│  └──────┘ └──────┘ └──────┘ │(智能抠图API) │   │
│  ┌──────┐ ┌──────┐           └──────────────┘   │
│  │豆包TTS│ │FFmpeg│                               │
│  └──────┘ └──────┘                               │
└──────────────────────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │  微信公众号服务        │
              │  - 模板消息通知        │
              │  - 菜单回调查进度      │
              │  - 扫码绑定账号       │
              └───────────────────────┘
```

### 2.2 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 前端 | Next.js 14 (App Router) + React + TypeScript | 14+ |
| UI | TailwindCSS + shadcn/ui | latest |
| 状态管理 | Zustand | latest |
| 拖拽交互 | React-Konva / DnD-Kit | latest |
| 音频波形 | WaveSurfer.js | latest |
| 后端 | FastAPI (Python 3.11+) | 0.100+ |
| ORM | SQLAlchemy 2.0 (async) + Alembic | latest |
| 数据库 | PostgreSQL 15 | 15+ |
| 缓存/队列 | Redis 7 + Celery 5 | latest |
| 对象存储 | 阿里云OSS（开发用MinIO） | - |
| 视频处理 | FFmpeg 6.x | 6.x |
| AI-ASR/TTS | 豆包（火山引擎） | - |
| AI-NLP | 通义千问 / 豆包 | - |
| AI-图像 | 通义万相 / 即梦 | - |
| AI-抠图 | 第三方抠图API | - |
| 微信 | wechatpy | latest |
| 部署 | Docker + Docker Compose + Nginx | - |

---

## 三、核心Pipeline流程

整个视频生成过程分为 **8个阶段**，每个阶段独立执行、独立失败重试、独立更新进度。Worker在后端独立运行，用户关闭网页不中断任务。

### 阶段1：内容获取与ASR/TTS
- **音频模式**：调用豆包ASR语音识别 → 文本+词级时间戳
- **文案模式**：用户选择音色 → 调用豆包TTS生成配音音频
- **进度**：10%，"正在识别语音..." / "正在合成配音..."
- **输出**：完整文案 + 每个词的时间戳

### 等待用户确认文案（必经步骤）
前端展示文案校对页面，用户可编辑文字、调整分句、删除段落。播放音频时当前句子高亮同步。用户点击"确认文案"后启动后续阶段。

### 阶段2：NLP智能分析
调用大模型NLP分析，提取：
- 智能分句：按语义和声波停顿切分句子
- 智能分段：句子聚合为段落/分镜单元
- 关键词提取：核心名词、动词、场景词
- 关键物体识别：需生成PNG前景的物体（含描述、角色类型、位置提示）
- 场景描述：每段的整体画面氛围/背景
- 情感基调：欢快/严肃/温馨/悲伤
- **进度**：25%，"正在分析文案内容..."

### 阶段3：分镜时间对齐
- 将每个分镜映射到音频时间轴
- 每个分镜不超过10秒，超过自动拆分
- 确保分镜总时长 = 音频总时长
- **进度**：35%，"正在规划分镜时间线..."

### 阶段4：批量图像生成（可并行）
- 4a. **背景图**：每个分镜1张16:9无水印图，Prompt = 场景描述+情感基调+16:9
- 4b. **前景PNG**：每个关键物体1张透明背景PNG，Prompt = 物体描述+"透明背景PNG格式无背景"
- 直出透明PNG → 检测alpha通道 → 不透明则自动触发抠图API兜底
- **进度**：40%-70%，实时更新"正在生成第X/Y张图片..."

### 阶段5：智能布局引擎
- 为每个前景物体计算：缩放比例、位置坐标、入场时间、出场时间、动画类型
- 遵循约束：不出框、不重叠、比例适中、时间对齐、层级正确
- 5锚点分区（TL/TC/TR/ML/C/MR/BL/BC/BR）+ 碰撞检测
- 动画智能选择（基于物体类型、位置、优先级）
- **进度**：75%，"正在编排画面布局..."

### 阶段6：字幕生成（用户可选）
- 根据ASR时间戳生成字幕
- 应用用户选择的字幕样式（字体/颜色/大小/位置）
- **进度**：80%，"正在生成字幕..."

### 阶段7：剪映草稿生成
- 构建剪映草稿目录结构（基于逆向分析的实际草稿格式）
- 生成 `template.json`（核心未加密文件，包含tracks/segments/materials/animations）
- 复制素材文件到正确目录
- 生成配套JSON配置文件
- 打包为zip上传OSS
- **进度**：85%，"正在生成剪映草稿..."

### 阶段8：云端视频渲染
- FFmpeg合成MP4（背景图+前景动画+音频+字幕烧录）
- 支持1080p导出
- **进度**：90%-98%，"正在渲染视频..."

### 完成
- WebSocket推送完成状态给在线用户
- 微信公众号发送模板消息通知
- 用户进入编辑器预览或直接下载

---

## 四、前端页面设计

### 4.1 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 产品介绍、功能展示、CTA按钮 |
| `/login` | 登录页 | 手机号+验证码 / 密码登录，微信扫码入口(UI预留) |
| `/register` | 注册页 | 手机号+验证码+密码 |
| `/forgot-password` | 找回密码 | 手机号验证码重置密码 |
| `/workspace` | 个人空间 | 项目列表（卡片/列表视图）、状态筛选、用量统计 |
| `/workspace/settings` | 账号设置 | 绑定微信、修改密码、音色收藏 |
| `/create` | 创建项目向导 | 选择模式、上传/输入、字幕配置、BGM上传 |
| `/project/:id/transcript` | 文案校对页 | 音频播放器+波形+句子编辑器 |
| `/project/:id/editor` | 可视化编辑器 | 核心编辑页面 |
| `/project/:id/preview` | 预览导出页 | 视频预览+草稿/视频下载 |

### 4.2 可视化编辑器布局

```
┌─────────────────────────────────────────────────────────┐
│ 顶栏: 项目名称 | 保存 | 撤销/重做 | 播放预览 | 导出按钮  │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│ 素材面板  │    预览编辑区（严格16:9）     │  属性面板     │
│          │                              │               │
│ ·背景图片  │  ┌──────────────────────┐  │ ·选中元素属性  │
│ ·前景PNG  │  │                      │  │ ·位置X/Y     │
│ ·音频/BGM │  │   统一预览画面         │  │ ·缩放/旋转   │
│ ·字幕样式  │  │   编辑:可拖拽选中     │  │ ·入场动画    │
│          │  │   播放:动画预览        │  │ ·出现时间    │
│          │  │                      │  │ ·动画时长    │
│          │  └──────────────────────┘  │               │
│          │  底部: 播放/暂停/进度条     │               │
├──────────┴──────────────────────────────┴───────────────┤
│ 分镜时间线（底部）                                        │
│ ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐                    │
│ │分镜1 ││分镜2 ││分镜3 ││分镜4 ││分镜5 │ ...              │
│ │2.3s ││3.1s ││1.8s ││4.2s ││2.8s │                    │
│ └─────┘└─────┘└─────┘└─────┘└─────┘                    │
│ 音频波形可视化 + 字幕轨道                                  │
└─────────────────────────────────────────────────────────┘
```

- **预览编辑区**严格保持16:9等比缩放，所见即所得
- **编辑模式**：静态画面，前景可点击选中、拖拽移动、边角缩放
- **播放模式**：执行入场动画，同步音频和字幕，不可编辑，暂停回到编辑模式
- **自动保存**：每次操作自动保存到后端

### 4.3 个人空间功能

- 项目列表：卡片/列表视图切换，封面+标题+时长+状态标签+创建时间
- 状态标签：排队中/处理中/待校对/编辑中/已完成/失败
- 操作：继续编辑、复制、下载草稿包、导出视频、删除（软删除→回收站）
- 用量统计：本月生成次数、图片生成数量、剩余额度
- 回收站：30天内可恢复，支持永久删除

---

## 五、数据模型

### 5.1 PostgreSQL核心表

**users（用户表）**
- id (UUID PK), phone (VARCHAR UNIQUE), password_hash, nickname, avatar_url
- wechat_openid (UNIQUE,可空), wechat_unionid
- quota_monthly, quota_used, quota_reset_date
- is_active, created_at, updated_at

**projects（项目表）**
- id (UUID PK), user_id (FK), title, mode (audio/text)
- status (queued/processing/waiting_confirm/analyzing/generating_images/layouting/generating_subtitle/generating_draft/rendering/completed/failed)
- current_stage (1-8), progress (0-100), progress_message
- duration_us, canvas_width(1708), canvas_height(960)
- subtitle_enabled, subtitle_style (JSONB), bgm_file_id (FK)
- original_audio_id (FK), draft_zip_path, preview_video_path, export_video_path
- cover_image_path, error_message, celery_task_id
- created_at, updated_at

**files（文件表）**
- id (UUID PK), user_id (FK), project_id (FK)
- file_type (audio/image/video/draft_zip/subtitle)
- source (upload/aigc/generated/tts/matting)
- filename, oss_key, mime_type, file_size
- width, height, duration_us, metadata (JSONB)
- created_at

**transcripts（文案表）**
- id (UUID PK), project_id (FK)
- content (用户确认版), original_content (ASR原始版)
- words (JSONB: [{word, start_us, end_us}])
- is_confirmed, tts_voice_id
- created_at, updated_at

**shots（分镜表）**
- id (UUID PK), project_id (FK), index (序号)
- start_us, end_us, text
- scene_description, keywords (JSONB), emotion
- bg_image_id (FK), bg_prompt
- bg_scale, bg_transform_x, bg_transform_y
- created_at

**foreground_objects（前景物体表）**
- id (UUID PK), shot_id (FK), name
- image_id (FK), matting_image_id (FK), prompt
- scale, position_x, position_y, rotation
- appear_time_us, disappear_time_us
- animation_type, animation_duration_us, z_index
- created_at

**subtitles（字幕表）**
- id (UUID PK), project_id (FK), index
- start_us, end_us, text, style (JSONB)

**celery_task_logs（任务日志表）**
- id (UUID PK), project_id (FK), stage, stage_name
- status (pending/running/success/failed/retrying)
- progress, message, error_detail
- started_at, finished_at

**wechat_bindings（微信绑定表）**
- id (UUID PK), user_id (FK), openid, unionid
- nickname, avatar_url, subscribed, bound_at

**diagnose_records（诊断记录表）**
- id (UUID PK)
- started_at (TIMESTAMP), finished_at (TIMESTAMP)
- status (running/completed/failed)
- total_checks (INTEGER), passed (INTEGER), warnings (INTEGER), failed (INTEGER)
- results (JSONB) — 每项检查结果：[{module, item, status, message, fixable, fix_action, fix_result}]
- triggered_by (VARCHAR) — auto(保存配置后自动)/manual(手动触发)
- created_at (TIMESTAMP)

**system_notifications（系统通知/公告表）**
- id (UUID PK)
- type (VARCHAR(30)) — upgrade(系统升级)/bugfix(BUG修复)/maintenance(维护通知)/announcement(公告)
- title (VARCHAR(200)) — 通知标题
- content (TEXT) — 通知正文
- status (VARCHAR(20)) — draft(草稿)/sending(发送中)/sent(已发送)/failed(发送失败)
- send_scope (VARCHAR(20)) — all(所有用户)/active(活跃用户)/wechat_bound(已绑定微信用户)
- total_recipients (INTEGER) — 预计发送人数
- sent_count (INTEGER) — 已成功发送人数
- failed_count (INTEGER) — 发送失败人数
- trigger_source (VARCHAR(50)) — diagnose_fix(诊断修复后)/deploy(部署完成后)/manual(手动创建)
- related_diagnose_id (UUID FK,可空) — 关联的诊断记录ID
- scheduled_at (TIMESTAMP) — 计划发送时间
- sent_at (TIMESTAMP) — 实际发送完成时间
- created_by (UUID FK,可空) — 创建人（手动创建时）
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**notification_logs（通知发送日志表）**
- id (UUID PK)
- notification_id (UUID FK)
- user_id (UUID FK)
- channel (VARCHAR(20)) — wechat/email/in_app
- status (VARCHAR(20)) — pending/sent/failed
- wechat_msgid (VARCHAR(100),可空) — 微信消息ID
- error_message (TEXT,可空)
- sent_at (TIMESTAMP,可空)
- created_at (TIMESTAMP)

**system_configs（系统配置表——第三方服务密钥与参数）**
- id (UUID PK)
- category (VARCHAR(50)) — 配置分类：ai_asr / ai_tts / ai_nlp / ai_image / ai_matting / sms / oss / wechat / system
- key (VARCHAR(100)) — 配置键名（如 doubao_access_key、qwen_api_key）
- value (TEXT) — 配置值（密钥类加密存储）
- value_type (VARCHAR(20)) — 类型：string / int / float / bool / json
- description (VARCHAR(500)) — 配置说明
- is_secret (BOOLEAN) — 是否为敏感密钥（返回时脱敏显示）
- is_enabled (BOOLEAN) — 是否启用（可临时关闭某服务商切换备用）
- updated_at (TIMESTAMP)
- UNIQUE(category, key)

**预置配置项清单：**

| category | key | 说明 | 类型 | 是否密钥 |
|----------|-----|------|------|---------|
| ai_asr | provider | 当前ASR服务商(doubao/aliyun/tencent) | string | 否 |
| ai_asr | doubao_app_id | 豆包ASR App ID | string | 是 |
| ai_asr | doubao_access_key | 豆包ASR Access Key | string | 是 |
| ai_asr | doubao_cluster | 豆包ASR集群(volcengine_input_common) | string | 否 |
| ai_tts | provider | 当前TTS服务商 | string | 否 |
| ai_tts | doubao_app_id | 豆包TTS App ID | string | 是 |
| ai_tts | doubao_access_key | 豆包TTS Access Key | string | 是 |
| ai_tts | default_voice_type | 默认音色ID | string | 否 |
| ai_nlp | provider | 当前NLP服务商(qwen/doubao/deepseek) | string | 否 |
| ai_nlp | qwen_api_key | 通义千问 API Key | string | 是 |
| ai_nlp | qwen_model | 通义千问模型名(qwen-plus/qwen-max) | string | 否 |
| ai_nlp | doubao_api_key | 豆包API Key（备用） | string | 是 |
| ai_image | bg_provider | 背景图服务商(wanx/jimeng/doubao) | string | 否 |
| ai_image | png_provider | PNG前景图服务商 | string | 否 |
| ai_image | wanx_api_key | 通义万相 API Key | string | 是 |
| ai_image | wanx_model | 万相模型名 | string | 否 |
| ai_image | jimeng_api_key | 即梦 API Key | string | 是 |
| ai_matting | provider | 抠图服务商(remove_bg/自定义) | string | 否 |
| ai_matting | api_key | 抠图API Key | string | 是 |
| ai_matting | api_endpoint | 抠图API地址 | string | 否 |
| sms | provider | 短信服务商(aliyun/tencent) | string | 否 |
| sms | access_key_id | 短信AccessKey ID | string | 是 |
| sms | access_key_secret | 短信AccessKey Secret | string | 是 |
| sms | sign_name | 短信签名 | string | 否 |
| sms | template_code_login | 登录验证码模板CODE | string | 否 |
| sms | template_code_reset | 找回密码验证码模板CODE | string | 否 |
| oss | provider | 对象存储(aliyun/minio/aws) | string | 否 |
| oss | endpoint | OSS Endpoint | string | 否 |
| oss | access_key_id | OSS AccessKey ID | string | 是 |
| oss | access_key_secret | OSS AccessKey Secret | string | 是 |
| oss | bucket_name | Bucket名称 | string | 否 |
| oss | bucket_domain | Bucket访问域名 | string | 否 |
| oss | upload_dir_prefix | 上传目录前缀 | string | 否 |
| wechat | app_id | 公众号AppID | string | 否 |
| wechat | app_secret | 公众号AppSecret | string | 是 |
| wechat | token | 公众号Token(回调验证) | string | 是 |
| wechat | encoding_aes_key | 公众号消息加解密Key | string | 是 |
| wechat | template_task_complete | 任务完成模板ID | string | 否 |
| wechat | template_task_failed | 任务失败模板ID | string | 否 |
| wechat | template_system_notice | 系统通知模板ID（升级/修复公告） | string | 否 |
| system | default_quota | 新用户默认每月额度 | int | 否 |
| system | max_audio_size_mb | 音频上传最大MB | int | 否 |
| system | max_image_size_mb | 图片上传最大MB | int | 否 |
| system | ffmpeg_path | FFmpeg可执行路径 | string | 否 |
| system | ffprobe_path | FFprobe可执行路径 | string | 否 |

### 5.2 配置热更新机制

- AI服务层（`app/ai/`）每次调用时从数据库/缓存读取配置，不缓存到进程内存
- Redis缓存配置项：`config:{category}:{key}`，修改配置时自动删除缓存
- 修改配置后无需重启服务，新配置立即生效
- 密钥类字段存储时使用AES加密，API返回时脱敏显示（只显示前后2位，中间用***替代）
- 提供"测试连接"接口，保存配置前可验证第三方服务是否连通

### 5.3 Redis数据结构

- `task:progress:{project_id}` → Hash: {stage, progress, message, updated_at}
- `task:lock:{project_id}` → 分布式锁
- `ws:clients:{user_id}` → Set: 在线WebSocket连接ID
- `sms:code:{phone}` → 验证码（5分钟过期）

---

## 六、微信公众号设计

### 6.1 菜单结构
```
├── 我的项目
│   ├── 📋 进行中项目 → 返回进度列表
│   └── ✅ 已完成项目 → 返回最近完成项目
├── 快速创作
│   └── 🎬 前往创作 → 跳转Web端
└── 我的
    ├── 🔗 绑定账号 → 扫码绑定引导
    └── ❓ 帮助中心
```

### 6.2 通知场景

| 场景 | 类型 | 内容 |
|------|------|------|
| 任务完成 | 模板消息 | 项目名称、时长、完成时间、查看链接 |
| 任务失败 | 模板消息 | 项目名称、失败原因、重试链接 |
| 进度查询 | 文本/图文 | 用户进行中项目列表+进度百分比+预计剩余时间 |
| 绑定成功 | 文本消息 | "🎉 绑定成功！任务完成后将在此通知您" |
| 系统升级完成 | 模板消息 | 升级标题、时间、"快来体验新功能" |
| BUG修复完成 | 模板消息 | 修复内容、时间、"可以继续创作啦" |
| 维护结束 | 模板消息 | 维护完成通知 |

### 6.3 账号绑定流程
1. Web端点击"绑定微信"→生成带临时token的二维码
2. 用户微信扫码关注公众号
3. 微信推送subscribe/scan事件到Webhook（携带scene_id和openid）
4. 后端将openid与user_id绑定
5. Web端轮询检测到绑定成功，刷新页面

---

## 七、剪映草稿生成器

### 7.1 关键发现

通过逆向分析剪映专业版10.8.0草稿文件：
- `draft_content.json` 和 `draft_meta_info.json` 是加密的
- `Timelines/{TimelineID}/template.json` **未加密**，包含完整的tracks/segments/materials/animations数据
- 策略：以最小可用草稿为模板，替换template.json中的核心数据，复用加密的基础文件

### 7.2 草稿目录结构

```
{DraftID}/
├── draft_content.json          # 复用模板（加密）
├── draft_meta_info.json        # 复用模板（加密）
├── draft_settings              # INI格式，更新时间戳
├── draft_cover.jpg             # 项目封面
├── draft_agency_config.json    # {video_resolution:720}
├── draft_biz_config.json
├── attachment_pc_common.json
├── key_value.json
├── timeline_layout.json
├── ai_material/                # AI生成素材
├── materials/video/            # 图片素材（背景+前景PNG）
├── materials/audio/            # 音频文件
├── matting/                    # 抠图数据
├── common_attachment/          # 公共附件JSON
└── Timelines/
    ├── project.json
    └── {TimelineID}/
        ├── template.json       # 【核心】构建此文件
        ├── draft.extra
        ├── attachment_editing.json
        ├── attachment_pc_common.json
        └── common_attachment/
```

### 7.3 template.json核心结构

```json
{
  "duration": "{total_duration_us}",
  "canvas_config": {"width": 1708, "height": 960},
  "tracks": [
    // 轨道1: 背景视频轨 - 每个分镜一个segment按时间排列
    { "type": "video", "segments": [...background_segments] },
    // 轨道2~N: 前景PNG图层 - 每个物体一个segment，独立轨道
    { "type": "video", "segments": [...foreground_segment], "flag": 2 },
    // 音频轨
    { "type": "audio", "segments": [...audio_segment] },
    // 字幕轨（可选）
    { "type": "text", "segments": [...subtitle_segments] }
  ],
  "materials": {
    "videos": [
      // 每个素材: {id, path, material_name, width, height, type:"photo",
      //           matting:{flag, path}, video_algorithm:{aigc_generate:{...}}}
    ],
    "audios": [...],
    "material_animations": [
      // 每个前景关联入场动画:
      // {id, type:"sticker_animation", animations:[{
      //   category_name:"入场", name:"翻入", type:"in",
      //   duration, resource_id, id
      // }]}
    ],
    "speeds": [...],
    "canvases": [...],
    "sound_channel_mappings": [...],
    "material_colors": [...],
    "vocal_separations": [...],
    "placeholder_infos": [...]
  },
  "platform": {"app_version":"10.8.0","os":"windows",...},
  "render_index_track_mode_on": true,
  "version": 360000,
  "new_version": "160.0.0"
}
```

### 7.4 入场动画资源ID映射

| 动画名 | 剪映资源ID | 默认时长 | 适用场景 |
|--------|-----------|---------|---------|
| 翻入 (flip_in) | 7452407076417966619 | 1170ms | 食物、产品、实物 |
| 展开 (expand) | 7221413342257091133 | 500ms | 抽象元素、文字 |
| 向下滑动 (slide_down) | 6798333705401143816 | 500ms | 通用物体 |

MVP阶段使用以上3个已验证的动画，后续通过分析更多草稿扩展。

### 7.5 坐标转换

剪映使用归一化偏移坐标（基于实际草稿逆向分析）：
- `transform.x/y`: 范围约-0.5~0.5，(0,0)居中，正值向右/下
- `scale.x/y`: 1.0为原始大小
- 转换公式：`jianying_x = (our_x - 0.5) * 2`，`jianying_y = (our_y - 0.5) * 2`

---

## 八、智能布局引擎

### 8.1 约束条件

**硬约束**：不出框（留5%安全边距）、不重叠、大小适中（主物体30-50%、次要15-30%）、时间对齐语音、分镜内出现后不消失

**软约束**：视觉平衡、大小有层次、动画方向不冲突

### 8.2 9宫格锚点系统

```
┌─────────┬─────────┬─────────┐
│  左上TL │  中上TC │  右上TR │
├─────────┼─────────┼─────────┤
│  左中ML │  中心C  │  右中MR │
├─────────┼─────────┼─────────┤
│  左下BL │  中下BC │  右下BR │
└─────────┴─────────┴─────────┘
```

**锚点分配策略**：
- 1个物体 → 中心C (40-50%)
- 2个物体 → 对角分布 TL+BR 或 TR+BL (30-35%)
- 3个物体 → 三角分布 C+TL+BR，主物体C稍大 (35-40%/25-30%)
- 4个物体 → 四角或三角+底部 (20-28%)
- 5+个 → 核心1-2大物体+周围点缀 (15-20%)

### 8.3 布局算法步骤

1. **物体分类排序**：按重要性排序（主语>宾语>修饰词），确定appear_time（词级时间戳）
2. **选择布局模板**：根据物体数量选择锚点分配方案
3. **分配锚点**：避免已占用区域，高优先级物体优先选中心
4. **计算缩放**：基于物体宽高比和目标占比反推scale
5. **微偏移+碰撞检测**：添加随机抖动避免机械对齐，检测重叠后微调
6. **边界裁剪**：确保所有物体在安全区内
7. **选择动画**：根据物体类型、位置、出现顺序匹配动画
8. **分配z_index**：按出现顺序，后出现的在上层

### 8.4 NLP联动输出格式

NLP分析为每个分镜输出结构化数据：
```json
{
  "scene": "美食展示，温暖明亮的桌面",
  "emotion": "warm",
  "foreground_objects": [
    {
      "name": "果盘",
      "role": "container",
      "priority": "primary",
      "position_hint": "center",
      "description": "装满水果的陶瓷果盘",
      "trigger_word": "盘子",
      "trigger_time_us": 1200000
    }
  ]
}
```
- `position_hint: "inside_container"` → 物体放在容器附近/内部
- `trigger_time_us` 由ASR词级时间戳提供，精确到词的发音时刻
- 容器类物体先出现，内容物0.3-0.5s后依次出现

---

## 九、API接口设计

### 9.1 REST API（前缀 `/api/v1`，JWT认证）

**认证 `/auth`**
- POST `/auth/send-code` 发送验证码
- POST `/auth/login-phone` 手机号验证码登录
- POST `/auth/login-password` 密码登录
- POST `/auth/register` 注册
- POST `/auth/forgot-password` 发送重置验证码
- POST `/auth/reset-password` 重置密码
- POST `/auth/refresh` 刷新Token
- GET `/auth/me` 获取当前用户
- PUT `/auth/profile` 修改资料
- PUT `/auth/change-password` 修改密码
- GET `/auth/wechat/bind-qrcode` 获取微信绑定二维码
- POST `/auth/wechat/unbind` 解绑微信

**文件 `/files`**
- POST `/files/upload` 上传文件（支持分片）
- GET `/files/{id}` 文件信息
- GET `/files/{id}/download` 下载（预签名URL）
- DELETE `/files/{id}` 删除文件

**项目 `/projects`**
- GET `/projects` 项目列表（分页/筛选/排序）
- POST `/projects` 创建项目
- GET `/projects/{id}` 项目详情（含分镜/物体/字幕全量）
- PUT `/projects/{id}` 更新项目
- DELETE `/projects/{id}` 删除（软删除）
- POST `/projects/{id}/duplicate` 复制项目
- POST `/projects/{id}/submit-pipeline` 确认文案启动Pipeline
- POST `/projects/{id}/retry` 重试失败阶段
- GET `/projects/{id}/progress` 获取进度（轮询备用）

**文案 `/projects/{id}/transcript`**
- GET 获取ASR结果
- PUT 保存编辑后文案

**TTS `/tts`**
- GET `/tts/voices` 音色列表
- POST `/tts/preview` 试听（返回音频URL）

**分镜 `/projects/{id}/shots`**
- GET 获取所有分镜
- PUT `/shots/{shot_id}` 更新分镜
- POST `/shots/reorder` 调整顺序
- POST `/shots/{shot_id}/regenerate-bg` 重新生成背景
- POST `/shots/{shot_id}/relayout` 重新布局

**前景物体 `/projects/{id}/objects`**
- PUT `/objects/{obj_id}` 更新物体（位置/缩放/动画/时间）
- POST `/shots/{shot_id}/objects` 添加物体
- DELETE `/objects/{obj_id}` 删除物体
- POST `/objects/{obj_id}/regenerate` 重新生成PNG
- POST `/objects/{obj_id}/remat` 重新抠图

**字幕 `/projects/{id}/subtitles`**
- GET 获取字幕列表
- PUT `/subtitles/{sub_id}` 更新单条字幕
- PUT `/subtitles/style` 批量更新样式
- POST `/subtitles/toggle` 开关字幕

**导出 `/projects/{id}/export`**
- GET `/export/draft` 下载草稿包
- GET `/export/preview` 预览视频URL
- POST `/export/video` 触发导出视频
- GET `/export/status` 导出进度

**个人空间 `/workspace`**
- GET `/workspace/stats` 用量统计
- GET `/workspace/recycle-bin` 回收站
- POST `/workspace/recycle-bin/{id}/restore` 恢复项目
- DELETE `/workspace/recycle-bin/{id}` 永久删除

**系统配置 `/admin/config`（仅管理员，所有第三方服务配置接口）**
- GET `/admin/config` 获取所有配置（按分类分组，密钥脱敏）
- GET `/admin/config/{category}` 获取某分类下所有配置
- PUT `/admin/config/{category}/{key}` 更新单个配置项（自动清除Redis缓存）
- PUT `/admin/config/batch` 批量更新配置
- POST `/admin/config/{category}/{key}/test` 测试第三方服务连通性
  - ai_asr: 上传测试音频验证识别
  - ai_tts: 合成测试音频验证
  - ai_nlp: 发送测试prompt验证
  - ai_image: 生成测试图片验证
  - ai_matting: 上传测试图片验证抠图
  - sms: 发送测试验证码到指定手机号
  - oss: 上传/下载测试文件
  - wechat: 获取access_token验证
- POST `/admin/config/init` 初始化默认配置项（首次部署用）

**系统通知 `/admin/notifications`（仅管理员）**
- GET `/admin/notifications` 获取通知列表（分页、类型筛选）
- POST `/admin/notifications` 创建通知（标题、内容、类型、发送范围、计划时间）
- POST `/admin/notifications/{id}/send` 立即发送通知
- GET `/admin/notifications/{id}` 获取通知详情（含发送统计）
- GET `/admin/notifications/{id}/logs` 获取通知发送日志

**通知触发场景与自动消息模板：**

| 触发场景 | 通知类型 | 默认标题 | 默认内容 |
|---------|---------|---------|---------|
| 诊断自动修复完成 | bugfix | 🛠️ 问题已修复 | "检测到的系统问题已自动修复完成，您现在可以继续畅快创作啦！" |
| 系统升级部署完成 | upgrade | ✨ 系统已升级 | "系统已完成升级优化，新功能已上线，快来体验吧！" |
| 维护结束恢复服务 | maintenance | 🔧 维护完成 | "系统维护已完成，服务已恢复正常，感谢您的耐心等待！" |
| 手动发布公告 | announcement | 自定义 | 自定义 |

**自动触发机制：**
1. **诊断修复后自动触发**：`/admin/diagnose/{id}/fix` 执行修复且全部修复成功后，自动创建一条type=bugfix的通知，发送给所有已绑定微信的用户
2. **部署后触发**：提供CLI命令或API钩子 `POST /admin/notifications/trigger-upgrade`，部署脚本完成后调用，自动发送升级完成通知
3. **手动触发**：通过API创建通知，可立即发送或定时发送
4. **发送限流**：同一类型通知24小时内最多发送1次，避免骚扰用户
5. **异步发送**：通知发送由Celery Worker异步执行，不阻塞接口响应，逐条调用微信模板消息API
6. **用户可选择关闭**：后续可在个人设置中增加"接收系统通知"开关（MVP默认开启）

**系统诊断 `/admin/diagnose`（仅管理员，智能检查与自动修复）**
- POST `/admin/diagnose/run` 启动全链路智能诊断（返回diagnose_id，异步执行）
- GET `/admin/diagnose/{diagnose_id}/status` 查询诊断进度与结果（通过WebSocket实时推送）
- POST `/admin/diagnose/{diagnose_id}/fix` 执行自动修复（用户确认后触发）
- GET `/admin/diagnose/history` 获取历史诊断记录列表

**诊断检查项（前端→后端全链路）：**

| 检查模块 | 检查项 | 自动修复 |
|---------|--------|---------|
| 前端环境 | 静态资源是否可访问 | ❌ 给出Nginx配置建议 |
| 前端环境 | API/WebSocket连接是否正常 | ❌ 检查CORS配置 |
| 后端服务 | FastAPI是否正常启动 | ❌ 提示检查日志 |
| 数据库 | PostgreSQL连接是否正常 | ✅ 检查连接串，尝试重连 |
| 数据库 | 数据库表是否完整（迁移是否执行） | ✅ 自动执行alembic upgrade head |
| 数据库 | system_configs默认配置是否存在 | ✅ 自动初始化缺失配置项 |
| Redis | Redis连接是否正常 | ✅ 检查连接串，尝试重连 |
| Redis | Celery Broker是否可用 | ❌ 提示检查Redis配置 |
| Celery | Worker是否在线 | ❌ 提示启动celery-worker |
| 对象存储 | OSS连接是否正常 | ✅ 检查endpoint/key配置 |
| 对象存储 | Bucket是否存在且可读写 | ❌ 提示创建Bucket或检查权限 |
| FFmpeg | FFmpeg/FFprobe是否安装可执行 | ✅ 检查路径配置，尝试自动查找 |
| 目录权限 | 临时目录/草稿生成目录是否可写 | ✅ 自动创建目录并设置权限 |
| ASR服务 | 豆包ASR API Key是否有效 | ❌ 提示更新API Key |
| TTS服务 | 豆包TTS API Key是否有效 | ❌ 提示更新API Key |
| NLP服务 | 通义/豆包NLP API Key是否有效 | ❌ 提示更新API Key |
| 图像服务 | 万相/即梦API Key是否有效 | ❌ 提示更新API Key |
| 抠图服务 | 抠图API是否可用 | ❌ 提示更新API Key |
| 短信服务 | 短信API是否可用 | ❌ 提示更新配置/检查余额 |
| 微信公众号 | AppID/AppSecret是否有效 | ✅ 测试获取access_token |
| 微信公众号 | 回调URL是否可公网访问 | ❌ 提示配置内网穿透/公网IP |
| 剪映模板 | 草稿模板文件是否存在 | ✅ 自动从备份恢复模板 |
| 磁盘空间 | 临时目录磁盘空间是否充足(>1GB) | ❌ 提示清理磁盘 |
| SSL证书 | HTTPS证书是否有效(生产环境) | ❌ 提示更新证书 |

**诊断流程：**
1. 配置通过后端API（或FastAPI Swagger文档 `/docs`）保存后，API响应中返回 `diagnose_suggested: true`
2. 调用方（前端/脚本）收到提示后可选择启动全链路诊断
3. 诊断通过WebSocket实时推送每项检查结果（✅通过/⚠️警告/❌失败）
4. 诊断完成后返回完整报告，对可自动修复的问题可调用修复API
5. 修复后自动重新验证修复结果
6. 全部通过后返回成功状态

**配置初始化方式：**
- 首次部署：调用 `POST /admin/config/init` 初始化默认配置项，再通过API逐个填入密钥
- 环境变量兜底：未配置的项可从环境变量读取（如 `DOUBAO_ACCESS_KEY`、`QWEN_API_KEY` 等）
- FastAPI自带Swagger文档（`/docs`）可直接在线调用配置和诊断API

### 9.2 WebSocket

**项目进度连接：** `ws://{host}/ws/projects/{project_id}`

**服务端→客户端消息：**
```json
// 进度更新
{"type":"progress","data":{"stage":4,"stage_name":"批量图像生成","progress":55,"message":"正在生成第6/12张图片..."}}
// 阶段完成
{"type":"stage_complete","data":{"stage":4,"next_stage":5}}
// 状态变化
{"type":"status_change","data":{"status":"completed"}}
// 单张图生成完成
{"type":"image_ready","data":{"shot_id":"...","object_id":"...","image_url":"..."}}
// 错误
{"type":"error","data":{"stage":4,"message":"图片生成失败，正在重试..."}}
```

**系统诊断连接：** `ws://{host}/ws/admin/diagnose/{diagnose_id}`（仅管理员）

**服务端→客户端消息：**
```json
// 单项检查开始
{"type":"check_start","data":{"module":"数据库","item":"PostgreSQL连接","index":3,"total":24}}
// 单项检查结果
{"type":"check_result","data":{"module":"数据库","item":"PostgreSQL连接","status":"pass","message":"连接正常","fixable":false}}
{"type":"check_result","data":{"module":"数据库","item":"数据库表完整性","status":"fail","message":"检测到3个表未创建","fixable":true,"fix_action":"auto_migrate"}}
// 修复进度
{"type":"fix_progress","data":{"action":"auto_migrate","progress":60,"message":"正在执行数据库迁移..."}}
// 修复结果
{"type":"fix_result","data":{"action":"auto_migrate","status":"success","message":"已成功创建缺失的表"}}
// 诊断完成
{"type":"diagnose_complete","data":{"total":24,"passed":20,"warnings":2,"failed":2,"fixable_count":2,"report_id":"..."}}
```

### 9.3 微信回调

- GET `/wechat/callback` 服务器验证
- POST `/wechat/callback` 消息/事件接收

---

## 十、错误处理与安全

### 10.1 错误分级

| 级别 | 示例 | 处理 |
|------|------|------|
| 可重试 | API限流、网络超时 | 自动重试3次（指数退避2s/4s/8s） |
| 单资源失败 | 某张图生成失败 | 标记失败，不阻塞整体，提供"重新生成"按钮 |
| 阶段失败 | ASR完全失败 | 暂停Pipeline，通知用户，提供重试按钮 |
| 系统错误 | DB连接失败 | 告警运维，恢复后继续执行 |

### 10.2 安全措施

- JWT认证：Access Token 2h + Refresh Token 7d
- 验证码：6位数字，5分钟有效，频控1次/分钟、5次/小时
- 密码：bcrypt哈希，强度校验
- 文件上传：类型白名单+大小限制，UUID重命名防路径遍历
- OSS：预签名临时URL（1h有效期）
- API：全局限流（100次/分钟，AI接口10次/分钟）
- CORS：仅允许前端域名
- SQL注入：ORM参数化查询
- XSS：React自动转义+Pydantic校验
- 数据隔离：所有查询强制user_id过滤
- HTTPS全站加密
- 敏感配置：环境变量管理，不硬编码

---

## 十一、部署架构

### 11.1 Docker Compose服务

- **frontend**: Next.js (3000)
- **backend**: FastAPI (8000)
- **celery-worker**: Pipeline执行器（可启动多实例水平扩展）
- **celery-beat**: 定时任务（额度重置等）
- **postgres**: PostgreSQL 15
- **redis**: Redis 7
- **nginx**: 反向代理+SSL+WebSocket支持+静态资源缓存
- **minio**: 开发环境对象存储（生产替换为阿里云OSS）

### 11.2 开发里程碑（4个Sprint）

**Sprint 1：基础框架**
- 项目初始化、用户认证（注册/登录/找回密码）、文件上传、个人空间、基础UI框架
- 系统配置管理页（第三方服务密钥设置、热更新）
- 系统智能诊断与自动修复（全链路检查、一键修复、WebSocket实时进度）

**Sprint 2：AI Pipeline核心**
- ASR/TTS集成、文案校对页、NLP分析、图像生成（含抠图兜底）、Celery+WebSocket进度推送

**Sprint 3：布局引擎+编辑器**
- 智能布局引擎、可视化编辑器（预览编辑区/拖拽/属性面板/时间线）、素材面板、自动保存、字幕生成

**Sprint 4：导出+通知+上线**
- 剪映草稿生成器、FFmpeg视频渲染、导出功能、微信公众号集成、部署上线
