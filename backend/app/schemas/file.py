from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class FileUploadInitRequest(BaseModel):
    filename: str = Field(..., min_length=1, max_length=500)
    file_type: str = Field(..., pattern=r"^(audio|image|video)$")
    file_size: int = Field(..., ge=0)
    mime_type: Optional[str] = Field(None, max_length=100)
    project_id: Optional[UUID] = None
    chunk_size: Optional[int] = Field(None, ge=1024*1024)


class FileUploadChunkRequest(BaseModel):
    upload_id: str
    chunk_index: int = Field(..., ge=0)


class FileUploadResponse(BaseModel):
    file_id: UUID
    upload_id: str
    chunk_size: int
    total_chunks: int
    already_uploaded_chunks: list[int] = []


class FileUploadCompleteResponse(BaseModel):
    file_id: UUID
    filename: str
    file_type: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None
    duration_us: Optional[int] = None
    download_url: str


class FileResponse(BaseModel):
    id: UUID
    user_id: UUID
    project_id: Optional[UUID]
    file_type: str
    source: str
    filename: str
    oss_key: str
    mime_type: Optional[str]
    file_size: int
    width: Optional[int]
    height: Optional[int]
    duration_us: Optional[int]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    download_url: Optional[str] = None

    model_config = {"from_attributes": True}
