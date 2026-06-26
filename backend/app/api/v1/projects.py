from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from typing import Optional
import time

from ...core.database import get_db
from ...models.user import User
from ...models.project import Project
from ...schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectResponse,
    ProjectListResponse,
    ProjectListItem,
    DuplicateProjectRequest,
    RetryProjectRequest,
    SubmitPipelineRequest,
    ProgressResponse,
)
from ..deps import get_current_active_user, PaginationParams
from ...services import project_service

router = APIRouter(prefix="/projects", tags=["项目"])


@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    pagination: PaginationParams = Depends(),
    status_filter: Optional[str] = Query(None, alias="status"),
    order_by: str = Query("-created_at", description="排序字段，前缀-表示降序"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Project).where(
        Project.user_id == current_user.id,
        Project.is_deleted == False
    )
    
    if status_filter:
        query = query.where(Project.status == status_filter)
    
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    if order_by.startswith("-"):
        order_field = order_by[1:]
        query = query.order_by(getattr(Project, order_field).desc())
    else:
        query = query.order_by(getattr(Project, order_by).asc())
    
    query = query.offset((pagination.page - 1) * pagination.page_size).limit(pagination.page_size)
    result = await db.execute(query)
    projects = result.scalars().all()
    
    total_pages = (total + pagination.page_size - 1) // pagination.page_size if total > 0 else 0
    
    return ProjectListResponse(
        items=[ProjectListItem.model_validate(p, from_attributes=True) for p in projects],
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=total_pages
    )


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    request: ProjectCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.create_project(
        db,
        user=current_user,
        title=request.title,
        mode=request.mode,
        audio_file_id=request.audio_file_id,
        text_content=request.text_content,
        tts_voice_id=request.tts_voice_id,
        subtitle_enabled=request.subtitle_enabled,
        subtitle_style=request.subtitle_style,
        bgm_file_id=request.bgm_file_id
    )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.get_project_with_details(
        db,
        project_id=project_id,
        user_id=current_user.id
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    request: ProjectUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.update_project(
        db,
        project_id=project_id,
        user_id=current_user.id,
        title=request.title,
        subtitle_enabled=request.subtitle_enabled,
        subtitle_style=request.subtitle_style,
        bgm_file_id=request.bgm_file_id
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
            Project.is_deleted == False
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    
    project.is_deleted = True
    project.deleted_at = int(time.time() * 1000)
    await db.commit()
    
    return {"message": "项目已移至回收站"}


@router.post("/{project_id}/duplicate", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_project(
    project_id: UUID,
    request: DuplicateProjectRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.duplicate_project(
        db,
        project_id=project_id,
        user_id=current_user.id,
        new_title=request.title
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.post("/{project_id}/submit-pipeline", response_model=ProjectResponse)
async def submit_pipeline(
    project_id: UUID,
    request: SubmitPipelineRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.submit_pipeline(
        db,
        project_id=project_id,
        user_id=current_user.id,
        tts_voice_id=request.tts_voice_id
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.post("/{project_id}/retry", response_model=ProjectResponse)
async def retry_project(
    project_id: UUID,
    request: RetryProjectRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.retry_project(
        db,
        project_id=project_id,
        user_id=current_user.id,
        from_stage=request.from_stage
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return ProjectResponse.model_validate(project, from_attributes=True)


@router.get("/{project_id}/progress", response_model=ProgressResponse)
async def get_project_progress(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    progress = await project_service.get_project_progress(
        db,
        project_id=project_id,
        user_id=current_user.id
    )
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    return progress
