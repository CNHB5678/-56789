from fastapi import APIRouter, HTTPException
from typing import List, Optional
import uuid
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

projects = {}


@router.get("/")
async def get_projects():
    return list(projects.values())


@router.post("/")
async def create_project(
    name: str,
    description: Optional[str] = None
):
    project_id = str(uuid.uuid4())
    project = {
        "id": project_id,
        "name": name,
        "description": description,
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
        "mediaLibrary": [],
        "timeline": {
            "duration": 0,
            "tracks": []
        }
    }
    projects[project_id] = project
    logger.info(f"Created project: {name} ({project_id})")
    return project


@router.get("/{project_id}")
async def get_project(project_id: str):
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects[project_id]


@router.put("/{project_id}")
async def update_project(
    project_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None
):
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")

    if name:
        projects[project_id]["name"] = name
    if description is not None:
        projects[project_id]["description"] = description

    projects[project_id]["updatedAt"] = datetime.now().isoformat()
    return projects[project_id]


@router.delete("/{project_id}")
async def delete_project(project_id: str):
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    del projects[project_id]
    logger.info(f"Deleted project: {project_id}")
    return {"success": True}
