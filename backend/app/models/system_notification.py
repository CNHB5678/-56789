from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class SystemNotification(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "system_notifications"

    type = Column(String(30), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="draft", nullable=False, index=True)
    
    send_scope = Column(String(20), default="all", nullable=False)
    total_recipients = Column(Integer, default=0, nullable=False)
    sent_count = Column(Integer, default=0, nullable=False)
    failed_count = Column(Integer, default=0, nullable=False)
    
    trigger_source = Column(String(50), default="manual", nullable=False)
    related_diagnose_id = Column(Uuid(as_uuid=True), ForeignKey("diagnose_records.id"), nullable=True)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)

    notification_logs = relationship("NotificationLog", back_populates="notification", cascade="all, delete-orphan")
