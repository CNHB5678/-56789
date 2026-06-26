from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID

from ...core.database import get_db
from ...models.user import User
from ...models.project import Project
from ...schemas.project import ProjectListItem, ProjectListResponse
from ...schemas.user import UserStatsResponse
from ..deps import get_current_active_user, PaginationParams
from ...services import workspace_service

router = APIRouter(prefix="/workspace", tags=["工作区"])


@router.get("/stats", response_model=UserStatsResponse)
async def get_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    stats = await workspace_service.get_user_stats(db, user=current_user)
    return stats


@router.get("/recycle-bin", response_model=ProjectListResponse)
async def get_recycle_bin(
    pagination: PaginationParams = Depends(),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Project).where(
        Project.user_id == current_user.id,
        Project.is_deleted == True
    ).order_by(Project.deleted_at.desc())
    
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
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


@router.post("/recycle-bin/{project_id}/restore", status_code=status.HTTP_200_OK)
async def restore_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
            Project.is_deleted == True
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在或不在回收站中"
        )
    
    project.is_deleted = False
    project.deleted_at = None
    await db.commit()
    
    return {"message": "项目已恢复"}


@router.delete("/recycle-bin/{project_id}", status_code=status.HTTP_200_OK)
async def permanent_delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    success = await workspace_service.permanent_delete_project(
        db,
        project_id=project_id,
        user_id=current_user.id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在或不在回收站中"
        )
    return {"message": "项目已永久删除"}
