from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.favourite_repo import FavouriteRepository
from app.models.favourite import Favourite
from app.schemas.favourite import FavouriteRequest


class FavouriteService:
    def __init__(self):
        self.repo = FavouriteRepository()

    async def get_user_favourites(
        self, db: AsyncSession, user_id: str, page: int = 1, limit: int = 20
    ) -> tuple[list[Favourite], int]:
        skip = (page - 1) * limit
        return await self.repo.get_multi(db, skip=skip, limit=limit, filters={"user_id": user_id})

    async def is_favourited(self, db: AsyncSession, user_id: str, photo_id: str) -> bool:
        return await self.repo.is_favourited(db, user_id, photo_id)

    async def toggle_favourite(
        self, db: AsyncSession, user_id: str, photo_id: str
    ) -> bool:
        is_fav = await self.repo.is_favourited(db, user_id, photo_id)
        if is_fav:
            await self.repo.remove_by_user_and_photo(db, user_id, photo_id)
            return False
        else:
            await self.repo.create(db, user_id=user_id, photo_id=photo_id)
            return True
