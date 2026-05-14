from fastapi import APIRouter, UploadFile, File, HTTPException, Query, BackgroundTasks
from typing import List, Optional
import uuid
import logging
import os
import aiofiles

from app.services.ai_services import MediaService

router = APIRouter()
logger = logging.getLogger(__name__)

media_service = MediaService()

media_library = {}


@router.get("/")
async def get_media_list(
    type: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    results = list(media_library.values())

    if type and type != "all":
        results = [m for m in results if m.get("mediaType") == type]
    if source and source != "all":
        results = [m for m in results if m.get("source") == source]
    if search:
        results = [m for m in results if search.lower() in m.get("fileName", "").lower()]

    return results


@router.post("/upload")
async def upload_media(
    project_id: Optional[str] = Query(None),
    file: UploadFile = File(...)
):
    try:
        media_id = str(uuid.uuid4())
        media_dir = "./data/media"
        os.makedirs(media_dir, exist_ok=True)

        ext = os.path.splitext(file.filename)[1]
        save_path = os.path.join(media_dir, f"{media_id}{ext}")

        async with aiofiles.open(save_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        media_info = {
            "id": media_id,
            "projectId": project_id,
            "fileName": file.filename,
            "filePath": save_path,
            "mediaType": _guess_media_type(ext),
            "format": ext.lstrip('.').upper(),
            "tags": [],
            "source": "local",
            "createdAt": str(uuid.uuid4())
        }

        media_library[media_id] = media_info
        return media_info

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _guess_media_type(ext: str) -> str:
    ext = ext.lower()
    image_exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    video_exts = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    audio_exts = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']

    if ext in image_exts:
        return "image"
    elif ext in video_exts:
        return "video"
    elif ext in audio_exts:
        return "audio"
    elif ext == '.svg':
        return "svg"
    return "image"


@router.delete("/{media_id}")
async def delete_media(media_id: str):
    if media_id in media_library:
        media = media_library[media_id]
        if os.path.exists(media.get("filePath", "")):
            os.unlink(media["filePath"])
        del media_library[media_id]
    return {"success": True}


@router.get("/{media_id}/preview")
async def get_preview(media_id: str):
    if media_id not in media_library:
        raise HTTPException(status_code=404, detail="Media not found")

    media = media_library[media_id]
    return {
        "preview": f"/media/{media_id}/file",
        "thumbnail": f"/media/{media_id}/thumbnail"
    }


@router.post("/search")
async def search_media(keywords: List[str]):
    try:
        matched = await media_service.match_media(
            keywords=keywords,
            candidate_media=list(media_library.values()),
            threshold=0.5
        )
        return matched
    except Exception as e:
        logger.error(f"Media search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scrape")
async def scrape_media(
    background_tasks: BackgroundTasks,
    keywords: List[str],
    media_type: str = "image"
):
    try:
        logger.info(f"Scraping media for keywords: {keywords}, type: {media_type}")
        result = await media_service.scrape_for_keywords(keywords, media_type)
        return result
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories")
async def get_categories():
    return ["图片", "视频", "音频", "SVG动画"]


@router.post("/{media_id}/recognize")
async def recognize_media(media_id: str):
    if media_id not in media_library:
        raise HTTPException(status_code=404, detail="Media not found")

    try:
        media = media_library[media_id]
        result = await media_service.recognize_media(media_id, media["filePath"])
        return result
    except Exception as e:
        logger.error(f"Media recognition failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
