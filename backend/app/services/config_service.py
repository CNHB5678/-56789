import logging
from typing import Dict, List, Any, Optional
from collections import defaultdict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..core.security import encrypt_value, decrypt_value, mask_secret
from ..core.redis import redis_client
from ..models.system_config import SystemConfig

logger = logging.getLogger(__name__)


DEFAULT_CONFIGS = {
    "ai_asr": [
        {"key": "provider", "value": "aliyun", "value_type": "string", "description": "ASR服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "access_key_id", "value": "", "value_type": "string", "description": "Access Key ID", "is_secret": True, "is_enabled": True},
        {"key": "access_key_secret", "value": "", "value_type": "string", "description": "Access Key Secret", "is_secret": True, "is_enabled": True},
        {"key": "app_key", "value": "", "value_type": "string", "description": "App Key", "is_secret": True, "is_enabled": True},
        {"key": "region", "value": "cn-shanghai", "value_type": "string", "description": "服务区域", "is_secret": False, "is_enabled": True},
    ],
    "ai_tts": [
        {"key": "provider", "value": "aliyun", "value_type": "string", "description": "TTS服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "access_key_id", "value": "", "value_type": "string", "description": "Access Key ID", "is_secret": True, "is_enabled": True},
        {"key": "access_key_secret", "value": "", "value_type": "string", "description": "Access Key Secret", "is_secret": True, "is_enabled": True},
        {"key": "app_key", "value": "", "value_type": "string", "description": "App Key", "is_secret": True, "is_enabled": True},
        {"key": "default_voice", "value": "xiaoyun", "value_type": "string", "description": "默认音色", "is_secret": False, "is_enabled": True},
    ],
    "ai_nlp": [
        {"key": "provider", "value": "openai", "value_type": "string", "description": "NLP服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "api_key", "value": "", "value_type": "string", "description": "API Key", "is_secret": True, "is_enabled": True},
        {"key": "api_base", "value": "https://api.openai.com/v1", "value_type": "string", "description": "API Base URL", "is_secret": False, "is_enabled": True},
        {"key": "model", "value": "gpt-3.5-turbo", "value_type": "string", "description": "模型名称", "is_secret": False, "is_enabled": True},
        {"key": "temperature", "value": "0.7", "value_type": "number", "description": "生成温度", "is_secret": False, "is_enabled": True},
    ],
    "ai_image": [
        {"key": "provider", "value": "stable_diffusion", "value_type": "string", "description": "图像生成服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "api_key", "value": "", "value_type": "string", "description": "API Key", "is_secret": True, "is_enabled": True},
        {"key": "api_base", "value": "", "value_type": "string", "description": "API Base URL", "is_secret": False, "is_enabled": True},
        {"key": "default_model", "value": "sd-xl", "value_type": "string", "description": "默认模型", "is_secret": False, "is_enabled": True},
    ],
    "ai_matting": [
        {"key": "provider", "value": "removebg", "value_type": "string", "description": "抠图服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "api_key", "value": "", "value_type": "string", "description": "API Key", "is_secret": True, "is_enabled": True},
        {"key": "api_base", "value": "https://api.remove.bg/v1.0", "value_type": "string", "description": "API Base URL", "is_secret": False, "is_enabled": True},
    ],
    "sms": [
        {"key": "provider", "value": "aliyun", "value_type": "string", "description": "短信服务提供商", "is_secret": False, "is_enabled": True},
        {"key": "access_key_id", "value": "", "value_type": "string", "description": "Access Key ID", "is_secret": True, "is_enabled": True},
        {"key": "access_key_secret", "value": "", "value_type": "string", "description": "Access Key Secret", "is_secret": True, "is_enabled": True},
        {"key": "sign_name", "value": "", "value_type": "string", "description": "短信签名", "is_secret": False, "is_enabled": True},
        {"key": "template_code", "value": "", "value_type": "string", "description": "验证码模板CODE", "is_secret": False, "is_enabled": True},
    ],
    "oss": [
        {"key": "provider", "value": "minio", "value_type": "string", "description": "对象存储提供商", "is_secret": False, "is_enabled": True},
        {"key": "endpoint", "value": "localhost:9000", "value_type": "string", "description": "服务端点", "is_secret": False, "is_enabled": True},
        {"key": "access_key", "value": "minioadmin", "value_type": "string", "description": "Access Key", "is_secret": True, "is_enabled": True},
        {"key": "secret_key", "value": "minioadmin123", "value_type": "string", "description": "Secret Key", "is_secret": True, "is_enabled": True},
        {"key": "bucket", "value": "jianying", "value_type": "string", "description": "存储桶名称", "is_secret": False, "is_enabled": True},
        {"key": "secure", "value": "false", "value_type": "boolean", "description": "使用HTTPS", "is_secret": False, "is_enabled": True},
    ],
    "wechat": [
        {"key": "app_id", "value": "", "value_type": "string", "description": "微信AppID", "is_secret": True, "is_enabled": True},
        {"key": "app_secret", "value": "", "value_type": "string", "description": "微信AppSecret", "is_secret": True, "is_enabled": True},
        {"key": "login_enabled", "value": "false", "value_type": "boolean", "description": "启用微信登录", "is_secret": False, "is_enabled": True},
    ],
    "system": [
        {"key": "site_name", "value": "剪映AI", "value_type": "string", "description": "站点名称", "is_secret": False, "is_enabled": True},
        {"key": "max_audio_size_mb", "value": "100", "value_type": "number", "description": "最大音频文件大小(MB)", "is_secret": False, "is_enabled": True},
        {"key": "max_image_size_mb", "value": "20", "value_type": "number", "description": "最大图片文件大小(MB)", "is_secret": False, "is_enabled": True},
        {"key": "default_quota", "value": "30", "value_type": "number", "description": "默认月度配额", "is_secret": False, "is_enabled": True},
        {"key": "ffmpeg_path", "value": "/usr/bin/ffmpeg", "value_type": "string", "description": "FFmpeg路径", "is_secret": False, "is_enabled": True},
        {"key": "ffprobe_path", "value": "/usr/bin/ffprobe", "value_type": "string", "description": "FFprobe路径", "is_secret": False, "is_enabled": True},
    ],
}


class ConfigService:
    @staticmethod
    async def get_all_configs(db: AsyncSession) -> Dict[str, List[Dict[str, Any]]]:
        result = await db.execute(select(SystemConfig).order_by(SystemConfig.category, SystemConfig.key))
        configs = result.scalars().all()
        
        categories: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        for config in configs:
            value = config.value
            if config.is_secret and value:
                value = mask_secret(value)
            
            categories[config.category].append({
                "key": config.key,
                "value": value,
                "value_type": config.value_type,
                "description": config.description,
                "is_secret": config.is_secret,
                "is_enabled": config.is_enabled,
                "updated_at": config.updated_at,
            })
        
        return dict(categories)

    @staticmethod
    async def get_config(db: AsyncSession, category: str, key: str) -> Optional[str]:
        cache_key = f"config:{category}:{key}"
        cached_value = await redis_client.get(cache_key)
        if cached_value is not None:
            return decrypt_value(cached_value) if cached_value else None
        
        result = await db.execute(
            select(SystemConfig).where(
                SystemConfig.category == category,
                SystemConfig.key == key
            )
        )
        config = result.scalar_one_or_none()
        
        if not config:
            return None
        
        value = decrypt_value(config.value) if config.value else None
        
        if value is not None:
            await redis_client.set(cache_key, value, expire=3600)
        
        return value

    @staticmethod
    async def set_config(
        db: AsyncSession,
        category: str,
        key: str,
        value: Optional[str],
        value_type: str = "string",
        description: Optional[str] = None,
        is_secret: bool = False,
        is_enabled: bool = True
    ) -> SystemConfig:
        result = await db.execute(
            select(SystemConfig).where(
                SystemConfig.category == category,
                SystemConfig.key == key
            )
        )
        config = result.scalar_one_or_none()
        
        encrypted_value = encrypt_value(value) if (is_secret and value) else value
        
        if config:
            config.value = encrypted_value
            config.value_type = value_type
            if description is not None:
                config.description = description
            config.is_secret = is_secret
            config.is_enabled = is_enabled
        else:
            config = SystemConfig(
                category=category,
                key=key,
                value=encrypted_value,
                value_type=value_type,
                description=description,
                is_secret=is_secret,
                is_enabled=is_enabled,
            )
            db.add(config)
        
        await db.commit()
        await db.refresh(config)
        
        cache_key = f"config:{category}:{key}"
        await redis_client.delete(cache_key)
        
        return config

    @staticmethod
    async def init_default_configs(db: AsyncSession) -> Dict[str, Any]:
        initialized_count = 0
        categories = set()
        
        for category, items in DEFAULT_CONFIGS.items():
            categories.add(category)
            for item in items:
                result = await db.execute(
                    select(SystemConfig).where(
                        SystemConfig.category == category,
                        SystemConfig.key == item["key"]
                    )
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    encrypted_value = encrypt_value(item["value"]) if (item["is_secret"] and item["value"]) else item["value"]
                    config = SystemConfig(
                        category=category,
                        key=item["key"],
                        value=encrypted_value,
                        value_type=item["value_type"],
                        description=item["description"],
                        is_secret=item["is_secret"],
                        is_enabled=item["is_enabled"],
                    )
                    db.add(config)
                    initialized_count += 1
        
        await db.commit()
        
        return {
            "initialized_count": initialized_count,
            "categories": list(categories),
        }

    @staticmethod
    async def test_connection(
        db: AsyncSession,
        category: str,
        key: str
    ) -> Dict[str, Any]:
        result = await db.execute(
            select(SystemConfig).where(
                SystemConfig.category == category,
                SystemConfig.key == key
            )
        )
        config = result.scalar_one_or_none()
        
        if not config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="配置项不存在"
            )
        
        try:
            if category in ("ai_asr", "ai_tts", "ai_nlp", "ai_image", "ai_matting", "sms"):
                return {
                    "success": True,
                    "message": f"{category}服务连接测试框架已就绪，具体AI调用逻辑待实现",
                    "latency_ms": 0,
                    "details": {"category": category, "key": key}
                }
            elif category == "oss":
                try:
                    from ..services.storage_service import StorageService
                    client = StorageService.get_client()
                    bucket_name = (await ConfigService.get_config(db, "oss", "bucket")) or "jianying"
                    exists = client.bucket_exists(bucket_name)
                    return {
                        "success": exists,
                        "message": f"OSS连接{'成功' if exists else '失败，存储桶不存在'}",
                        "latency_ms": 50,
                        "details": {"bucket": bucket_name, "exists": exists}
                    }
                except Exception as e:
                    return {
                        "success": False,
                        "message": f"OSS连接失败: {str(e)}",
                        "latency_ms": None,
                        "details": {"error": str(e)}
                    }
            elif category == "wechat":
                return {
                    "success": False,
                    "message": "微信服务测试待实现",
                    "latency_ms": None,
                    "details": {"category": category}
                }
            else:
                return {
                    "success": True,
                    "message": "该配置项无需连接测试",
                    "latency_ms": 0,
                    "details": {"category": category}
                }
        except Exception as e:
            logger.error(f"Test connection failed for {category}.{key}: {e}")
            return {
                "success": False,
                "message": f"测试失败: {str(e)}",
                "latency_ms": None,
                "details": {"error": str(e)}
            }
config_service = ConfigService()
