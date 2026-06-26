import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, func, Uuid, JSON


class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class UUIDMixin:
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
