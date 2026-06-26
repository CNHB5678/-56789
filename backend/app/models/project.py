from sqlalchemy import Column, String, Integer, Boolean, BigInteger, ForeignKey, Text, Uuid, JSON
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class Project(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "projects"

    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    mode = Column(String(20), nullable=False)
    
    status = Column(String(50), default="queued", nullable=False, index=True)
    current_stage = Column(Integer, default=1, nullable=False)
    progress = Column(Integer, default=0, nullable=False)
    progress_message = Column(String(200))
    
    duration_us = Column(BigInteger, default=0, nullable=False)
    canvas_width = Column(Integer, default=1708, nullable=False)
    canvas_height = Column(Integer, default=960, nullable=False)
    
    subtitle_enabled = Column(Boolean, default=True, nullable=False)
    subtitle_style = Column(JSON, default=dict)
    bgm_file_id = Column(Uuid(as_uuid=True), ForeignKey("files.id"), nullable=True)
    
    original_audio_id = Column(Uuid(as_uuid=True), ForeignKey("files.id"), nullable=True)
    draft_zip_path = Column(String(500))
    preview_video_path = Column(String(500))
    export_video_path = Column(String(500))
    
    cover_image_path = Column(String(500))
    error_message = Column(Text)
    celery_task_id = Column(String(100))
    
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    deleted_at = Column(BigInteger, nullable=True)

    user = relationship("User", back_populates="projects")
    original_audio = relationship("File", foreign_keys=[original_audio_id])
    bgm_file = relationship("File", foreign_keys=[bgm_file_id])
    transcript = relationship("Transcript", back_populates="project", uselist=False, cascade="all, delete-orphan")
    shots = relationship("Shot", back_populates="project", cascade="all, delete-orphan", order_by="Shot.index")
    subtitles = relationship("Subtitle", back_populates="project", cascade="all, delete-orphan", order_by="Subtitle.index")
    task_logs = relationship("CeleryTaskLog", back_populates="project", cascade="all, delete-orphan")
