
# 抖音视频下载与处理解决方案

## 问题说明
由于抖音的反爬虫机制，直接使用yt-dlp下载需要新鲜的cookies。

## 推荐使用方案：先下载视频，再本地处理

### 步骤1: 下载视频
您可以使用以下任意一种方法下载抖音视频：
1. 使用在线抖音下载工具 (如: https://snaptik.app/, https://ssstik.io/)
2. 使用手机抖音APP下载保存
3. 使用浏览器插件下载
4. 使用 process_douyin.py + cookies.txt (见下文)

### 步骤2: 本地处理视频
下载视频后，将视频文件放在 /workspace 目录下，然后运行：

```bash
cd /workspace
python3 process_local_video.py
```

## 其他方案

### 方案A: 使用浏览器提取cookies（自动化下载）
1. 在您的电脑上安装浏览器扩展 "Get cookies.txt" (Chrome/Edge)
2. 访问抖音网站，登录您的账号
3. 使用扩展导出cookies为cookies.txt文件
4. 将cookies.txt放置在/workspace目录下
5. 运行: python3 process_douyin.py

## 脚本功能
1. 下载/获取最高清晰度无水印视频
2. 提取音频
3. 分离纯人声音频（使用Demucs AI模型）
4. 去除视频画面水印（右下角500×140区域，使用OpenCV图像修复）
5. 文件命名符合要求

## 文件说明
- process_douyin.py: 自动下载+处理脚本（需要cookies）
- process_local_video.py: 本地视频处理脚本（推荐）
- cookies.txt: 需要您提供的抖音cookies文件（可选）
- L@J.IV-为什么天空只允许一种形状存在？/: 处理后的文件将保存在这个文件夹

## 输出文件
处理完成后，文件夹中将包含：
1. L@J.IV-为什么天空只允许一种形状存在？.mp4 - 无水印视频
2. L@J.IV-为什么天空只允许一种形状存在？.mp3 - 完整音频
3. L@J.IV-为什么天空只允许一种形状存在？_纯人声.mp3 - 纯人声音频
