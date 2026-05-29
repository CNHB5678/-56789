
#!/usr/bin/env python3
import cv2
import numpy as np
import subprocess
import os

def create_test_video():
    # 创建一个简单的测试视频
    width, height = 1920, 1080
    fps = 30
    duration = 5  # 5秒

    # 创建视频写入器
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video_path = "/workspace/test_video.mp4"
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))

    for frame_count in range(fps * duration):
        # 创建渐变背景
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        color = int(255 * (frame_count / (fps * duration)))
        
        # 添加彩色渐变
        frame[:, :, 0] = color  # B
        frame[:, :, 1] = 255 - color  # G
        frame[:, :, 2] = 128  # R
        
        # 添加文字
        font = cv2.FONT_HERSHEY_SIMPLEX
        text = "Test Video Frame " + str(frame_count)
        cv2.putText(frame, text, (50, 100), font, 2, (255, 255, 255), 3)
        
        # 添加模拟水印（右下角）
        watermark_text = "@Watermark"
        text_size = cv2.getTextSize(watermark_text, font, 1.5, 3)[0]
        x = width - text_size[0] - 50
        y = height - 50
        cv2.putText(frame, watermark_text, (x, y), font, 1.5, (255, 255, 255), 3)
        
        # 也添加一个矩形水印框（500x140
        cv2.rectangle(frame, (width-500, height-140), (width, height), (0, 0, 0), -1)
        cv2.putText(frame, "@Watermark Area", (width-480, height-80), font, 1, (255, 255, 255), 2)
        
        out.write(frame)
    
    out.release()
    print(f"测试视频已创建: {video_path}")
    
    # 添加简单的音频
    audio_path = "/workspace/test_audio.mp3"
    # 使用ffmpeg创建一个简单的音频
    cmd = [
        'ffmpeg', '-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=5', 
        '-c:a', 'libmp3lame', audio_path
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    
    # 合并视频和音频
    final_path = "/workspace/test_video_with_audio.mp4"
    cmd = [
        'ffmpeg', '-y', '-i', video_path, '-i', audio_path,
        '-c:v', 'copy', '-c:a', 'aac', final_path
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    
    # 清理临时文件
    os.remove(video_path)
    os.remove(audio_path)
    
    print(f"带音频的测试视频已创建: {final_path}")
    return final_path

if __name__ == "__main__":
    create_test_video()
