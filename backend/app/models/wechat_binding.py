from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class WechatBinding(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "wechat_bindings"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    openid = Column(String(100), unique=True, nullable=False, index=True)
    unionid = Column(String(100), nullable=True)
    
    nickname = Column(String(100))
    avatar_url = Column(String(500))
    subscribed = Column(Boolean, default=True, nullable=False)
    bound_at = Column(DateTime(timezone=True), nullable=False)
