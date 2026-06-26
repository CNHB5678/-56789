from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class DiagnoseResultItem(BaseModel):
    module: str
    item: str
    status: str = Field(..., pattern=r"^(pass|warning|fail)$")
    message: str
    fixable: bool = False
    fix_action: Optional[str] = None
    fix_result: Optional[str] = None


class DiagnoseStartRequest(BaseModel):
    triggered_by: str = Field("manual", pattern=r"^(auto|manual)$")


class DiagnoseStartResponse(BaseModel):
    diagnose_id: UUID
    status: str
    started_at: datetime
    total_checks: int


class DiagnoseStatusResponse(BaseModel):
    id: UUID
    started_at: datetime
    finished_at: Optional[datetime]
    status: str = Field(..., pattern=r"^(running|completed|failed)$")
    total_checks: int
    passed: int
    warnings: int
    failed: int
    results: List[DiagnoseResultItem]
    triggered_by: str
    created_at: datetime
    fixable_count: int = 0

    model_config = {"from_attributes": True}


class DiagnoseFixRequest(BaseModel):
    fix_actions: Optional[List[str]] = None
    fix_all: bool = False


class DiagnoseFixResult(BaseModel):
    action: str
    success: bool
    message: str


class DiagnoseFixResponse(BaseModel):
    diagnose_id: UUID
    total_fixes: int
    success_count: int
    failed_count: int
    results: List[DiagnoseFixResult]
    recheck_suggested: bool


class DiagnoseHistoryItem(BaseModel):
    id: UUID
    started_at: datetime
    finished_at: Optional[datetime]
    status: str
    total_checks: int
    passed: int
    warnings: int
    failed: int
    triggered_by: str

    model_config = {"from_attributes": True}


class DiagnoseHistoryResponse(BaseModel):
    items: List[DiagnoseHistoryItem]
    total: int
    page: int
    page_size: int
