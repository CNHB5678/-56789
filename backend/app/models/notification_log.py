from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin
from ..core.database import Base


class NotificationLog(UUIDMixin, Base):
    __tablename__ = "notification_logs"

    notification_id = Column(Uuid(as_uuid=True), ForeignKey("system_notifications.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    channel = Column(String(20), nullable=False)
    status = Column(String(20), default="pending", nullable=False, index=True)
    
    wechat_msgid = Column(String(100), nullable=True)
    error_message = Column(Text, nullable=True)
    
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False)

    notification = relationship("SystemNotification", back_populates="notification_logs")
