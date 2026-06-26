from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SendCodeRequest(BaseModel):
    phone: str = Field(..., pattern=r'^1[3-9]\d{9}$')


class LoginPhoneRequest(BaseModel):
    phone: str = Field(..., pattern=r'^1[3-9]\d{9}$')
    code: str = Field(..., min_length=4, max_length=8)


class LoginPasswordRequest(BaseModel):
    phone: str = Field(..., pattern=r'^1[3-9]\d{9}$')
    password: str = Field(..., min_length=6, max_length=32)


class RegisterRequest(BaseModel):
    phone: str = Field(..., pattern=r'^1[3-9]\d{9}$')
    code: str = Field(..., min_length=4, max_length=8)
    password: str = Field(..., min_length=6, max_length=32)
    nickname: Optional[str] = Field(None, max_length=50)


class ForgotPasswordRequest(BaseModel):
    phone: str = Field(..., pattern=r'^1[3-9]\d{9}$')
    code: str = Field(..., min_length=4, max_length=8)
    new_password: str = Field(..., min_length=6, max_length=32)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserResponse"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6, max_length=32)


class UpdateProfileRequest(BaseModel):
    nickname: Optional[str] = Field(None, max_length=50)
    avatar_url: Optional[str] = None


class WechatBindQRCodeResponse(BaseModel):
    qrcode_url: str
    token: str


from .user import UserResponse
TokenResponse.model_rebuild()
