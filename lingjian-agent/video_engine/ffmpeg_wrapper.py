import logging
import subprocess
import os
import json
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
import asyncio
import uuid

logger = logging.getLogger(__name__)


@dataclass
class MediaInfo:
    duration: float
    width: int
    height: int
    fps: float
    format: str
    bitrate: int


class FFmpegWrapper:
    def __init__(self, ffmpeg_path: str = "ffmpeg", ffprobe_path: str = "ffprobe"):
        self.ffmpeg_path = ffmpeg_path
        self.ffprobe_path = ffprobe_path

    async def get_media_info(self, file_path: str) -> Optional[MediaInfo]:
        try:
            cmd = [
                self.ffprobe_path,
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                file_path
            ]

            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, _ = await result.communicate()

            if result.returncode != 0:
                return None

            data = json.loads(stdout.decode())

            video_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)

            if not video_stream:
                return None

            duration = float(data.get("format", {}).get("duration", 0))
            width = int(video_stream.get("width", 0))
            height = int(video_stream.get("height", 0))
            fps_str = video_stream.get("r_frame_rate", "30/1")
            fps = eval(fps_str) if "/" in fps_str else float(fps_str)
            format_name = data.get("format", {}).get("format_name", "")
            bitrate = int(data.get("format", {}).get("bit_rate", 0))

            return MediaInfo(
                duration=duration,
                width=width,
                height=height,
                fps=fps,
                format=format_name,
                bitrate=bitrate
            )

        except Exception as e:
            logger.error(f"Failed to get media info: {e}")
            return None

    async def extract_audio(self, video_path: str, output_path: str) -> bool:
        try:
            cmd = [
                self.ffmpeg_path,
                "-i", video_path,
                "-vn",
                "-acodec", "libmp3lame",
                "-q:a", "2",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to extract audio: {e}")
            return False

    async def trim_video(
        self,
        input_path: str,
        output_path: str,
        start: float,
        duration: float
    ) -> bool:
        try:
            cmd = [
                self.ffmpeg_path,
                "-ss", str(start),
                "-i", input_path,
                "-t", str(duration),
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-c:a", "aac",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to trim video: {e}")
            return False

    async def generate_waveform(
        self,
        audio_path: str,
        output_path: str,
        width: int = 800,
        height: int = 200
    ) -> bool:
        try:
            cmd = [
                self.ffmpeg_path,
                "-i", audio_path,
                "-filter_complex",
                f"[0:a]compand,showwavespic=s={width}x{height}:colors=white[out]",
                "-map", "[out]",
                "-frames:v", "1",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to generate waveform: {e}")
            return False

    async def extract_frames(
        self,
        video_path: str,
        output_dir: str,
        interval: float = 1.0
    ) -> List[str]:
        frame_files = []
        os.makedirs(output_dir, exist_ok=True)

        try:
            cmd = [
                self.ffmpeg_path,
                "-i", video_path,
                "-vf", f"fps=1/{interval}",
                os.path.join(output_dir, "frame_%04d.png"),
                "-y"
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            if result.returncode == 0:
                for filename in sorted(os.listdir(output_dir)):
                    if filename.endswith(".png"):
                        frame_files.append(os.path.join(output_dir, filename))

        except Exception as e:
            logger.error(f"Failed to extract frames: {e}")

        return frame_files

    async def composite_video(
        self,
        inputs: List[Dict[str, Any]],
        output_path: str,
        width: int = 1920,
        height: int = 1080,
        fps: int = 30
    ) -> bool:
        if not inputs:
            return False

        try:
            filter_complex = ""
            input_args = []
            map_args = []

            for i, inp in enumerate(inputs):
                input_args.extend(["-i", inp["path"]])

                if inp.get("type") == "video":
                    scale_filter = f"scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:black"
                    filter_complex += f"[{i}:v]{scale_filter}[v{i}];"

                map_args.extend([f"[{i}:a]"])

            for i in range(len(inputs)):
                filter_complex += f"[v{i}]"

            filter_complex += f"concat=n={len(inputs)}:v=1:a=0[outv];"
            for i in range(len(inputs)):
                if inputs[i].get("type") == "audio":
                    map_args.append(f"[{i}:a]")

            filter_complex += f"{''.join(map_args)}concat=n={len(inputs)}:v=0:a=1[outa]"

            cmd = [
                self.ffmpeg_path,
                *input_args,
                "-filter_complex", filter_complex,
                "-map", "[outv]",
                "-map", "[outa]",
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-c:a", "aac",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to composite video: {e}")
            return False

    async def add_subtitle(
        self,
        video_path: str,
        subtitle_path: str,
        output_path: str
    ) -> bool:
        try:
            cmd = [
                self.ffmpeg_path,
                "-i", video_path,
                "-vf", f"subtitles='{subtitle_path}'",
                "-c:a", "copy",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to add subtitle: {e}")
            return False

    async def export_video(
        self,
        input_path: str,
        output_path: str,
        quality: str = "high"
    ) -> bool:
        quality_settings = {
            "low": {"crf": "28", "preset": "veryfast"},
            "medium": {"crf": "23", "preset": "fast"},
            "high": {"crf": "18", "preset": "medium"}
        }

        settings = quality_settings.get(quality, quality_settings["medium"])

        try:
            cmd = [
                self.ffmpeg_path,
                "-i", input_path,
                "-c:v", "libx264",
                "-preset", settings["preset"],
                "-crf", settings["crf"],
                "-c:a", "aac",
                "-b:a", "192k",
                "-y",
                output_path
            ]

            result = await asyncio.create_subprocess_exec(*cmd)
            await result.wait()

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Failed to export video: {e}")
            return False
