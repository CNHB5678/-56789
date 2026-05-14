from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List, Optional
import uuid
import os
import logging
from app.services.audio_service import AudioService

router = APIRouter()
logger = logging.getLogger(__name__)

audio_service = AudioService()


@router.post("/transcribe")
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    try:
        result = await audio_service.transcribe(file)
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
        return segments
    except Exception as e:
        logger.error(f"Failed to get segments: {e}")
        raise HTTPException(status_code=500, detail=str(e))
