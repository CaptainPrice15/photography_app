from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.notification_repo import NotificationRepository
from app.models.notification import Notification
from app.schemas.notification import NotificationMarkRead


class NotificationService:
    def __init__(self):
        self.repo = NotificationRepository()

    async def get_user_notifications(
        self, db: AsyncSession, user_id: str, page: int = 1, limit: int = 20
    ) -> tuple[list[Notification], int]:
        skip = (page - 1) * limit
        return await self.repo.get_by_user(db, user_id, skip=skip, limit=limit)

    async def get_unread_count(self, db: AsyncSession, user_id: str) -> int:
        return await self.repo.get_unread_count(db, user_id)

    async def mark_read(
        self, db: AsyncSession, user_id: str, data: NotificationMarkRead
    ) -> dict:
        await self.repo.mark_read(db, user_id, data.notification_ids)
        return {"message": "Notifications marked as read"}

    async def mark_all_read(self, db: AsyncSession, user_id: str) -> dict:
        await self.repo.mark_all_read(db, user_id)
        return {"message": "All notifications marked as read"}
