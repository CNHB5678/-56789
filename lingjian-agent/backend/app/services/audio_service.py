import logging
from typing import Optional
from fastapi import UploadFile
import aiofiles
import os

logger = logging.getLogger(__name__)


class AudioService:
    def __init__(self):
        self.temp_dir = "./data/temp"
        os.makedirs(self.temp_dir, exist_ok=True)

    async def transcribe(self, file: UploadFile) -> dict:
        file_id = str(hash(file.filename))
        temp_path = os.path.join(self.temp_dir, f"{file_id}_{file.filename}")

        async with aiofiles.open(temp_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        return {
            "id": file_id,
            "fileName": file.filename,
            "duration": 0,
            "transcription": {
                "fullText": "",
                "segments": [],
                "keywords": []
            }
        }

    async def extract_keywords(self, text: str) -> list:
        keywords = []
        words = text.split()
        categories = ["person", "location", "object", "action", "emotion", "other"]
        colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DFE6E9"]

        for i, word in enumerate(words[:20]):
            if len(word) > 2:
                keywords.append({
                    "id": f"kw_{i}",
                    "word": word.strip(".,!?;:"),
                    "category": categories[i % len(categories)],
                    "color": colors[i % len(colors)]
                })

        return keywords

    async def get_waveform(self, audio_id: str) -> list:
        return [0.1] * 100

    async def get_segments(self, audio_id: str) -> list:
        return []
