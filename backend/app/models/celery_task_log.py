from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin
from ..core.database import Base


class CeleryTaskLog(UUIDMixin, Base):
    __tablename__ = "celery_task_logs"

    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    stage = Column(Integer, nullable=False)
    stage_name = Column(String(50), nullable=False)
    
    status = Column(String(20), default="pending", nullable=False, index=True)
    progress = Column(Integer, default=0, nullable=False)
    message = Column(String(500))
    error_detail = Column(Text)
    
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    project = relationship("Project", back_populates="task_logs")
