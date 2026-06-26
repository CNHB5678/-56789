from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ...core.database import get_db
from ...models.user import User
from ...schemas.config import (
    SystemConfigListResponse,
    ConfigCategoryResponse,
    ConfigUpdateRequest,
    ConfigBatchUpdateRequest,
    TestConnectionRequest,
    TestConnectionResponse,
    ConfigInitResponse,
)
from ..deps import get_current_admin_user
from ...services import config_service

router = APIRouter(
    prefix="/admin/config",
    tags=["系统配置"],
    dependencies=[Depends(get_current_admin_user)]
)


@router.get("/", response_model=SystemConfigListResponse)
async def get_all_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    categories = await config_service.get_all_configs_grouped(db)
    return SystemConfigListResponse(categories=categories)


@router.get("/{category}", response_model=ConfigCategoryResponse)
async def get_category_configs(
    category: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    items = await config_service.get_configs_by_category(db, category=category)
    if items is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"配置分类 {category} 不存在"
        )
    return ConfigCategoryResponse(category=category, items=items)


@router.put("/{category}/{key}", status_code=status.HTTP_200_OK)
async def update_config_item(
    category: str,
    key: str,
    request: ConfigUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    config = await config_service.update_config(
        db,
        category=category,
        key=key,
        value=request.value,
        is_enabled=request.is_enabled
    )
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="配置项不存在"
        )
    return {"message": "配置更新成功"}


@router.put("/batch", status_code=status.HTTP_200_OK)
async def batch_update_configs(
    request: ConfigBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    result = await config_service.batch_update_configs(db, items=request.items)
    return {"message": f"成功更新 {result['updated_count']} 项配置"}


@router.post("/{category}/{key}/test", response_model=TestConnectionResponse)
async def test_connection(
    category: str,
    key: str,
    request: TestConnectionRequest = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    result = await config_service.test_connection(
        db,
        category=category,
        key=key,
        test_params=request.test_params if request else None
    )
    return result


@router.post("/init", response_model=ConfigInitResponse)
async def init_default_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    result = await config_service.init_default_configs(db)
    return ConfigInitResponse(**result)
