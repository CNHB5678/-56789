from sqlalchemy import Column, String, Boolean, Text, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from .mixins import UUIDMixin
from ..core.database import Base


class SystemConfig(UUIDMixin, Base):
    __tablename__ = "system_configs"
    __table_args__ = (
        UniqueConstraint('category', 'key', name='uq_category_key'),
    )

    category = Column(String(50), nullable=False, index=True)
    key = Column(String(100), nullable=False, index=True)
    value = Column(Text, nullable=True)
    value_type = Column(String(20), default="string", nullable=False)
    description = Column(String(500))
    is_secret = Column(Boolean, default=False, nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
