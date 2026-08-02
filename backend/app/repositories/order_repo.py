from typing import Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self):
        super().__init__(Order)

    async def get_with_items(self, db: AsyncSession, id: str) -> Optional[Order]:
        result = await db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == id)
        )
        return result.scalar_one_or_none()

    async def get_by_order_number(self, db: AsyncSession, order_number: str) -> Optional[Order]:
        result = await db.execute(
            select(Order).where(Order.order_number == order_number)
        )
        return result.scalar_one_or_none()

    async def get_by_payment_session(self, db: AsyncSession, session_id: str) -> Optional[Order]:
        result = await db.execute(
            select(Order).where(Order.payment_session_id == session_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(
        self, db: AsyncSession, user_id: str, skip: int = 0, limit: int = 20
    ):
        query = select(Order).where(Order.user_id == user_id)
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(Order.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 20):
        query = select(Order)
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(Order.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    async def generate_order_number(self, db: AsyncSession) -> str:
        result = await db.execute(select(func.count()).select_from(Order))
        count = result.scalar()
        return f"ORD-2026-{(count + 1):06d}"
