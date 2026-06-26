from sqlalchemy import Column, Text, Boolean, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class Transcript(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "transcripts"

    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    content = Column(Text, nullable=False, default="")
    original_content = Column(Text, nullable=False, default="")
    words = Column(JSONB, default=list)
    
    is_confirmed = Column(Boolean, default=False, nullable=False)
    tts_voice_id = Column(String(100))

    project = relationship("Project", back_populates="transcript")
