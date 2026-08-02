import uuid
from typing import TypeVar, Generic, Type, Optional, List, Tuple, Union
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


def _to_uuid(val: Union[uuid.UUID, str, None]) -> Union[uuid.UUID, str, None]:
    if val is None:
        return None
    if isinstance(val, str):
        try:
            return uuid.UUID(val)
        except ValueError:
            return val
    return val


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Union[uuid.UUID, str]) -> Optional[ModelType]:
        target_id = _to_uuid(id)
        result = await db.execute(
            select(self.model).where(self.model.id == target_id)
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
                    target_val = _to_uuid(value) if "id" in key else value
                    query = query.where(getattr(self.model, key) == target_val)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()

        query = query.order_by(desc(getattr(self.model, order_by)))
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def create(self, db: AsyncSession, **kwargs) -> ModelType:
        processed_kwargs = {}
        for key, value in kwargs.items():
            if "id" in key:
                processed_kwargs[key] = _to_uuid(value)
            else:
                processed_kwargs[key] = value
        obj = self.model(**processed_kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, id: Union[uuid.UUID, str], **kwargs) -> Optional[ModelType]:
        target_id = _to_uuid(id)
        obj = await self.get(db, target_id)
        if obj:
            for key, value in kwargs.items():
                val_to_set = _to_uuid(value) if "id" in key else value
                setattr(obj, key, val_to_set)
            await db.commit()
            await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, id: Union[uuid.UUID, str]) -> bool:
        target_id = _to_uuid(id)
        obj = await self.get(db, target_id)
        if obj:
            await db.delete(obj)
            await db.commit()
            return True
        return False

    async def exists(self, db: AsyncSession, id: Union[uuid.UUID, str]) -> bool:
        target_id = _to_uuid(id)
        result = await db.execute(
            select(func.count()).where(self.model.id == target_id)
        )
        return result.scalar() > 0
