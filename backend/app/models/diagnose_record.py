from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .mixins import UUIDMixin
from ..core.database import Base


class DiagnoseRecord(UUIDMixin, Base):
    __tablename__ = "diagnose_records"

    started_at = Column(DateTime(timezone=True), nullable=False)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="running", nullable=False, index=True)
    
    total_checks = Column(Integer, default=0, nullable=False)
    passed = Column(Integer, default=0, nullable=False)
    warnings = Column(Integer, default=0, nullable=False)
    failed = Column(Integer, default=0, nullable=False)
    
    results = Column(JSONB, default=list)
    triggered_by = Column(String(20), default="manual", nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
