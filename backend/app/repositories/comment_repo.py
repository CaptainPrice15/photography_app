from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comment import Comment
from app.repositories.base import BaseRepository


class CommentRepository(BaseRepository[Comment]):
    def __init__(self):
        super().__init__(Comment)

    async def get_by_photo(
        self, db: AsyncSession, photo_id: str, skip: int = 0, limit: int = 20
    ):
        from sqlalchemy import func, desc
        query = select(Comment).where(
            Comment.photo_id == photo_id,
            Comment.is_approved == True,
        )
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(Comment.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def get_by_user(
        self, db: AsyncSession, user_id: str, skip: int = 0, limit: int = 20
    ):
        from sqlalchemy import func, desc
        query = select(Comment).where(Comment.user_id == user_id)
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(Comment.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total
