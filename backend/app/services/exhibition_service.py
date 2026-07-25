from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.exhibition_repo import ExhibitionRepository
from app.models.exhibition import Exhibition
from app.schemas.exhibition import ExhibitionCreate, ExhibitionUpdate


class ExhibitionService:
    def __init__(self):
        self.repo = ExhibitionRepository()

    async def get_exhibitions(
        self, db: AsyncSession, page: int = 1, limit: int = 20
    ) -> tuple[list[Exhibition], int]:
        skip = (page - 1) * limit
        return await self.repo.get_multi(db, skip=skip, limit=limit)

    async def get_by_id(self, db: AsyncSession, exhibition_id: str) -> Optional[Exhibition]:
        return await self.repo.get(db, exhibition_id)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Exhibition]:
        return await self.repo.get_by_slug(db, slug)

    async def get_published(
        self, db: AsyncSession, page: int = 1, limit: int = 20
    ) -> list[Exhibition]:
        skip = (page - 1) * limit
        return await self.repo.get_published(db, skip=skip, limit=limit)

    async def create(self, db: AsyncSession, data: ExhibitionCreate) -> Exhibition:
        existing = await self.repo.get_by_slug(db, data.slug)
        if existing:
            raise ValueError("Exhibition with this slug already exists")
        return await self.repo.create(db, **data.model_dump())

    async def update(
        self, db: AsyncSession, exhibition_id: str, data: ExhibitionUpdate
    ) -> Optional[Exhibition]:
        update_data = data.model_dump(exclude_unset=True)
        if "slug" in update_data:
            existing = await self.repo.get_by_slug(db, update_data["slug"])
            if existing and str(existing.id) != exhibition_id:
                raise ValueError("Exhibition with this slug already exists")
        return await self.repo.update(db, exhibition_id, **update_data)

    async def delete(self, db: AsyncSession, exhibition_id: str) -> bool:
        return await self.repo.delete(db, exhibition_id)
