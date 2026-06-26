from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./jianying_ai.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    STORAGE_TYPE: str = "minio"
    
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET_NAME: str = "jianying"
    MINIO_SECURE: bool = False
    
    OSS_PROVIDER: str = "minio"
    OSS_ENDPOINT: str = ""
    OSS_REGION: str = "cn-hangzhou"
    OSS_ACCESS_KEY_ID: str = ""
    OSS_ACCESS_KEY_SECRET: str = ""
    OSS_BUCKET_NAME: str = "jianying"
    
    DOUBAO_API_KEY: str = ""
    DOUBAO_API_URL: str = "https://ark.cn-beijing.volces.com/api/v3"
    DOUBAO_MODEL: str = "doubao-pro-32k"
    DOUBAO_VISION_MODEL: str = "doubao-vision-pro"
    DOUBAO_SPEECH_MODEL: str = ""
    
    VOLCENGINE_ACCESS_KEY: str = ""
    VOLCENGINE_SECRET_KEY: str = ""
    VOLCENGINE_APPID: str = ""
    
    CAPCUT_API_URL: str = ""
    CAPCUT_API_KEY: str = ""
    
    FFMPEG_PATH: str = "/usr/bin/ffmpeg"
    FFPROBE_PATH: str = "/usr/bin/ffprobe"
    
    MAX_AUDIO_SIZE_MB: int = 100
    MAX_IMAGE_SIZE_MB: int = 20
    DEFAULT_QUOTA: int = 30
    
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:80", "http://localhost"]
    
    TEMP_DIR: str = "/app/temp"
    
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
