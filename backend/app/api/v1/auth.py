from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
)
from ...core.config import settings
from ...models.user import User
from ...schemas.auth import (
    SendCodeRequest,
    LoginPhoneRequest,
    LoginPasswordRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
    WechatBindQRCodeResponse,
)
from ...schemas.user import UserResponse
from ..deps import get_current_active_user
from ...services import auth_service

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/send-code", status_code=status.HTTP_200_OK)
async def send_code(
    request: SendCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    await auth_service.send_verification_code(phone=request.phone)
    return {"message": "验证码已发送"}


@router.post("/login-phone", response_model=TokenResponse)
async def login_phone(
    request: LoginPhoneRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.authenticate_by_phone_code(db, phone=request.phone, code=request.code)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="手机号或验证码错误"
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user, from_attributes=True)
    )


@router.post("/login-password", response_model=TokenResponse)
async def login_password(
    request: LoginPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.authenticate_by_password(db, phone=request.phone, password=request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="手机号或密码错误"
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user, from_attributes=True)
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.register_user(
        db,
        phone=request.phone,
        code=request.code,
        password=request.password,
        nickname=request.nickname
    )
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user, from_attributes=True)
    )


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: SendCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    await auth_service.send_reset_code(phone=request.phone)
    return {"message": "重置验证码已发送"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    await auth_service.reset_password_by_code(
        db,
        phone=request.phone,
        code=request.code,
        new_password=request.new_password
    )
    return {"message": "密码重置成功"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.refresh_access_token(db, refresh_token=request.refresh_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的刷新令牌"
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user, from_attributes=True)
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_active_user),
):
    wechat_bound = current_user.wechat_openid is not None
    user_data = UserResponse.model_validate(current_user, from_attributes=True)
    user_data.wechat_bound = wechat_bound
    return user_data


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.update_user_profile(
        db,
        user=current_user,
        nickname=request.nickname,
        avatar_url=request.avatar_url
    )
    wechat_bound = user.wechat_openid is not None
    user_data = UserResponse.model_validate(user, from_attributes=True)
    user_data.wechat_bound = wechat_bound
    return user_data


@router.put("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(request.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="原密码错误"
        )
    current_user.password_hash = get_password_hash(request.new_password)
    await db.commit()
    return {"message": "密码修改成功"}


@router.get("/wechat/bind-qrcode", response_model=WechatBindQRCodeResponse)
async def get_wechat_bind_qrcode(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await auth_service.get_wechat_bind_qrcode(db, user=current_user)
    return WechatBindQRCodeResponse(**result)


@router.post("/wechat/unbind", status_code=status.HTTP_200_OK)
async def unbind_wechat(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    await auth_service.unbind_wechat(db, user=current_user)
    return {"message": "微信解绑成功"}
