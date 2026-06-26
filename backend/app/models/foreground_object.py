from sqlalchemy import Column, String, Integer, Float, BigInteger, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class ForegroundObject(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "foreground_objects"

    shot_id = Column(Uuid(as_uuid=True), ForeignKey("shots.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    
    image_id = Column(Uuid(as_uuid=True), ForeignKey("files.id"), nullable=True)
    matting_image_id = Column(Uuid(as_uuid=True), ForeignKey("files.id"), nullable=True)
    prompt = Column(String(1000), default="")
    
    scale = Column(Float, default=1.0)
    position_x = Column(Float, default=0.5)
    position_y = Column(Float, default=0.5)
    rotation = Column(Float, default=0.0)
    
    appear_time_us = Column(BigInteger, default=0)
    disappear_time_us = Column(BigInteger, default=0)
    
    animation_type = Column(String(50), default="slide_down")
    animation_duration_us = Column(BigInteger, default=500000)
    z_index = Column(Integer, default=0)

    shot = relationship("Shot", back_populates="foreground_objects")
    image = relationship("File", foreign_keys=[image_id])
    matting_image = relationship("File", foreign_keys=[matting_image_id])
