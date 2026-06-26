import io
import logging
from typing import Optional
from minio import Minio
from minio.error import S3Error
from datetime import timedelta
from fastapi import HTTPException, status, UploadFile

from ..core.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    _client: Optional[Minio] = None

    @classmethod
    def get_client(cls) -> Minio:
        if cls._client is None:
            cls._client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE,
            )
        return cls._client

    @classmethod
    def get_bucket_name(cls) -> str:
        return settings.MINIO_BUCKET_NAME

    @classmethod
    async def init_bucket(cls) -> None:
        try:
            client = cls.get_client()
            bucket_name = cls.get_bucket_name()
            
            if not client.bucket_exists(bucket_name):
                client.make_bucket(bucket_name)
                logger.info(f"Bucket '{bucket_name}' created successfully")
            else:
                logger.info(f"Bucket '{bucket_name}' already exists")
        except Exception as e:
            logger.warning(f"Storage initialization skipped: {e}")

    @classmethod
    async def upload_fileobj(
        cls,
        file: UploadFile,
        object_name: str,
        content_type: str = "application/octet-stream"
    ) -> str:
        try:
            client = cls.get_client()
            bucket_name = cls.get_bucket_name()
            
            file_bytes = await file.read()
            data = io.BytesIO(file_bytes)
            data_size = len(file_bytes)
            
            client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=data,
                length=data_size,
                content_type=content_type,
            )
            
            logger.info(f"File uploaded successfully: {object_name}")
            return object_name
        except S3Error as e:
            logger.error(f"Failed to upload file: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"文件上传失败: {str(e)}"
            )

    @classmethod
    async def upload_bytes(
        cls,
        file_bytes: bytes,
        object_name: str,
        content_type: str = "application/octet-stream"
    ) -> str:
        try:
            client = cls.get_client()
            bucket_name = cls.get_bucket_name()
            
            data = io.BytesIO(file_bytes)
            data_size = len(file_bytes)
            
            client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=data,
                length=data_size,
                content_type=content_type,
            )
            
            logger.info(f"File uploaded successfully: {object_name}")
            return object_name
        except S3Error as e:
            logger.error(f"Failed to upload file: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"文件上传失败: {str(e)}"
            )

    @classmethod
    async def get_presigned_url(
        cls,
        object_name: str,
        expires: int = 3600
    ) -> str:
        try:
            client = cls.get_client()
            bucket_name = cls.get_bucket_name()
            
            url = client.presigned_get_object(
                bucket_name=bucket_name,
                object_name=object_name,
                expires=timedelta(seconds=expires),
            )
            
            return url
        except S3Error as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"生成下载链接失败: {str(e)}"
            )

    @classmethod
    async def delete_file(cls, object_name: str) -> None:
        try:
            client = cls.get_client()
            bucket_name = cls.get_bucket_name()
            
            client.remove_object(
                bucket_name=bucket_name,
                object_name=object_name,
            )
            
            logger.info(f"File deleted successfully: {object_name}")
        except S3Error as e:
            logger.error(f"Failed to delete file: {e}")

storage_service = StorageService()
