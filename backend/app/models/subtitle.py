from sqlalchemy import Column, String, Integer, BigInteger, Text, ForeignKey, Uuid, JSON
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class Subtitle(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "subtitles"

    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    index = Column(Integer, nullable=False)
    
    start_us = Column(BigInteger, default=0, nullable=False)
    end_us = Column(BigInteger, default=0, nullable=False)
    text = Column(Text, default="")
    style = Column(JSON, default=dict)

    project = relationship("Project", back_populates="subtitles")
