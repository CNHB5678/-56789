from sqlalchemy import Column, String, Integer, Float, BigInteger, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class Shot(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "shots"

    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    index = Column(Integer, nullable=False)
    
    start_us = Column(BigInteger, default=0, nullable=False)
    end_us = Column(BigInteger, default=0, nullable=False)
    text = Column(Text, default="")
    
    scene_description = Column(Text, default="")
    keywords = Column(JSONB, default=list)
    emotion = Column(String(50), default="neutral")
    
    bg_image_id = Column(UUID(as_uuid=True), ForeignKey("files.id"), nullable=True)
    bg_prompt = Column(Text, default="")
    
    bg_scale = Column(Float, default=1.0)
    bg_transform_x = Column(Float, default=0.0)
    bg_transform_y = Column(Float, default=0.0)

    project = relationship("Project", back_populates="shots")
    bg_image = relationship("File", foreign_keys=[bg_image_id])
    foreground_objects = relationship("ForegroundObject", back_populates="shot", cascade="all, delete-orphan", order_by="ForegroundObject.z_index")
