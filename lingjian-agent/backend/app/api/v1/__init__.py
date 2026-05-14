from fastapi import APIRouter
from app.api.v1 import audio, media, project, ai, editor, export

api_router = APIRouter()

api_router.include_router(audio.router, prefix="/audio", tags=["音频"])
api_router.include_router(media.router, prefix="/media", tags=["素材"])
api_router.include_router(project.router, prefix="/project", tags=["项目"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(editor.router, prefix="/editor", tags=["编辑器"])
api_router.include_router(export.router, prefix="/export", tags=["导出"])
