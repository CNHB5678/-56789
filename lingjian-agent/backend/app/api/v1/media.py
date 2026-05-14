from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
import uuid
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
async def get_media_list(
    type: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    return []


@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    try:
        media_id = str(uuid.uuid4())
        return {
            "id": media_id,
            "fileName": file.filename,
            "mediaType": "image",
            "format": file.content_type,
            "tags": [],
            "source": "local",
        }
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{media_id}")
async def delete_media(media_id: str):
    return {"success": True}


@router.get("/{media_id}/preview")
async def get_preview(media_id: str):
    return {"preview": ""}


@router.post("/search")
async def search_media(keywords: List[str]):
    return []


@router.post("/scrape")
async def scrape_media(
    keywords: List[str],
    media_type: str = "image"
):
    return {
        "success": True,
        "scraped": [],
        "missingKeywords": keywords,
    }


@router.get("/categories")
async def get_categories():
    return ["图片", "视频", "音频", "SVG动画"]
