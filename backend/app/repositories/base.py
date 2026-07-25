import uuid
from typing import TypeVar, Generic, Type, Optional, List, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[ModelType]:
        result = await db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 20,
        filters: Optional[dict] = None,
        order_by: str = "created_at",
    ) -> Tuple[List[ModelType], int]:
        query = select(self.model)

        if filters:
            for key, value in filters.items():
                if value is not None and hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()

        query = query.order_by(desc(getattr(self.model, order_by)))
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def create(self, db: AsyncSession, **kwargs) -> ModelType:
        obj = self.model(**kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, id: uuid.UUID, **kwargs) -> Optional[ModelType]:
        obj = await self.get(db, id)
        if obj:
            for key, value in kwargs.items():
                setattr(obj, key, value)
            await db.commit()
            await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, id: uuid.UUID) -> bool:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
            return True
        return False

    async def exists(self, db: AsyncSession, id: uuid.UUID) -> bool:
        result = await db.execute(
            select(func.count()).where(self.model.id == id)
        )
        return result.scalar() > 0
