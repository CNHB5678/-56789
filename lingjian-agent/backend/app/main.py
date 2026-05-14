from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import get_settings
from app.api.v1 import audio, media, project, ai, editor, export

settings = get_settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting 灵剪Agent Backend...")
    logger.info(f"Version: {settings.app_version}")
    logger.info(f"Media root: {settings.media_root}")
    yield
    logger.info("Shutting down 灵剪Agent Backend...")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="灵剪Agent - 智能视频创作助手后端API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audio.router, prefix="/api/v1/audio", tags=["音频处理"])
app.include_router(media.router, prefix="/api/v1/media", tags=["素材管理"])
app.include_router(project.router, prefix="/api/v1/project", tags=["项目管理"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI服务"])
app.include_router(editor.router, prefix="/api/v1/editor", tags=["编辑器"])
app.include_router(export.router, prefix="/api/v1/export", tags=["导出"])


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
