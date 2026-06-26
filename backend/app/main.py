from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import logging
from typing import Dict, Set

from .core.config import settings
from .core.database import engine, Base
from .core.redis import redis_client
from .api.v1 import api_router
from .services.storage_service import storage_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        self.diagnose_connections: Dict[str, WebSocket] = {}

    async def connect_project(self, project_id: str, client_id: str, websocket: WebSocket):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = {}
        self.active_connections[project_id][client_id] = websocket

    async def disconnect_project(self, project_id: str, client_id: str):
        if project_id in self.active_connections:
            self.active_connections[project_id].pop(client_id, None)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]

    async def broadcast_project(self, project_id: str, message: dict):
        if project_id in self.active_connections:
            disconnected = []
            for client_id, ws in self.active_connections[project_id].items():
                try:
                    await ws.send_json(message)
                except Exception:
                    disconnected.append(client_id)
            for client_id in disconnected:
                await self.disconnect_project(project_id, client_id)

    async def connect_diagnose(self, diagnose_id: str, websocket: WebSocket):
        await websocket.accept()
        self.diagnose_connections[diagnose_id] = websocket

    async def disconnect_diagnose(self, diagnose_id: str):
        self.diagnose_connections.pop(diagnose_id, None)

    async def send_diagnose(self, diagnose_id: str, message: dict):
        if diagnose_id in self.diagnose_connections:
            try:
                await self.diagnose_connections[diagnose_id].send_json(message)
            except Exception:
                await self.disconnect_diagnose(diagnose_id)


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Jianying AI Agent backend...")
    
    try:
        await redis_client.init()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
    
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created")
    except Exception as e:
        logger.warning(f"Database initialization failed (may need postgres): {e}")
    
    try:
        import os
        os.makedirs(settings.TEMP_DIR, exist_ok=True)
        await storage_service.init_bucket()
        logger.info("Storage bucket initialized")
    except Exception as e:
        logger.warning(f"Storage initialization failed: {e}")
    
    yield
    
    logger.info("Shutting down...")
    await redis_client.close()
    await engine.dispose()


app = FastAPI(
    title="Jianying AI Agent API",
    description="剪映AI草稿生成Agent后端API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "name": "Jianying AI Agent API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.websocket("/ws/projects/{project_id}")
async def websocket_project_progress(websocket: WebSocket, project_id: str):
    import uuid
    client_id = str(uuid.uuid4())
    await manager.connect_project(project_id, client_id, websocket)
    try:
        cached_progress = await redis_client.get_json(f"task:progress:{project_id}")
        if cached_progress:
            await websocket.send_json({
                "type": "progress",
                "data": cached_progress
            })
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "pong", "data": data})
    except WebSocketDisconnect:
        await manager.disconnect_project(project_id, client_id)


@app.websocket("/ws/admin/diagnose/{diagnose_id}")
async def websocket_diagnose(websocket: WebSocket, diagnose_id: str):
    await manager.connect_diagnose(diagnose_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect_diagnose(diagnose_id)


app.state.ws_manager = manager
