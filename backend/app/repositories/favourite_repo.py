from typing import Optional, List, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.favourite import Favourite
from app.repositories.base import BaseRepository


class FavouriteRepository(BaseRepository[Favourite]):
    def __init__(self):
        super().__init__(Favourite)

    async def get_for_user(
        self,
        db: AsyncSession,
        user_id: str,
        *,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Favourite], int]:
        query = (
            select(Favourite)
            .options(selectinload(Favourite.photo))
            .where(Favourite.user_id == user_id)
        )
        total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar()
        query = query.order_by(desc(Favourite.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def get_by_user_and_photo(
        self, db: AsyncSession, user_id: str, photo_id: str
    ) -> Optional[Favourite]:
        result = await db.execute(
            select(Favourite).where(
                Favourite.user_id == user_id,
                Favourite.photo_id == photo_id,
            )
        )
        return result.scalar_one_or_none()

    async def is_favourited(self, db: AsyncSession, user_id: str, photo_id: str) -> bool:
        fav = await self.get_by_user_and_photo(db, user_id, photo_id)
        return fav is not None

    async def remove_by_user_and_photo(
        self, db: AsyncSession, user_id: str, photo_id: str
    ) -> bool:
        fav = await self.get_by_user_and_photo(db, user_id, photo_id)
        if fav:
            await db.delete(fav)
            await db.commit()
            return True
        return False
