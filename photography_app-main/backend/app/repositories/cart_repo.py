from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cart import Cart, CartItem
from app.repositories.base import BaseRepository


class CartRepository(BaseRepository[Cart]):
    def __init__(self):
        super().__init__(Cart)

    async def get_by_user(self, db: AsyncSession, user_id: str) -> Optional[Cart]:
        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_or_create(self, db: AsyncSession, user_id: str) -> Cart:
        cart = await self.get_by_user(db, user_id)
        if not cart:
            cart = await self.create(db, user_id=user_id)
        return cart

    async def add_item(self, db: AsyncSession, cart_id: str, photo_id: str) -> Optional[CartItem]:
        existing = await db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart_id,
                CartItem.photo_id == photo_id,
            )
        )
        if existing.scalar_one_or_none():
            return None

        item = CartItem(cart_id=cart_id, photo_id=photo_id)
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item

    async def remove_item(self, db: AsyncSession, cart_id: str, photo_id: str) -> bool:
        result = await db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart_id,
                CartItem.photo_id == photo_id,
            )
        )
        item = result.scalar_one_or_none()
        if item:
            await db.delete(item)
            await db.commit()
            return True
        return False

    async def clear(self, db: AsyncSession, cart_id: str) -> None:
        result = await db.execute(
            select(CartItem).where(CartItem.cart_id == cart_id)
        )
        items = result.scalars().all()
        for item in items:
            await db.delete(item)
        await db.commit()
