from sqlalchemy import Column, String, Boolean, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .mixins import UUIDMixin, TimestampMixin
from ..core.database import Base


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    phone = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nickname = Column(String(50))
    avatar_url = Column(String(500))
    
    wechat_openid = Column(String(100), unique=True, nullable=True)
    wechat_unionid = Column(String(100), nullable=True)
    
    quota_monthly = Column(Integer, default=30, nullable=False)
    quota_used = Column(Integer, default=0, nullable=False)
    quota_reset_date = Column(Date, nullable=True)
    
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    files = relationship("File", back_populates="user", cascade="all, delete-orphan")
