import logging
import json
import uuid
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)


@dataclass
class TimelineClip:
    id: str
    media_id: Optional[str]
    source_path: str
    name: str
    start_time: float
    end_time: float
    in_point: float
    out_point: float
    position: Dict[str, float]
    scale: Dict[str, float]
    rotation: float
    opacity: float
    volume: float
    animations: List[Dict]
    transitions: List[Dict]


@dataclass
class TimelineTrack:
    id: str
    name: str
    type: str
    clips: List[TimelineClip]
    muted: bool
    locked: bool
    visible: bool


@dataclass
class Timeline:
    duration: float
    tracks: List[TimelineTrack]
    width: int = 1920
    height: int = 1080
    fps: int = 30


class CapCutExporter:
    def __init__(self, output_dir: str = "./exports"):
        self.output_dir = output_dir
        import os
        os.makedirs(output_dir, exist_ok=True)

    def export_draft(
        self,
        timeline: Timeline,
        project_name: str = "project"
    ) -> str:
        draft_id = str(uuid.uuid4())
        draft_dir = f"{self.output_dir}/{draft_id}"
        import os
        os.makedirs(draft_dir, exist_ok=True)

        media_dir = f"{draft_dir}/media"
        os.makedirs(media_dir, exist_ok=True)

        draft_content = self._generate_draft_content(timeline, media_dir)
        with open(f"{draft_dir}/draft_content.json", 'w', encoding='utf-8') as f:
            json.dump(draft_content, f, ensure_ascii=False, indent=2)

        draft_meta = self._generate_draft_meta(timeline, project_name)
        with open(f"{draft_dir}/draft_meta_info.json", 'w', encoding='utf-8') as f:
            json.dump(draft_meta, f, ensure_ascii=False, indent=2)

        return draft_dir

    def _generate_draft_content(self, timeline: Timeline, media_dir: str) -> Dict:
        materials = {
            "videos": [],
            "images": [],
            "audios": [],
            "texts": []
        }

        tracks_data = []

        for track in timeline.tracks:
            track_data = {
                "id": track.id,
                "name": track.name,
                "type": track.type,
                "visible": track.visible,
                "locked": track.locked,
                "segments": []
            }

            for clip in track.clips:
                segment = {
                    "id": clip.id,
                    "type": "video" if ".mp4" in clip.source_path else "image",
                    "start_time": clip.start_time * 1000000,
                    "end_time": clip.end_time * 1000000,
                    "source_duration": (clip.out_point - clip.in_point) * 1000000,
                    "source_start": clip.in_point * 1000000,
                    "source_end": clip.out_point * 1000000,
                    "transform": {
                        "position": clip.position,
                        "scale": clip.scale,
                        "rotation": clip.rotation,
                        "opacity": clip.opacity
                    },
                    "animations": clip.animations,
                    "volume": clip.volume,
                    "media_id": clip.media_id or ""
                }

                if clip.media_id:
                    segment["media_path"] = f"media/{clip.media_id}"

                track_data["segments"].append(segment)

            tracks_data.append(track_data)

        return {
            "canvas_config": {
                "height": timeline.height,
                "ratio": "16:9" if timeline.width / timeline.height == 16/9 else f"{timeline.width}:{timeline.height}",
                "width": timeline.width
            },
            "fps": timeline.fps,
            "duration": timeline.duration * 1000000,
            "materials": materials,
            "tracks": tracks_data,
            "version": "1.0.0"
        }

    def _generate_draft_meta(self, timeline: Timeline, project_name: str) -> Dict:
        return {
            "draft_id": str(uuid.uuid4()),
            "draft_name": project_name,
            "create_time": 0,
            "update_time": 0,
            "canvas_config": {
                "height": timeline.height,
                "ratio": "16:9",
                "width": timeline.width
            },
            "extra_info": {
                "source": "灵剪Agent",
                "version": "1.0.0"
            }
        }

    def export_srt(self, segments: List[Dict], output_path: str) -> bool:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                for i, segment in enumerate(segments, 1):
                    start_time = self._format_srt_time(segment["start"])
                    end_time = self._format_srt_time(segment["end"])

                    f.write(f"{i}\n")
                    f.write(f"{start_time} --> {end_time}\n")
                    f.write(f"{segment['text']}\n\n")

            return True

        except Exception as e:
            logger.error(f"Failed to export SRT: {e}")
            return False

    def _format_srt_time(self, seconds: float) -> str:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)

        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
