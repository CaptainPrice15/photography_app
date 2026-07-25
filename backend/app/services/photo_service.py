from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.photo_repo import PhotoRepository
from app.repositories.category_repo import CategoryRepository
from app.models.photo import Photo
from app.schemas.photo import PhotoCreate, PhotoUpdate


class PhotoService:
    def __init__(self):
        self.repo = PhotoRepository()
        self.category_repo = CategoryRepository()

    async def get_photos(
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
        page: int = 1,
        limit: int = 20,
    ) -> tuple[list[Photo], int]:
        skip = (page - 1) * limit
        return await self.repo.search(
            db,
            search=search,
            category_id=category_id,
            location=location,
            camera=camera,
            lens=lens,
            year=year,
            sort=sort,
            skip=skip,
            limit=limit,
        )

    async def get_by_id(self, db: AsyncSession, photo_id: str) -> Optional[Photo]:
        return await self.repo.get(db, photo_id)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Photo]:
        return await self.repo.get_by_slug(db, slug)

    async def get_featured(self, db: AsyncSession, limit: int = 12) -> list[Photo]:
        return await self.repo.get_featured(db, limit)

    async def get_latest(self, db: AsyncSession, limit: int = 12) -> list[Photo]:
        return await self.repo.get_latest(db, limit)

    async def get_popular(self, db: AsyncSession, limit: int = 12) -> list[Photo]:
        return await self.repo.get_popular(db, limit)

    async def get_related(self, db: AsyncSession, photo_id: str, limit: int = 6) -> list[Photo]:
        return await self.repo.get_related(db, photo_id, limit)

    async def increment_view_count(self, db: AsyncSession, photo_id: str) -> None:
        await self.repo.increment_view_count(db, photo_id)

    async def create(self, db: AsyncSession, data: PhotoCreate) -> Photo:
        existing = await self.repo.get_by_slug(db, data.slug)
        if existing:
            raise ValueError("Photo with this slug already exists")
        return await self.repo.create(db, **data.model_dump())

    async def update(
        self, db: AsyncSession, photo_id: str, data: PhotoUpdate
    ) -> Optional[Photo]:
        update_data = data.model_dump(exclude_unset=True)
        if "slug" in update_data:
            existing = await self.repo.get_by_slug(db, update_data["slug"])
            if existing and str(existing.id) != photo_id:
                raise ValueError("Photo with this slug already exists")
        return await self.repo.update(db, photo_id, **update_data)

    async def delete(self, db: AsyncSession, photo_id: str) -> bool:
        return await self.repo.delete(db, photo_id)
