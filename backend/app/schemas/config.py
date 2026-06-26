from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


def mask_secret_value(value: Optional[str]) -> Optional[str]:
    if not value or len(value) <= 4:
        return value
    return f"{value[:2]}***{value[-2:]}"


class SystemConfigResponse(BaseModel):
    id: UUID
    category: str
    key: str
    value: Optional[str]
    value_type: str
    description: Optional[str]
    is_secret: bool
    is_enabled: bool
    updated_at: datetime

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def mask_secret(self) -> "SystemConfigResponse":
        if self.is_secret and self.value:
            self.value = mask_secret_value(self.value)
        return self


class ConfigItemResponse(BaseModel):
    key: str
    value: Optional[str]
    value_type: str
    description: Optional[str]
    is_secret: bool
    is_enabled: bool
    updated_at: datetime


class ConfigCategoryResponse(BaseModel):
    category: str
    items: List[ConfigItemResponse]


class SystemConfigListResponse(BaseModel):
    categories: List[ConfigCategoryResponse]


class ConfigUpdateRequest(BaseModel):
    value: Optional[str] = None
    is_enabled: Optional[bool] = None


class ConfigBatchUpdateItem(BaseModel):
    category: str
    key: str
    value: Optional[str] = None
    is_enabled: Optional[bool] = None


class ConfigBatchUpdateRequest(BaseModel):
    items: List[ConfigBatchUpdateItem]


class TestConnectionRequest(BaseModel):
    category: str
    key: str
    test_params: Optional[Dict[str, Any]] = None


class TestConnectionResponse(BaseModel):
    success: bool
    message: str
    latency_ms: Optional[int] = None
    details: Optional[Dict[str, Any]] = None


class ConfigInitResponse(BaseModel):
    initialized_count: int
    categories: List[str]
