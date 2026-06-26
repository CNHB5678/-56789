import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from ..models.project import Project
from ..models.shot import Shot
from ..models.transcript import Transcript
from ..models.file import File
from ..models.user import User

logger = logging.getLogger(__name__)


class ProjectService:
    @staticmethod
    async def create_project(
        db: AsyncSession,
        user: User,
        title: str,
        mode: str,
        subtitle_enabled: bool = True,
        bgm_file_id: Optional[str] = None,
        original_audio_id: Optional[str] = None,
        audio_duration: int = 0,
    ) -> Project:
        project = Project(
            user_id=user.id,
            title=title,
            mode=mode,
            status="waiting_confirm" if mode == "text" else "processing",
            current_stage=1 if mode == "audio" else 2,
            progress=10 if mode == "audio" else 0,
            progress_message="正在识别语音..." if mode == "audio" else "等待文案确认",
            subtitle_enabled=subtitle_enabled,
            bgm_file_id=bgm_file_id,
            original_audio_id=original_audio_id,
            duration_us=audio_duration,
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        
        transcript = Transcript(
            project_id=project.id,
            content="",
            original_content="",
            words=[],
            is_confirmed=False,
        )
        db.add(transcript)
        await db.commit()
        
        return project

    @staticmethod
    async def get_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Project:
        result = await db.execute(
            select(Project)
            .options(
                selectinload(Project.transcript),
                selectinload(Project.shots).selectinload(Shot.foreground_objects),
                selectinload(Project.original_audio),
            )
            .where(
                Project.id == project_id,
                Project.user_id == user.id,
                Project.is_deleted == False,
            )
        )
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
        
        return project

    @staticmethod
    async def list_projects(
        db: AsyncSession,
        user: User,
        page: int = 1,
        page_size: int = 20,
        status_filter: Optional[str] = None,
    ) -> Dict[str, Any]:
        query = select(Project).where(
            Project.user_id == user.id,
            Project.is_deleted == False,
        )
        
        if status_filter:
            query = query.where(Project.status == status_filter)
        
        count_result = await db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()
        
        query = query.order_by(Project.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(query)
        projects = result.scalars().all()
        
        return {
            "items": projects,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    @staticmethod
    async def update_project(
        db: AsyncSession,
        project_id: str,
        user: User,
        **kwargs
    ) -> Project:
        project = await ProjectService.get_project(db, project_id, user)
        
        for key, value in kwargs.items():
            if hasattr(project, key) and value is not None:
                setattr(project, key, value)
        
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> None:
        project = await ProjectService.get_project(db, project_id, user)
        project.is_deleted = True
        project.deleted_at = int(time.time() * 1000)
        await db.commit()

    @staticmethod
    async def duplicate_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Project:
        source = await ProjectService.get_project(db, project_id, user)
        
        new_project = Project(
            user_id=user.id,
            title=f"{source.title} (副本)",
            mode=source.mode,
            status="editing",
            progress=100,
            subtitle_enabled=source.subtitle_enabled,
            duration_us=source.duration_us,
        )
        db.add(new_project)
        await db.commit()
        await db.refresh(new_project)
        
        return new_project

    @staticmethod
    async def get_progress(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Dict[str, Any]:
        project = await ProjectService.get_project(db, project_id, user)
        return {
            "stage": project.current_stage,
            "progress": project.progress,
            "message": project.progress_message,
            "status": project.status,
        }

    @staticmethod
    async def submit_pipeline(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Project:
        project = await ProjectService.get_project(db, project_id, user)
        
        result = await db.execute(
            select(Transcript).where(Transcript.project_id == project.id)
        )
        transcript = result.scalar_one_or_none()
        
        if not transcript or not transcript.is_confirmed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="请先确认文案"
            )
        
        project.status = "analyzing"
        project.current_stage = 2
        project.progress = 25
        project.progress_message = "正在分析文案内容..."
        await db.commit()
        
        return project

    @staticmethod
    async def retry_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Project:
        project = await ProjectService.get_project(db, project_id, user)
        project.status = "processing"
        project.error_message = None
        await db.commit()
        await db.refresh(project)
        return project


project_service = ProjectService()
