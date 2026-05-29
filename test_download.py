
#!/usr/bin/env python3
import yt_dlp
import os

# 抖音视频URL
video_url = "https://v.douyin.com/Jguh46fohuQ/"
output_folder = "/workspace/test"

# 创建输出目录
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

print("正在获取视频信息...")

ydl_opts = {
    'outtmpl': f'{output_folder}/%(title)s.%(ext)s',
    'format': 'bestvideo+bestaudio/best',
    'writesubtitles': True,
    'writeautomaticsub': True,
    'subtitleslangs': ['zh-Hans'],
    'merge_output_format': 'mp4',
    'quiet': False,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=True)
        print("\n===== 下载成功 =====")
        print(f"视频标题: {info_dict.get('title', '')}")
        print(f"视频时长: {info_dict.get('duration', '')}秒")
        print(f"下载目录: {output_folder}")
        print(f"\n下载的文件:")
        for f in os.listdir(output_folder):
            print(f"  - {f}")
except Exception as e:
    print(f"下载出错: {e}")
    import traceback
    traceback.print_exc()
