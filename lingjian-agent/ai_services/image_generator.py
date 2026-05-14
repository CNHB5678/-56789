import logging
import base64
import io
from typing import Optional, List, Dict
from dataclasses import dataclass
from PIL import Image
import httpx

logger = logging.getLogger(__name__)


@dataclass
class GenerationResult:
    image_base64: str
    seed: Optional[int]
    width: int
    height: int


IMAGE_STYLES = {
    "photorealistic": "photorealistic, 8k, highly detailed, professional photography, sharp focus",
    "anime": "anime style, vibrant colors, cel shading, manga art, studio ghibli inspired",
    "illustration": "digital illustration, artstation, detailed artwork, concept art",
    "oil_painting": "oil painting style, classical art, brush strokes, renaissance style",
    "sketch": "pencil sketch, hand drawn, detailed drawing, graphite art",
    "3d": "3D render, octane render, cinema 4D, hyperrealistic, volumetric lighting, ray tracing",
    "ancient": "ancient Chinese style, traditional hanfu, historical costume, Tang dynasty aesthetics, classical Chinese painting",
    "chinese": "Chinese ink painting, shuimo style, traditional Chinese art, watercolor, gongbi, sumi-e",
    "sci-fi": "sci-fi style, cyberpunk, futuristic, neon lights, holographic, space art, star wars inspired"
}


class ImageGenerator:
    def __init__(self, api_url: str = "http://localhost:7860"):
        self.api_url = api_url.rstrip('/')
        self.sd_api_url = f"{self.api_url}/sdapi/v1"

    async def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = 512,
        height: int = 512,
        style: str = "photorealistic",
        steps: int = 30,
        cfg_scale: float = 7.5,
        seed: int = -1
    ) -> GenerationResult:
        style_prompt = IMAGE_STYLES.get(style, IMAGE_STYLES["photorealistic"])
        full_prompt = f"{prompt}, {style_prompt}"

        default_negative = "blurry, low quality, deformed, distorted, ugly, bad anatomy, bad proportions, extra limbs"
        full_negative = f"{negative_prompt}, {default_negative}" if negative_prompt else default_negative

        payload = {
            "prompt": full_prompt,
            "negative_prompt": full_negative,
            "width": min(width, 1024),
            "height": min(height, 1024),
            "steps": steps,
            "cfg_scale": cfg_scale,
            "seed": seed,
            "sampler_index": "Euler a"
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.sd_api_url}/txt2img",
                    json=payload
                )
                response.raise_for_status()
                result = response.json()

                images = result.get("images", [])
                if not images:
                    raise ValueError("No images generated")

                return GenerationResult(
                    image_base64=images[0],
                    seed=result.get("parameters", {}).get("seed"),
                    width=min(width, 1024),
                    height=min(height, 1024)
                )

        except httpx.ConnectError:
            logger.warning(f"Cannot connect to SD API at {self.api_url}")
            return await self._generate_fallback_image(prompt, style)
        except Exception as e:
            logger.error(f"Image generation failed: {e}")
            return await self._generate_fallback_image(prompt, style)

    async def _generate_fallback_image(self, prompt: str, style: str) -> GenerationResult:
        img = Image.new('RGB', (512, 512), color=(73, 109, 137))
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode()

        return GenerationResult(
            image_base64=img_base64,
            seed=None,
            width=512,
            height=512
        )

    async def upscale_image(
        self,
        image_base64: str,
        scale: int = 2
    ) -> GenerationResult:
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.sd_api_url}/extra-single-image",
                    json={
                        "image": image_base64,
                        "upscaling_resize": scale,
                        "upscaler_1": "R-ESRGAN 4x+"
                    }
                )
                response.raise_for_status()
                result = response.json()

                return GenerationResult(
                    image_base64=result.get("image", ""),
                    seed=None,
                    width=512 * scale,
                    height=512 * scale
                )

        except Exception as e:
            logger.error(f"Image upscaling failed: {e}")
            raise
