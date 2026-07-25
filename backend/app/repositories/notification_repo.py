from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)

    async def get_by_user(
        self, db: AsyncSession, user_id: str, skip: int = 0, limit: int = 20
    ):
        from sqlalchemy import func, desc
        query = select(Notification).where(Notification.user_id == user_id)
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def get_unread_count(self, db: AsyncSession, user_id: str) -> int:
        from sqlalchemy import func
        result = await db.execute(
            select(func.count()).where(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
        )
        return result.scalar()

    async def mark_read(self, db: AsyncSession, user_id: str, notification_ids: list[str]) -> None:
        result = await db.execute(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.id.in_(notification_ids),
            )
        )
        for notification in result.scalars().all():
            notification.is_read = True
        await db.commit()

    async def mark_all_read(self, db: AsyncSession, user_id: str) -> None:
        result = await db.execute(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
        )
        for notification in result.scalars().all():
            notification.is_read = True
        await db.commit()
