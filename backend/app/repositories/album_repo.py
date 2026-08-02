from typing import Optional, List
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.album import Album, album_photos
from app.models.photo import Photo
from app.repositories.base import BaseRepository


class AlbumRepository(BaseRepository[Album]):
    def __init__(self):
        super().__init__(Album)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Album]:
        result = await db.execute(
            select(Album).options(selectinload(Album.photos)).where(Album.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_with_photos(self, db: AsyncSession, album_id: str) -> Optional[Album]:
        result = await db.execute(
            select(Album)
            .options(selectinload(Album.photos))
            .where(Album.id == album_id)
        )
        return result.scalar_one_or_none()

    async def get_photos(
        self, db: AsyncSession, album_id: str
    ) -> List[Photo]:
        album = await self.get_with_photos(db, album_id)
        if not album:
            return []
        return sorted(
            album.photos,
            key=lambda p: getattr(p, "created_at", None),
            reverse=True,
        )

    async def get_featured(self, db: AsyncSession, limit: int = 12) -> List[Album]:
        result = await db.execute(
            select(Album)
            .where(Album.is_featured == True, Album.is_published == True)
            .order_by(desc(Album.sort_order))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def add_photo(self, db: AsyncSession, album_id: str, photo_id: str, sort_order: int = 0) -> None:
        stmt = album_photos.insert().values(
            album_id=album_id,
            photo_id=photo_id,
            sort_order=sort_order,
        )
        await db.execute(stmt)
        album = await self.get(db, album_id)
        if album:
            album.photo_count += 1
            await db.commit()

    async def remove_photo(self, db: AsyncSession, album_id: str, photo_id: str) -> None:
        stmt = album_photos.delete().where(
            album_photos.c.album_id == album_id,
            album_photos.c.photo_id == photo_id,
        )
        await db.execute(stmt)
        album = await self.get(db, album_id)
        if album:
            album.photo_count = max(0, album.photo_count - 1)
            await db.commit()
