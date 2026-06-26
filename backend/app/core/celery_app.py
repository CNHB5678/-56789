from celery import Celery
from .config import settings


def _get_redis_url(db: int) -> str:
    base = settings.REDIS_URL.rsplit("/", 1)[0]
    return f"{base}/{db}"


celery_app = Celery(
    "jianying_ai",
    broker=settings.CELERY_BROKER_URL or _get_redis_url(1),
    backend=settings.CELERY_RESULT_BACKEND or _get_redis_url(2),
    include=[
        "app.workers.pipeline",
        "app.workers.notification",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Shanghai",
    enable_utc=False,
    task_track_started=True,
    task_time_limit=3600,
    task_soft_time_limit=3000,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)


@celery_app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
