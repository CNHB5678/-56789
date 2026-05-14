from fastapi import APIRouter, UploadFile, File, HTTPException, Query, BackgroundTasks
from typing import List, Optional
import uuid
import logging
import os
import aiofiles

from app.services.ai_services import AudioService, MediaService, AIGenerationService
from app.services.audio_service import AudioService as LegacyAudioService

router = APIRouter()
logger = logging.getLogger(__name__)

audio_service = AudioService()
media_service = MediaService()
ai_service = AIGenerationService()


@router.post("/transcribe")
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    project_id: Optional[str] = Query(None),
    file: UploadFile = File(...)
):
    try:
        logger.info(f"Transcribing audio: {file.filename}")
        result = await audio_service.transcribe(file, project_id)
        return result
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-keywords")
async def extract_keywords(text: str):
    try:
        keywords = await audio_service.extract_keywords(text)
        return {"keywords": keywords}
    except Exception as e:
        logger.error(f"Keyword extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{audio_id}/waveform")
async def get_waveform(audio_id: str):
    try:
        waveform = await audio_service.get_waveform(audio_id)
        return {"waveform": waveform}
    except Exception as e:
        logger.error(f"Waveform generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{audio_id}/segments")
async def get_segments(audio_id: str):
    try:
        segments = await audio_service.get_segments(audio_id)
        return {"segments": segments}
    except Exception as e:
        logger.error(f"Failed to get segments: {e}")
        raise HTTPException(status_code=500, detail=str(e))
