from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exhibition import Exhibition
from app.repositories.base import BaseRepository


class ExhibitionRepository(BaseRepository[Exhibition]):
    def __init__(self):
        super().__init__(Exhibition)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Exhibition]:
        result = await db.execute(
            select(Exhibition).where(Exhibition.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_published(self, db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Exhibition]:
        result = await db.execute(
            select(Exhibition)
            .where(Exhibition.is_published == True)
            .order_by(Exhibition.start_date.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
