from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ...core.database import get_db
from ...models.user import User
from ...schemas.diagnose import (
    DiagnoseStartRequest,
    DiagnoseStartResponse,
    DiagnoseStatusResponse,
    DiagnoseFixRequest,
    DiagnoseFixResponse,
    DiagnoseHistoryResponse,
)
from ..deps import get_current_admin_user, PaginationParams
from ...services import diagnose_service

router = APIRouter(
    prefix="/admin/diagnose",
    tags=["系统诊断"],
    dependencies=[Depends(get_current_admin_user)]
)


@router.post("/run", response_model=DiagnoseStartResponse)
async def run_diagnose(
    request: DiagnoseStartRequest = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    triggered_by = request.triggered_by if request else "manual"
    result = await diagnose_service.start_diagnose(db, triggered_by=triggered_by)
    return result


@router.get("/{diagnose_id}/status", response_model=DiagnoseStatusResponse)
async def get_diagnose_status(
    diagnose_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    diagnose = await diagnose_service.get_diagnose_status(db, diagnose_id=diagnose_id)
    if not diagnose:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="诊断记录不存在"
        )
    return DiagnoseStatusResponse.model_validate(diagnose, from_attributes=True)


@router.post("/{diagnose_id}/fix", response_model=DiagnoseFixResponse)
async def fix_diagnose_issues(
    diagnose_id: UUID,
    request: DiagnoseFixRequest = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    result = await diagnose_service.fix_issues(
        db,
        diagnose_id=diagnose_id,
        fix_actions=request.fix_actions if request else None,
        fix_all=request.fix_all if request else False
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="诊断记录不存在"
        )
    return result


@router.get("/history", response_model=DiagnoseHistoryResponse)
async def get_diagnose_history(
    pagination: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    history = await diagnose_service.get_diagnose_history(
        db,
        page=pagination.page,
        page_size=pagination.page_size
    )
    return history
