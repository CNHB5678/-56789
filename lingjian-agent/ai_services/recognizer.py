import logging
from typing import List, Dict, Optional
import numpy as np
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class RecognitionResult:
    tags: List[str]
    description: str
    objects: List[str]
    confidence: float


class MediaRecognizer:
    def __init__(self):
        self._initialized = False
        self._clip_model = None
        self._vit_model = None

    async def initialize(self):
        if self._initialized:
            return

        try:
            from transformers import CLIPProcessor, CLIPModel
            logger.info("Loading CLIP model for media recognition...")

            self._clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            self._processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

            self._initialized = True
            logger.info("Media recognizer initialized")

        except ImportError:
            logger.warning("Transformers not installed, using fallback recognition")
            self._initialized = True
        except Exception as e:
            logger.error(f"Failed to initialize media recognizer: {e}")
            self._initialized = True

    async def recognize_image(self, image_path: str) -> RecognitionResult:
        await self.initialize()

        if self._clip_model and self._processor:
            try:
                from PIL import Image

                image = Image.open(image_path)
                candidate_labels = [
                    "person", "nature", "landscape", "animal", "food",
                    "technology", "business", "sports", "music", "art",
                    "city", "building", "vehicle", "flower", "ocean",
                    "mountain", "forest", "desert", "sky", "water"
                ]

                inputs = self._processor(
                    text=candidate_labels,
                    images=image,
                    return_tensors="pt",
                    padding=True
                )

                outputs = self._clip_model(**inputs)
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1)

                top_indices = probs[0].topk(5).indices
                top_labels = [candidate_labels[i] for i in top_indices]
                top_probs = [float(probs[0][i]) for i in top_indices]

                objects = [label for label, prob in zip(top_labels, top_probs) if prob > 0.1]
                description = ", ".join(top_labels[:3])

                return RecognitionResult(
                    tags=top_labels,
                    description=description,
                    objects=objects,
                    confidence=float(probs[0].max())
                )

            except Exception as e:
                logger.error(f"Image recognition failed: {e}")

        return RecognitionResult(
            tags=[],
            description="",
            objects=[],
            confidence=0.0
        )

    async def recognize_video(self, video_path: str) -> List[Dict]:
        await self.initialize()

        from video_engine import FFmpegWrapper

        ffmpeg = FFmpegWrapper()
        temp_dir = "./data/temp/frames"
        os.makedirs(temp_dir, exist_ok=True)

        frames = await ffmpeg.extract_frames(video_path, temp_dir, interval=2.0)

        results = []
        for i, frame_path in enumerate(frames):
            result = await self.recognize_image(frame_path)
            results.append({
                "frame_index": i,
                "timestamp": i * 2.0,
                "recognition": result
            })

        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)

        return results

    async def extract_key_frames(self, video_path: str) -> List[str]:
        from video_engine import FFmpegWrapper

        ffmpeg = FFmpegWrapper()
        temp_dir = "./data/temp/keyframes"
        os.makedirs(temp_dir, exist_ok=True)

        frames = await ffmpeg.extract_frames(video_path, temp_dir, interval=1.0)

        if self._clip_model and len(frames) > 5:
            key_frames = await self._select_diverse_frames(frames)
        else:
            key_frames = frames[:5] if len(frames) > 5 else frames

        return key_frames

    async def _select_diverse_frames(self, frames: List[str]) -> List[str]:
        try:
            from PIL import Image
            from transformers import CLIPProcessor, CLIPModel

            images = [Image.open(f) for f in frames[:20]]
            inputs = self._processor(images=images, return_tensors="pt", padding=True)

            with torch.no_grad():
                image_features = self._clip_model.get_image_features(**inputs)

            image_features = image_features.numpy()
            similarity = np.dot(image_features, image_features.T)

            selected = [0]
            for _ in range(min(5, len(frames) - 1)):
                last_selected = selected[-1]
                similarities = similarity[last_selected]
                max_idx = max(range(len(similarities)), key=lambda i: similarities[i] if i not in selected else -1)
                selected.append(max_idx)

            return [frames[i] for i in selected]

        except Exception as e:
            logger.error(f"Frame selection failed: {e}")
            return frames[:5]


import os
import torch
