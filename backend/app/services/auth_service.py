import logging
import random
import uuid
from datetime import timedelta
from typing import Tuple, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
from fastapi import HTTPException, status

from ..core.config import settings
from ..core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from ..core.redis import redis_client
from ..models.user import User

logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    async def send_verification_code(phone: str) -> None:
        code = "".join([str(random.randint(0, 9)) for _ in range(6)])
        key = f"sms:code:{phone}"
        await redis_client.set(key, code, expire=300)
        
        if settings.ENVIRONMENT == "development":
            logger.info(f"[DEV SMS] 手机号 {phone} 的验证码是: {code}")
        else:
            logger.info(f"验证码已发送至 {phone}")

    @staticmethod
    async def verify_code(phone: str, code: str) -> bool:
        key = f"sms:code:{phone}"
        stored_code = await redis_client.get(key)
        
        if not stored_code or stored_code != code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="验证码错误或已过期"
            )
        
        await redis_client.delete(key)
        return True

    @staticmethod
    async def register_user(
        db: AsyncSession,
        phone: str,
        code: str,
        password: str,
        nickname: str | None = None
    ) -> User:
        await AuthService.verify_code(phone, code)
        
        result = await db.execute(select(User).where(User.phone == phone))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该手机号已注册"
            )
        
        password_hash = get_password_hash(password)
        user = User(
            phone=phone,
            password_hash=password_hash,
            nickname=nickname or f"用户{phone[-4:]}",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        return user

    @staticmethod
    async def authenticate_by_phone_code(
        db: AsyncSession,
        phone: str,
        code: str
    ) -> User:
        await AuthService.verify_code(phone, code)
        
        result = await db.execute(select(User).where(User.phone == phone))
        user = result.scalar_one_or_none()
        
        if not user:
            password_hash = get_password_hash(str(uuid.uuid4()))
            user = User(
                phone=phone,
                password_hash=password_hash,
                nickname=f"用户{phone[-4:]}",
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="用户账号已被禁用"
            )
        
        return user

    @staticmethod
    async def authenticate_by_password(
        db: AsyncSession,
        phone: str,
        password: str
    ) -> Optional[User]:
        result = await db.execute(select(User).where(User.phone == phone))
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="手机号或密码错误"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="用户账号已被禁用"
            )
        
        return user

    @staticmethod
    async def login_with_password(
        db: AsyncSession,
        phone: str,
        password: str
    ):
        user = await AuthService.authenticate_by_password(db, phone, password)
        return user

    @staticmethod
    async def refresh_access_token(
        db: AsyncSession,
        refresh_token_str: str
    ) -> Optional[User]:
        try:
            payload = jwt.decode(
                refresh_token_str,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type")
            
            if user_id is None or token_type != "refresh":
                return None
        except JWTError:
            return None
        
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            return None
        
        return user

    @staticmethod
    async def change_password(
        db: AsyncSession,
        user: User,
        old_password: str,
        new_password: str
    ) -> None:
        if not verify_password(old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="原密码错误"
            )
        
        user.password_hash = get_password_hash(new_password)
        await db.commit()

    @staticmethod
    async def send_reset_code(phone: str) -> None:
        await AuthService.send_verification_code(phone)

    @staticmethod
    async def reset_password_by_code(
        db: AsyncSession,
        phone: str,
        code: str,
        new_password: str
    ) -> None:
        await AuthService.verify_code(phone, code)
        
        result = await db.execute(select(User).where(User.phone == phone))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        
        user.password_hash = get_password_hash(new_password)
        await db.commit()

    @staticmethod
    async def update_user_profile(
        db: AsyncSession,
        user: User,
        nickname: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> User:
        if nickname is not None:
            user.nickname = nickname
        if avatar_url is not None:
            user.avatar_url = avatar_url
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def get_wechat_bind_qrcode(
        db: AsyncSession,
        user: User,
    ) -> Dict[str, Any]:
        token = str(uuid.uuid4())
        await redis_client.set(f"wechat:bind:{token}", str(user.id), expire=600)
        return {
            "qrcode_url": f"https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=PLACEHOLDER",
            "token": token,
        }

    @staticmethod
    async def unbind_wechat(
        db: AsyncSession,
        user: User,
    ) -> None:
        user.wechat_openid = None
        user.wechat_unionid = None
        await db.commit()


auth_service = AuthService()
