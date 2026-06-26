import logging
import uuid
from typing import Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException, status

from ..core.config import settings
from ..models.file import File as FileModel
from ..models.user import User
from .storage_service import storage_service

logger = logging.getLogger(__name__)


class FileService:
    ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav", "audio/ogg", "audio/webm"}
    ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}

    @staticmethod
    def _get_extension(filename: str) -> str:
        parts = filename.rsplit(".", 1)
        return parts[-1].lower() if len(parts) > 1 else ""

    @staticmethod
    async def upload_file(
        db: AsyncSession,
        user: User,
        upload: UploadFile,
        project_id: Optional[str] = None,
        file_type: str = "other",
        source: str = "upload",
    ) -> FileModel:
        ext = FileService._get_extension(upload.filename or "")
        file_bytes = await upload.read()
        file_size = len(file_bytes)
        
        content_type = upload.content_type or "application/octet-stream"
        
        if file_type == "audio":
            if content_type not in FileService.ALLOWED_AUDIO_TYPES and ext not in {"mp3", "wav", "ogg", "webm", "m4a"}:
                raise HTTPException(status_code=400, detail="不支持的音频格式")
            max_size = settings.MAX_AUDIO_SIZE_MB * 1024 * 1024
            if file_size > max_size:
                raise HTTPException(status_code=400, detail=f"音频文件大小超过{settings.MAX_AUDIO_SIZE_MB}MB限制")
        elif file_type == "image":
            if content_type not in FileService.ALLOWED_IMAGE_TYPES and ext not in {"jpg", "jpeg", "png", "gif", "webp"}:
                raise HTTPException(status_code=400, detail="不支持的图片格式")
            max_size = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
            if file_size > max_size:
                raise HTTPException(status_code=400, detail=f"图片文件大小超过{settings.MAX_IMAGE_SIZE_MB}MB限制")
        
        object_name = f"{file_type}/{user.id}/{uuid.uuid4()}.{ext}" if ext else f"{file_type}/{user.id}/{uuid.uuid4()}"
        
        await storage_service.upload_file(file_bytes, object_name, content_type)
        
        file_record = FileModel(
            user_id=user.id,
            project_id=project_id,
            file_type=file_type,
            source=source,
            filename=upload.filename or "unknown",
            oss_key=object_name,
            mime_type=content_type,
            file_size=file_size,
        )
        
        db.add(file_record)
        await db.commit()
        await db.refresh(file_record)
        
        return file_record

    @staticmethod
    async def get_file(
        db: AsyncSession,
        file_id: str,
        user: User,
    ) -> FileModel:
        result = await db.execute(
            select(FileModel).where(
                FileModel.id == file_id,
                FileModel.user_id == user.id,
            )
        )
        file_record = result.scalar_one_or_none()
        
        if not file_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文件不存在"
            )
        
        return file_record

    @staticmethod
    async def get_download_url(
        db: AsyncSession,
        file_id: str,
        user: User,
        expires: int = 3600,
    ) -> Dict[str, Any]:
        file_record = await FileService.get_file(db, file_id, user)
        url = await storage_service.get_presigned_url(file_record.oss_key, expires)
        
        return {
            "download_url": url,
            "expires_in": expires,
            "filename": file_record.filename,
        }

    @staticmethod
    async def delete_file(
        db: AsyncSession,
        file_id: str,
        user: User,
    ) -> None:
        file_record = await FileService.get_file(db, file_id, user)
        
        try:
            await storage_service.delete_file(file_record.oss_key)
        except Exception as e:
            logger.warning(f"Failed to delete file from storage: {e}")
        
        await db.delete(file_record)
        await db.commit()


file_service = FileService()
