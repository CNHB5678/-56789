from ..core.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="pipeline.run_stage")
def run_pipeline_stage(self, project_id: str, stage: int, **kwargs):
    logger.info(f"Running pipeline stage {stage} for project {project_id}")
    return {"project_id": project_id, "stage": stage, "status": "completed"}


@celery_app.task(bind=True, name="pipeline.full")
def run_full_pipeline(self, project_id: str):
    logger.info(f"Starting full pipeline for project {project_id}")
    for stage in range(1, 9):
        run_pipeline_stage(project_id, stage)
    return {"project_id": project_id, "status": "completed"}
