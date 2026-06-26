import logging
from typing import BinaryIO, Optional
from minio import Minio
from minio.error import S3Error

from .config import settings

logger = logging.getLogger(__name__)


class MinioClient:
    def __init__(self):
        self._client: Optional[Minio] = None
        self._boto_client = None

    def init(self):
        if settings.STORAGE_TYPE == "minio":
            self._client = Minio(
                endpoint=settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE,
            )
            self._ensure_bucket(settings.MINIO_BUCKET_NAME)
        elif settings.STORAGE_TYPE in ("oss", "s3"):
            import boto3
            from botocore.config import Config as BotoConfig
            boto_config = BotoConfig(
                region_name=settings.OSS_REGION,
                signature_version="s3v4",
            )
            endpoint_url = f"https://{settings.OSS_ENDPOINT}" if settings.OSS_ENDPOINT.startswith("oss-") else settings.OSS_ENDPOINT
            self._boto_client = boto3.client(
                "s3",
                endpoint_url=endpoint_url,
                aws_access_key_id=settings.OSS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.OSS_ACCESS_KEY_SECRET,
                config=boto_config,
            )
        logger.info(f"Storage client initialized: {settings.STORAGE_TYPE}")

    def _ensure_bucket(self, bucket_name: str):
        if settings.STORAGE_TYPE == "minio" and self._client:
            if not self._client.bucket_exists(bucket_name):
                self._client.make_bucket(bucket_name)
                logger.info(f"Created bucket: {bucket_name}")

    async def upload_file(
        self,
        bucket: str,
        object_name: str,
        data: BinaryIO,
        length: int,
        content_type: str = "application/octet-stream",
    ) -> str:
        if settings.STORAGE_TYPE == "minio" and self._client:
            self._client.put_object(
                bucket_name=bucket,
                object_name=object_name,
                data=data,
                length=length,
                content_type=content_type,
            )
        elif self._boto_client:
            self._boto_client.put_object(
                Bucket=bucket,
                Key=object_name,
                Body=data,
                ContentType=content_type,
            )
        logger.info(f"Uploaded file: {bucket}/{object_name}")
        return object_name

    async def get_presigned_url(
        self,
        bucket: str,
        object_name: str,
        expires: int = 3600,
    ) -> str:
        if settings.STORAGE_TYPE == "minio" and self._client:
            from datetime import timedelta
            return self._client.presigned_get_object(
                bucket_name=bucket,
                object_name=object_name,
                expires=timedelta(seconds=expires),
            )
        elif self._boto_client:
            return self._boto_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket, "Key": object_name},
                ExpiresIn=expires,
            )
        return ""

    async def delete_file(self, bucket: str, object_name: str) -> bool:
        try:
            if settings.STORAGE_TYPE == "minio" and self._client:
                self._client.remove_object(bucket, object_name)
            elif self._boto_client:
                self._boto_client.delete_object(Bucket=bucket, Key=object_name)
            logger.info(f"Deleted file: {bucket}/{object_name}")
            return True
        except S3Error:
            logger.error(f"Failed to delete file: {bucket}/{object_name}")
            return False

    async def file_exists(self, bucket: str, object_name: str) -> bool:
        try:
            if settings.STORAGE_TYPE == "minio" and self._client:
                self._client.stat_object(bucket, object_name)
                return True
            elif self._boto_client:
                self._boto_client.head_object(Bucket=bucket, Key=object_name)
                return True
        except Exception:
            return False
        return False


minio_client = MinioClient()
