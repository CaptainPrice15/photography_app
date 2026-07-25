from typing import Optional, List, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.photo import Photo
from app.repositories.base import BaseRepository


class PhotoRepository(BaseRepository[Photo]):
    def __init__(self):
        super().__init__(Photo)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Photo]:
        result = await db.execute(
            select(Photo).where(Photo.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_featured(self, db: AsyncSession, limit: int = 12) -> List[Photo]:
        result = await db.execute(
            select(Photo)
            .where(Photo.is_featured == True, Photo.is_published == True)
            .order_by(desc(Photo.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_latest(self, db: AsyncSession, limit: int = 12) -> List[Photo]:
        result = await db.execute(
            select(Photo)
            .where(Photo.is_published == True)
            .order_by(desc(Photo.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_popular(self, db: AsyncSession, limit: int = 12) -> List[Photo]:
        result = await db.execute(
            select(Photo)
            .where(Photo.is_published == True)
            .order_by(desc(Photo.view_count))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def search(
        self,
        db: AsyncSession,
        *,
        search: Optional[str] = None,
        category_id: Optional[str] = None,
        location: Optional[str] = None,
        camera: Optional[str] = None,
        lens: Optional[str] = None,
        year: Optional[int] = None,
        sort: str = "newest",
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Photo], int]:
        query = select(Photo).where(Photo.is_published == True)

        if search:
            query = query.where(
                Photo.title.ilike(f"%{search}%") |
                Photo.description.ilike(f"%{search}%")
            )
        if category_id:
            query = query.where(Photo.category_id == category_id)
        if location:
            query = query.where(Photo.location_name.ilike(f"%{location}%"))
        if camera:
            query = query.where(
                Photo.camera_make.ilike(f"%{camera}%") |
                Photo.camera_model.ilike(f"%{camera}%")
            )
        if lens:
            query = query.where(Photo.lens.ilike(f"%{lens}%"))
        if year:
            query = query.where(func.extract("year", Photo.taken_at) == year)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()

        if sort == "newest":
            query = query.order_by(desc(Photo.created_at))
        elif sort == "popular":
            query = query.order_by(desc(Photo.view_count))
        elif sort == "price_asc":
            query = query.order_by(Photo.price.asc())
        elif sort == "price_desc":
            query = query.order_by(Photo.price.desc())
        else:
            query = query.order_by(desc(Photo.created_at))

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def get_related(self, db: AsyncSession, photo_id: str, limit: int = 6) -> List[Photo]:
        photo = await self.get(db, photo_id)
        if not photo:
            return []

        query = (
            select(Photo)
            .where(
                Photo.id != photo_id,
                Photo.is_published == True,
                Photo.category_id == photo.category_id,
            )
            .order_by(desc(Photo.view_count))
            .limit(limit)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def increment_view_count(self, db: AsyncSession, photo_id: str) -> None:
        photo = await self.get(db, photo_id)
        if photo:
            photo.view_count += 1
            await db.commit()

    async def increment_download_count(self, db: AsyncSession, photo_id: str) -> None:
        photo = await self.get(db, photo_id)
        if photo:
            photo.download_count += 1
            await db.commit()
