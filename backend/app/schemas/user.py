from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from uuid import UUID


class UserResponse(BaseModel):
    id: UUID
    phone: str
    nickname: Optional[str]
    avatar_url: Optional[str]
    wechat_bound: bool = False
    quota_monthly: int
    quota_used: int
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserStatsResponse(BaseModel):
    total_projects: int
    completed_projects: int
    quota_remaining: int
    quota_reset_date: Optional[date]
