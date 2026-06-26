from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import Optional
import uuid

from ...core.database import get_db
from ...core.config import settings
from ...models.user import User
from ...models.file import File as FileModel
from ...schemas.file import (
    FileResponse,
    FileUploadCompleteResponse,
)
from ..deps import get_current_active_user
from ...services import file_service

router = APIRouter(prefix="/files", tags=["文件"])


@router.post("/upload", response_model=FileUploadCompleteResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    project_id: Optional[UUID] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type:
        if file.content_type.startswith("audio/"):
            file_type = "audio"
            max_size = settings.MAX_AUDIO_SIZE_MB * 1024 * 1024
        elif file.content_type.startswith("image/"):
            file_type = "image"
            max_size = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="不支持的文件类型，仅支持audio和image"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无法识别文件类型"
        )
    
    file_size = 0
    content = await file.read()
    file_size = len(content)
    await file.seek(0)
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"文件大小超过限制，最大为{settings.MAX_AUDIO_SIZE_MB if file_type == 'audio' else settings.MAX_IMAGE_SIZE_MB}MB"
        )
    
    file_ext = file.filename.split(".")[-1] if "." in file.filename else ""
    new_filename = f"{uuid.uuid4()}.{file_ext}" if file_ext else str(uuid.uuid4())
    
    uploaded_file = await file_service.upload_file(
        db,
        user=current_user,
        file=file,
        file_type=file_type,
        original_filename=file.filename,
        new_filename=new_filename,
        file_size=file_size,
        mime_type=file.content_type,
        project_id=project_id
    )
    
    download_url = await file_service.get_presigned_url(db, file_id=uploaded_file.id, user_id=current_user.id)
    
    return FileUploadCompleteResponse(
        file_id=uploaded_file.id,
        filename=uploaded_file.filename,
        file_type=uploaded_file.file_type,
        file_size=uploaded_file.file_size,
        width=uploaded_file.width,
        height=uploaded_file.height,
        duration_us=uploaded_file.duration_us,
        download_url=download_url
    )


@router.get("/{file_id}", response_model=FileResponse)
async def get_file_info(
    file_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    file = await file_service.get_file(db, file_id=file_id, user_id=current_user.id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在"
        )
    return FileResponse.model_validate(file, from_attributes=True)


@router.get("/{file_id}/download")
async def download_file(
    file_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    download_url = await file_service.get_presigned_url(db, file_id=file_id, user_id=current_user.id)
    if not download_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在"
        )
    return {"download_url": download_url}


@router.delete("/{file_id}", status_code=status.HTTP_200_OK)
async def delete_file(
    file_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    success = await file_service.delete_file(db, file_id=file_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在"
        )
    return {"message": "文件删除成功"}
