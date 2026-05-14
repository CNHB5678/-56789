import sys
import os

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)

import logging
from typing import List, Dict, Optional
from fastapi import UploadFile, File, HTTPException
import uuid
import aiofiles

from ai_services import WhisperTranscriber, KeywordExtractor
from ai_services import SemanticMatcher
from ai_services import ImageGenerator, SVGGenerator
from scrapers import ScraperManager
from video_engine import FFmpegWrapper

logger = logging.getLogger(__name__)


class AudioService:
    def __init__(self):
        self.whisper = WhisperTranscriber()
        self.keyword_extractor = KeywordExtractor()

    async def transcribe(self, file: UploadFile, project_id: Optional[str] = None) -> Dict:
        file_id = str(uuid.uuid4())
        temp_dir = os.path.join(project_root, "data", "temp")
        os.makedirs(temp_dir, exist_ok=True)

        temp_path = os.path.join(temp_dir, f"{file_id}_{file.filename}")

        async with aiofiles.open(temp_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        try:
            result = await self.whisper.transcribe(temp_path)

            if result.full_text:
                keywords = await self.keyword_extractor.extract_keywords(result.full_text, top_k=30)
            else:
                keywords = []

            segments_data = [
                {
                    "id": seg.id,
                    "startTime": seg.start_time,
                    "endTime": seg.end_time,
                    "text": seg.text,
                    "keywords": []
                }
                for seg in result.segments
            ]

            return {
                "id": result.id,
                "fileName": result.file_name,
                "duration": result.duration,
                "language": result.language,
                "transcription": {
                    "fullText": result.full_text,
                    "segments": segments_data,
                    "keywords": [
                        {"id": kw.id, "word": kw.word, "category": kw.category, "color": kw.color}
                        for kw in keywords
                    ]
                }
            }

        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    async def extract_keywords(self, text: str) -> List[Dict]:
        keywords = await self.keyword_extractor.extract_keywords(text, top_k=30)
        return [
            {"id": kw.id, "word": kw.word, "category": kw.category, "color": kw.color}
            for kw in keywords
        ]

    async def get_waveform(self, audio_id: str) -> List[float]:
        return [0.1] * 100

    async def get_segments(self, audio_id: str) -> List[Dict]:
        return []


class MediaService:
    def __init__(self):
        self.scraper_manager = ScraperManager()
        self.semantic_matcher = SemanticMatcher()

    async def scrape_for_keywords(
        self,
        keywords: List[str],
        media_type: str = "image"
    ) -> Dict:
        return await self.scraper_manager.scrape_for_keywords(keywords, media_type)

    async def match_media(
        self,
        keywords: List[str],
        candidate_media: List[Dict],
        threshold: float = 0.6
    ) -> List[Dict]:
        results = await self.semantic_matcher.find_matches(keywords, candidate_media, threshold)
        return [
            {
                "mediaId": r.media_id,
                "similarity": r.similarity,
                "matchedKeywords": r.matched_keywords
            }
            for r in results
        ]


class AIGenerationService:
    def __init__(self):
        self.image_generator = ImageGenerator()
        self.svg_generator = SVGGenerator()

    async def generate_image(
        self,
        prompt: str,
        style: str = "photorealistic",
        width: int = 512,
        height: int = 512,
        negative_prompt: str = ""
    ) -> Dict:
        result = await self.image_generator.generate_image(
            prompt=prompt,
            style=style,
            width=width,
            height=height,
            negative_prompt=negative_prompt
        )

        return {
            "imageBase64": result.image_base64,
            "seed": result.seed,
            "width": result.width,
            "height": result.height
        }

    async def generate_svg(
        self,
        keywords: List[str],
        animation_type: str = "fade",
        duration: float = 1.0
    ) -> Dict:
        result = await self.svg_generator.generate_animation(
            keywords=keywords,
            animation_type=animation_type,
            duration=duration
        )

        return {
            "svgContent": result.svg_content,
            "svgBase64": result.svg_base64,
            "duration": result.duration
        }


__all__ = ['AudioService', 'MediaService', 'AIGenerationService']
