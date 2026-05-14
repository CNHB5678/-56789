from fastapi import APIRouter, HTTPException
from typing import List, Optional
import logging
import base64
import os

from app.services.ai_services import AIGenerationService, MediaService

router = APIRouter()
logger = logging.getLogger(__name__)

ai_service = AIGenerationService()
media_service = MediaService()


@router.post("/match")
async def match_media(
    keywords: List[str],
    media_type: str = "image",
    threshold: float = 0.6
):
    try:
        from .media import media_library
        candidates = list(media_library.values())

        results = await media_service.match_media(
            keywords=keywords,
            candidate_media=candidates,
            threshold=threshold
        )
        return results
    except Exception as e:
        logger.error(f"Match failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/svg")
async def generate_svg(
    keywords: List[str],
    animation_type: str = "fade",
    duration: float = 1.0
):
    try:
        logger.info(f"Generating SVG for: {keywords}")
        result = await ai_service.generate_svg(
            keywords=keywords,
            animation_type=animation_type,
            duration=duration
        )
        return result
    except Exception as e:
        logger.error(f"SVG generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/image")
async def generate_image(
    prompt: str,
    negative_prompt: str = "",
    width: int = 512,
    height: int = 512,
    style: str = "photorealistic"
):
    try:
        logger.info(f"Generating image: prompt={prompt}, style={style}")
        result = await ai_service.generate_image(
            prompt=prompt,
            style=style,
            width=width,
            height=height,
            negative_prompt=negative_prompt
        )
        return result
    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recognize")
async def recognize_media(media_id: str):
    try:
        from .media import media_library

        if media_id not in media_library:
            raise HTTPException(status_code=404, detail="Media not found")

        media = media_library[media_id]
        result = await media_service.recognize_media(media_id, media["filePath"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recognition failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scrape-missing")
async def scrape_missing_assets(keywords: List[str]):
    try:
        from scrapers import ScraperManager

        manager = ScraperManager()
        result = await manager.scrape_for_keywords(keywords, "image")
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Scraping missing assets failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/styles")
async def get_image_styles():
    return {
        "styles": [
            {"id": "photorealistic", "name": "写实", "description": "逼真的摄影风格"},
            {"id": "anime", "name": "动漫", "description": "动漫风格"},
            {"id": "illustration", "name": "插画", "description": "数字插画"},
            {"id": "oil_painting", "name": "油画", "description": "油画风格"},
            {"id": "sketch", "name": "素描", "description": "素描风格"},
            {"id": "3d", "name": "3D", "description": "3D渲染风格"},
            {"id": "ancient", "name": "古风", "description": "古风风格"},
            {"id": "chinese", "name": "国风", "description": "国风水墨"},
            {"id": "sci-fi", "name": "科幻", "description": "科幻风格"}
        ]
    }
