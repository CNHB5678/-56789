from ..core.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="notification.wechat")
def send_wechat_notification(self, user_id: str, template_type: str, data: dict):
    logger.info(f"Sending {template_type} notification to user {user_id}")
    return {"user_id": user_id, "template_type": template_type, "status": "sent"}


@celery_app.task(bind=True, name="notification.system_broadcast")
def send_system_notification(self, notification_id: str):
    logger.info(f"Sending system notification {notification_id}")
    return {"notification_id": notification_id, "status": "sent"}
