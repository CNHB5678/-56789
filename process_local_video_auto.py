
#!/usr/bin/env python3
import os
import re
import cv2
import numpy as np
import shutil
import subprocess
from pathlib import Path
import sys

# 作者信息和标题
user_info = "L@J.IV"
video_title = "为什么天空只允许一种形状存在？"
output_folder_name = f"{user_info}-{video_title}"

def extract_audio(video_path, output_folder, filename):
    print("正在提取音频...")
    audio_path = os.path.join(output_folder, f"{filename}.mp3")
    cmd = [
        'ffmpeg', '-y', '-i', video_path,
        '-vn', '-acodec', 'libmp3lame', '-q:a', '2',
        '-loglevel', 'error',
        audio_path
    ]
    subprocess.run(cmd, check=True)
    print(f"音频提取完成: {audio_path}")
    return audio_path

def separate_vocals(audio_path, output_folder, filename):
    print("正在分离纯人声...")
    output_dir = os.path.join(output_folder, "demucs_output")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    try:
        import demucs.separate
        demucs.separate.main([
            "-n", "htdemucs",
            "--two-stems=vocals",
            "--out", output_dir,
            audio_path
        ])
        
        audio_name = os.path.basename(audio_path).replace(".mp3", "")
        separated_dir = os.path.join(output_dir, "htdemucs", audio_name, "vocals.wav")
        vocal_path = os.path.join(output_folder, f"{filename}_纯人声.mp3")
        
        if os.path.exists(separated_dir):
            cmd = [
                'ffmpeg', '-y', '-i', separated_dir,
                '-acodec', 'libmp3lame', '-q:a', '2',
                '-loglevel', 'error',
                vocal_path
            ]
            subprocess.run(cmd, check=True)
            print(f"纯人声音频分离完成: {vocal_path}")
            return vocal_path
    except Exception as e:
        print(f"分离人声时出错: {e}")
    return None

def detect_and_remove_watermark(video_path, audio_path, output_folder, filename):
    print("正在检测并去除水印...")
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("无法打开视频文件")
        return None
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    temp_output_silent = os.path.join(output_folder, f"temp_silent_{filename}.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_output_silent, fourcc, fps, (width, height))
    
    watermark_x = max(0, width - 500)
    watermark_y = max(0, height - 140)
    watermark_w = 500
    watermark_h = 140
    
    print(f"水印位置: ({watermark_x}, {watermark_y}), 大小: {watermark_w}×{watermark_h}")
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if watermark_x + watermark_w <= width and watermark_y + watermark_h <= height:
            mask = np.zeros((height, width), dtype=np.uint8)
            mask[watermark_y:watermark_y+watermark_h, watermark_x:watermark_x+watermark_w] = 255
            result = cv2.inpaint(frame, mask, 3, cv2.INPAINT_TELEA)
        else:
            result = frame
        
        out.write(result)
        frame_count += 1
        
        if frame_count % 30 == 0:
            print(f"处理进度: {frame_count}/{total_frames} ({frame_count/total_frames*100:.2f}%)")
    
    cap.release()
    out.release()
    
    final_output = os.path.join(output_folder, f"{filename}_无水印.mp4")
    cmd = [
        'ffmpeg', '-y',
        '-i', temp_output_silent,
        '-i', audio_path,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-loglevel', 'error',
        final_output
    ]
    
    print("正在合并视频和音频...")
    subprocess.run(cmd, check=True)
    
    if os.path.exists(temp_output_silent):
        os.remove(temp_output_silent)
    
    print("视频水印去除完成")
    return final_output

def main(video_filename=None):
    print("===== 本地视频处理脚本（自动模式） =====")
    
    if video_filename is None:
        video_files = [f for f in os.listdir("/workspace") if f.endswith(('.mp4', '.mov', '.avi', '.mkv'))]
        if video_files:
            video_filename = video_files[0]
            print(f"自动选择文件: {video_filename}")
        else:
            print("错误: 未找到视频文件")
            return
    
    video_path = os.path.join("/workspace", video_filename)
    
    if not os.path.exists(video_path):
        print(f"错误: 文件 {video_path} 不存在")
        return
    
    base_output = "/workspace"
    output_folder = os.path.join(base_output, output_folder_name)
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    original_video_path = video_path
    base_name = os.path.basename(original_video_path)
    filename_without_ext = os.path.splitext(base_name)[0]
    
    audio_path = extract_audio(original_video_path, output_folder, filename_without_ext)
    vocal_path = separate_vocals(audio_path, output_folder, filename_without_ext)
    final_video_path = detect_and_remove_watermark(
        original_video_path, audio_path, output_folder, filename_without_ext
    )
    
    final_filename = f"{user_info}-{video_title}"
    os.rename(final_video_path, os.path.join(output_folder, f"{final_filename}.mp4"))
    os.rename(audio_path, os.path.join(output_folder, f"{final_filename}.mp3"))
    
    if vocal_path:
        os.rename(vocal_path, os.path.join(output_folder, f"{final_filename}_纯人声.mp3"))
    
    if os.path.exists(os.path.join(output_folder, "demucs_output")):
        shutil.rmtree(os.path.join(output_folder, "demucs_output"))
    
    print("\n===== 任务完成 =====")
    print(f"文件已保存在: {output_folder}")
    print(f"包含文件:")
    for f in sorted(os.listdir(output_folder)):
        print(f"  - {f}")
    
if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        main()
