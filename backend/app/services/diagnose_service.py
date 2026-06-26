import os
import logging
import shutil
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..core.config import settings
from ..core.database import engine
from ..core.redis import redis_client
from ..models.diagnose_record import DiagnoseRecord
from ..models.system_config import SystemConfig

logger = logging.getLogger(__name__)


class DiagnoseService:
    @staticmethod
    def _make_result(
        module: str,
        item: str,
        status: str,
        message: str,
        fixable: bool = False,
        fix_action: Optional[str] = None
    ) -> Dict[str, Any]:
        return {
            "module": module,
            "item": item,
            "status": status,
            "message": message,
            "fixable": fixable,
            "fix_action": fix_action,
            "fix_result": None,
        }

    @staticmethod
    async def _check_database() -> Dict[str, Any]:
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return DiagnoseService._make_result(
                module="database",
                item="connection",
                status="pass",
                message="数据库连接正常",
            )
        except Exception as e:
            return DiagnoseService._make_result(
                module="database",
                item="connection",
                status="fail",
                message=f"数据库连接失败: {str(e)}",
            )

    @staticmethod
    async def _check_tables(db: AsyncSession) -> Dict[str, Any]:
        try:
            from ..core.database import Base
            from .. import models
            
            required_tables = [
                "users",
                "projects",
                "files",
                "transcripts",
                "shots",
                "foreground_objects",
                "subtitles",
                "celery_task_logs",
                "wechat_bindings",
                "system_configs",
                "diagnose_records",
                "system_notifications",
                "notification_logs",
            ]
            
            async with engine.connect() as conn:
                result = await conn.execute(
                    text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
                )
                existing_tables = {row[0] for row in result.fetchall()}
            
            missing_tables = [t for t in required_tables if t not in existing_tables]
            
            if missing_tables:
                return DiagnoseService._make_result(
                    module="database",
                    item="tables",
                    status="fail",
                    message=f"缺失数据表: {', '.join(missing_tables)}",
                    fixable=True,
                    fix_action="auto_migrate",
                )
            else:
                return DiagnoseService._make_result(
                    module="database",
                    item="tables",
                    status="pass",
                    message="所有数据表存在",
                )
        except Exception as e:
            return DiagnoseService._make_result(
                module="database",
                item="tables",
                status="fail",
                message=f"表完整性检查失败: {str(e)}",
            )

    @staticmethod
    async def _check_default_configs(db: AsyncSession) -> Dict[str, Any]:
        try:
            from ..services.config_service import DEFAULT_CONFIGS
            
            result = await db.execute(select(SystemConfig))
            existing_configs = result.scalars().all()
            existing_keys = {(c.category, c.key) for c in existing_configs}
            
            required_keys = set()
            for category, items in DEFAULT_CONFIGS.items():
                for item in items:
                    required_keys.add((category, item["key"]))
            
            missing = required_keys - existing_keys
            
            if missing:
                missing_str = ", ".join([f"{c}.{k}" for c, k in list(missing)[:5]])
                more = f" 等{len(missing)}项" if len(missing) > 5 else ""
                return DiagnoseService._make_result(
                    module="config",
                    item="default_configs",
                    status="fail",
                    message=f"缺失默认配置: {missing_str}{more}",
                    fixable=True,
                    fix_action="init_configs",
                )
            else:
                return DiagnoseService._make_result(
                    module="config",
                    item="default_configs",
                    status="pass",
                    message="默认配置完整",
                )
        except Exception as e:
            return DiagnoseService._make_result(
                module="config",
                item="default_configs",
                status="fail",
                message=f"默认配置检查失败: {str(e)}",
            )

    @staticmethod
    async def _check_redis() -> Dict[str, Any]:
        try:
            await redis_client.client.ping()
            return DiagnoseService._make_result(
                module="cache",
                item="redis",
                status="pass",
                message="Redis连接正常",
            )
        except Exception as e:
            return DiagnoseService._make_result(
                module="cache",
                item="redis",
                status="fail",
                message=f"Redis连接失败: {str(e)}",
            )

    @staticmethod
    async def _check_ffmpeg() -> Dict[str, Any]:
        ffmpeg_path = settings.FFMPEG_PATH
        ffprobe_path = settings.FFPROBE_PATH
        
        ffmpeg_exists = os.path.isfile(ffmpeg_path) and os.access(ffmpeg_path, os.X_OK)
        ffprobe_exists = os.path.isfile(ffprobe_path) and os.access(ffprobe_path, os.X_OK)
        
        if not ffmpeg_exists and not ffprobe_exists:
            system_ffmpeg = shutil.which("ffmpeg")
            system_ffprobe = shutil.which("ffprobe")
            if system_ffmpeg and system_ffprobe:
                return DiagnoseService._make_result(
                    module="media",
                    item="ffmpeg",
                    status="warning",
                    message=f"FFmpeg可在系统PATH找到: {system_ffmpeg}，但配置路径({ffmpeg_path})不正确",
                    fixable=False,
                )
            return DiagnoseService._make_result(
                module="media",
                item="ffmpeg",
                status="fail",
                message=f"FFmpeg/FFprobe未找到，请确认已安装并配置正确路径",
            )
        elif not ffmpeg_exists or not ffprobe_exists:
            missing = "FFmpeg" if not ffmpeg_exists else "FFprobe"
            return DiagnoseService._make_result(
                module="media",
                item="ffmpeg",
                status="warning",
                message=f"{missing}路径配置可能不正确",
            )
        else:
            return DiagnoseService._make_result(
                module="media",
                item="ffmpeg",
                status="pass",
                message="FFmpeg/FFprobe可用",
            )

    @staticmethod
    async def _check_directories() -> Dict[str, Any]:
        required_dirs = [
            settings.TEMP_DIR,
        ]
        
        created_dirs = []
        for dir_path in required_dirs:
            if not os.path.exists(dir_path):
                try:
                    os.makedirs(dir_path, exist_ok=True)
                    created_dirs.append(dir_path)
                except Exception as e:
                    return DiagnoseService._make_result(
                        module="system",
                        item="directories",
                        status="fail",
                        message=f"目录{dir_path}创建失败: {str(e)}",
                        fixable=True,
                        fix_action="create_dirs",
                    )
            elif not os.access(dir_path, os.R_OK | os.W_OK):
                return DiagnoseService._make_result(
                    module="system",
                    item="directories",
                    status="warning",
                    message=f"目录{dir_path}权限不足",
                    fixable=True,
                    fix_action="create_dirs",
                )
        
        if created_dirs:
            return DiagnoseService._make_result(
                module="system",
                item="directories",
                status="warning",
                message=f"已自动创建目录: {', '.join(created_dirs)}",
            )
        else:
            return DiagnoseService._make_result(
                module="system",
                item="directories",
                status="pass",
                message="目录权限正常",
            )

    @staticmethod
    async def _check_minio() -> Dict[str, Any]:
        try:
            from ..services.storage_service import StorageService
            client = StorageService.get_client()
            bucket_name = settings.MINIO_BUCKET
            
            if not client.bucket_exists(bucket_name):
                return DiagnoseService._make_result(
                    module="storage",
                    item="minio",
                    status="fail",
                    message=f"MinIO存储桶'{bucket_name}'不存在",
                    fixable=True,
                    fix_action="init_bucket",
                )
            
            return DiagnoseService._make_result(
                module="storage",
                item="minio",
                status="pass",
                message="MinIO连接正常，存储桶存在",
            )
        except Exception as e:
            return DiagnoseService._make_result(
                module="storage",
                item="minio",
                status="fail",
                message=f"MinIO连接失败: {str(e)}",
                fixable=True,
                fix_action="init_bucket",
            )

    @staticmethod
    async def run_diagnosis(
        db: AsyncSession,
        triggered_by: str = "manual"
    ) -> DiagnoseRecord:
        now = datetime.now(timezone.utc)
        record = DiagnoseRecord(
            started_at=now,
            status="running",
            triggered_by=triggered_by,
            created_at=now,
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)
        
        checks = [
            DiagnoseService._check_database(),
            DiagnoseService._check_tables(db),
            DiagnoseService._check_default_configs(db),
            DiagnoseService._check_redis(),
            DiagnoseService._check_ffmpeg(),
            DiagnoseService._check_directories(),
            DiagnoseService._check_minio(),
        ]
        
        results = []
        passed = 0
        warnings = 0
        failed = 0
        
        for check in checks:
            result = await check
            results.append(result)
            if result["status"] == "pass":
                passed += 1
            elif result["status"] == "warning":
                warnings += 1
            else:
                failed += 1
        
        record.finished_at = datetime.now(timezone.utc)
        record.status = "completed" if failed == 0 else "failed"
        record.total_checks = len(results)
        record.passed = passed
        record.warnings = warnings
        record.failed = failed
        record.results = results
        
        await db.commit()
        await db.refresh(record)
        
        return record

    @staticmethod
    async def fix_issue(
        db: AsyncSession,
        diagnose_id: str,
        action: str
    ) -> Dict[str, Any]:
        result = await db.execute(
            select(DiagnoseRecord).where(DiagnoseRecord.id == diagnose_id)
        )
        record = result.scalar_one_or_none()
        
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="诊断记录不存在"
            )
        
        success = False
        message = ""
        
        try:
            if action == "auto_migrate":
                from ..core.database import Base
                async with engine.begin() as conn:
                    await conn.run_sync(Base.metadata.create_all)
                success = True
                message = "数据库迁移完成"
            elif action == "init_configs":
                from ..services.config_service import ConfigService
                result = await ConfigService.init_default_configs(db)
                success = True
                message = f"已初始化{result['initialized_count']}个配置项"
            elif action == "create_dirs":
                os.makedirs(settings.TEMP_DIR, exist_ok=True)
                success = True
                message = "目录创建完成"
            elif action == "init_bucket":
                from ..services.storage_service import StorageService
                await StorageService.init_bucket()
                success = True
                message = "存储桶初始化完成"
            else:
                message = f"未知的修复操作: {action}"
        except Exception as e:
            logger.error(f"Fix action {action} failed: {e}")
            message = f"修复失败: {str(e)}"
        
        return {
            "action": action,
            "success": success,
            "message": message,
        }

    @staticmethod
    async def get_diagnose_record(
        db: AsyncSession,
        diagnose_id: str
    ) -> DiagnoseRecord:
        result = await db.execute(
            select(DiagnoseRecord).where(DiagnoseRecord.id == diagnose_id)
        )
        record = result.scalar_one_or_none()
        
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="诊断记录不存在"
            )
        
        return record

    @staticmethod
    async def list_diagnose_records(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        result = await db.execute(
            select(DiagnoseRecord).order_by(DiagnoseRecord.started_at.desc())
        )
        all_records = result.scalars().all()
        
        total = len(all_records)
        start = (page - 1) * page_size
        end = start + page_size
        items = all_records[start:end]
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

diagnose_service = DiagnoseService()
