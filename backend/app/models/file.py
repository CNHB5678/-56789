from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey, Uuid, JSON
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class File(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "files"

    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    
    file_type = Column(String(50), nullable=False, index=True)
    source = Column(String(50), nullable=False)
    
    filename = Column(String(500), nullable=False)
    oss_key = Column(String(500), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(BigInteger, default=0)
    
    width = Column(Integer)
    height = Column(Integer)
    duration_us = Column(BigInteger)
    file_metadata = Column("metadata", JSON, default=dict)

    user = relationship("User", back_populates="files")
    project = relationship("Project", foreign_keys=[project_id])
