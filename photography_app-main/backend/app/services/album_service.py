from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.album_repo import AlbumRepository
from app.models.album import Album
from app.schemas.album import AlbumCreate, AlbumUpdate


class AlbumService:
    def __init__(self):
        self.repo = AlbumRepository()

    async def get_albums(
        self, db: AsyncSession, page: int = 1, limit: int = 20
    ) -> tuple[list[Album], int]:
        skip = (page - 1) * limit
        return await self.repo.get_multi(db, skip=skip, limit=limit)

    async def get_by_id(self, db: AsyncSession, album_id: str) -> Optional[Album]:
        return await self.repo.get(db, album_id)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Album]:
        return await self.repo.get_by_slug(db, slug)

    async def get_featured(self, db: AsyncSession, limit: int = 12) -> list[Album]:
        return await self.repo.get_featured(db, limit)

    async def create(self, db: AsyncSession, data: AlbumCreate) -> Album:
        existing = await self.repo.get_by_slug(db, data.slug)
        if existing:
            raise ValueError("Album with this slug already exists")
        return await self.repo.create(db, **data.model_dump())

    async def update(
        self, db: AsyncSession, album_id: str, data: AlbumUpdate
    ) -> Optional[Album]:
        update_data = data.model_dump(exclude_unset=True)
        if "slug" in update_data:
            existing = await self.repo.get_by_slug(db, update_data["slug"])
            if existing and str(existing.id) != album_id:
                raise ValueError("Album with this slug already exists")
        return await self.repo.update(db, album_id, **update_data)

    async def delete(self, db: AsyncSession, album_id: str) -> bool:
        return await self.repo.delete(db, album_id)

    async def add_photo(
        self, db: AsyncSession, album_id: str, photo_id: str, sort_order: int = 0
    ) -> None:
        await self.repo.add_photo(db, album_id, photo_id, sort_order)

    async def remove_photo(
        self, db: AsyncSession, album_id: str, photo_id: str
    ) -> None:
        await self.repo.remove_photo(db, album_id, photo_id)
