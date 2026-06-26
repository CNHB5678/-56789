from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class TranscriptWord(BaseModel):
    word: str
    start_us: int
    end_us: int

    model_config = {"from_attributes": True}


class TranscriptResponse(BaseModel):
    id: UUID
    project_id: UUID
    content: str
    original_content: str
    words: List[TranscriptWord]
    is_confirmed: bool
    tts_voice_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ShotResponse(BaseModel):
    id: UUID
    project_id: UUID
    index: int
    start_us: int
    end_us: int
    text: str
    scene_description: str
    keywords: List[str]
    emotion: str
    bg_image_id: Optional[UUID]
    bg_prompt: str
    bg_scale: float
    bg_transform_x: float
    bg_transform_y: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    mode: str = Field(..., pattern=r"^(audio|text)$")
    audio_file_id: Optional[UUID] = None
    text_content: Optional[str] = Field(None, max_length=10000)
    tts_voice_id: Optional[str] = None
    subtitle_enabled: bool = True
    subtitle_style: Optional[Dict[str, Any]] = None
    bgm_file_id: Optional[UUID] = None


class ProjectUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subtitle_enabled: Optional[bool] = None
    subtitle_style: Optional[Dict[str, Any]] = None
    bgm_file_id: Optional[UUID] = None


class ProgressResponse(BaseModel):
    project_id: UUID
    status: str
    current_stage: int
    progress: int
    progress_message: Optional[str]
    error_message: Optional[str]


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    mode: str
    status: str
    current_stage: int
    progress: int
    progress_message: Optional[str]
    duration_us: int
    canvas_width: int
    canvas_height: int
    subtitle_enabled: bool
    subtitle_style: Optional[Dict[str, Any]]
    bgm_file_id: Optional[UUID]
    original_audio_id: Optional[UUID]
    draft_zip_path: Optional[str]
    preview_video_path: Optional[str]
    export_video_path: Optional[str]
    cover_image_path: Optional[str]
    error_message: Optional[str]
    celery_task_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    transcript: Optional[TranscriptResponse] = None
    shots: List[ShotResponse] = []

    model_config = {"from_attributes": True}


class ProjectListItem(BaseModel):
    id: UUID
    title: str
    mode: str
    status: str
    progress: int
    duration_us: int
    cover_image_path: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    items: List[ProjectListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class DuplicateProjectRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)


class RetryProjectRequest(BaseModel):
    from_stage: Optional[int] = Field(None, ge=1, le=8)


class SubmitPipelineRequest(BaseModel):
    tts_voice_id: Optional[str] = None
