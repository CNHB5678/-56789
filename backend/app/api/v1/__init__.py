from fastapi import APIRouter
from ...core.config import settings


def create_api_router() -> APIRouter:
    api_router = APIRouter(prefix=settings.API_V1_PREFIX)
    
    from .auth import router as auth_router
    from .projects import router as projects_router
    from .files import router as files_router
    from .workspace import router as workspace_router
    from .admin_config import router as admin_config_router
    from .admin_diagnose import router as admin_diagnose_router
    
    api_router.include_router(auth_router)
    api_router.include_router(projects_router)
    api_router.include_router(files_router)
    api_router.include_router(workspace_router)
    api_router.include_router(admin_config_router)
    api_router.include_router(admin_diagnose_router)
    
    return api_router


api_router = create_api_router()
