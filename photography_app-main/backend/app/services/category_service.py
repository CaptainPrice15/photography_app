from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.category_repo import CategoryRepository
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self):
        self.repo = CategoryRepository()

    async def get_all(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> tuple[list[Category], int]:
        return await self.repo.get_multi(db, skip=skip, limit=limit)

    async def get_by_id(self, db: AsyncSession, category_id: str) -> Optional[Category]:
        return await self.repo.get(db, category_id)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Category]:
        return await self.repo.get_by_slug(db, slug)

    async def create(self, db: AsyncSession, data: CategoryCreate) -> Category:
        existing = await self.repo.get_by_slug(db, data.slug)
        if existing:
            raise ValueError("Category with this slug already exists")
        return await self.repo.create(db, **data.model_dump())

    async def update(
        self, db: AsyncSession, category_id: str, data: CategoryUpdate
    ) -> Optional[Category]:
        update_data = data.model_dump(exclude_unset=True)
        if "slug" in update_data:
            existing = await self.repo.get_by_slug(db, update_data["slug"])
            if existing and str(existing.id) != category_id:
                raise ValueError("Category with this slug already exists")
        return await self.repo.update(db, category_id, **update_data)

    async def delete(self, db: AsyncSession, category_id: str) -> bool:
        return await self.repo.delete(db, category_id)
