import logging
import time
from typing import Dict, Any
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..models.project import Project
from ..models.user import User

logger = logging.getLogger(__name__)


class WorkspaceService:
    @staticmethod
    async def get_stats(
        db: AsyncSession,
        user: User,
    ) -> Dict[str, Any]:
        total_result = await db.execute(
            select(func.count()).select_from(Project).where(
                Project.user_id == user.id,
                Project.is_deleted == False,
            )
        )
        total_projects = total_result.scalar() or 0
        
        completed_result = await db.execute(
            select(func.count()).select_from(Project).where(
                Project.user_id == user.id,
                Project.is_deleted == False,
                Project.status == "completed",
            )
        )
        completed_projects = completed_result.scalar() or 0
        
        quota_remaining = max(0, user.quota_monthly - user.quota_used)
        
        return {
            "total_projects": total_projects,
            "completed_projects": completed_projects,
            "quota_remaining": quota_remaining,
            "quota_used": user.quota_used,
            "quota_monthly": user.quota_monthly,
        }

    @staticmethod
    async def get_recycle_bin(
        db: AsyncSession,
        user: User,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        query = select(Project).where(
            Project.user_id == user.id,
            Project.is_deleted == True,
        )
        
        count_result = await db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()
        
        query = query.order_by(Project.deleted_at.desc()).offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(query)
        projects = result.scalars().all()
        
        return {
            "items": projects,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    @staticmethod
    async def restore_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> Project:
        result = await db.execute(
            select(Project).where(
                Project.id == project_id,
                Project.user_id == user.id,
                Project.is_deleted == True,
            )
        )
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="回收站中未找到该项目"
            )
        
        project.is_deleted = False
        project.deleted_at = None
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def permanent_delete_project(
        db: AsyncSession,
        project_id: str,
        user: User,
    ) -> None:
        result = await db.execute(
            select(Project).where(
                Project.id == project_id,
                Project.user_id == user.id,
                Project.is_deleted == True,
            )
        )
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="回收站中未找到该项目"
            )
        
        await db.delete(project)
        await db.commit()


workspace_service = WorkspaceService()
