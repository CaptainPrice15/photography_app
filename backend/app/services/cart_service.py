from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.cart_repo import CartRepository
from app.repositories.photo_repo import PhotoRepository
from app.models.cart import Cart
from app.schemas.cart import CartItemAdd


class CartService:
    def __init__(self):
        self.cart_repo = CartRepository()
        self.photo_repo = PhotoRepository()

    async def get_cart(self, db: AsyncSession, user_id: str) -> Cart:
        return await self.cart_repo.get_or_create(db, user_id)

    async def add_item(
        self, db: AsyncSession, user_id: str, data: CartItemAdd
    ) -> dict:
        cart = await self.cart_repo.get_or_create(db, user_id)

        photo = await self.photo_repo.get(db, data.photo_id)
        if not photo:
            raise ValueError("Photo not found")
        if not photo.is_free and not photo.price:
            raise ValueError("Photo is not available for purchase")

        item = await self.cart_repo.add_item(db, cart.id, data.photo_id)
        if not item:
            raise ValueError("Photo already in cart")

        return {"message": "Item added to cart"}

    async def remove_item(
        self, db: AsyncSession, user_id: str, photo_id: str
    ) -> dict:
        cart = await self.cart_repo.get_or_create(db, user_id)
        removed = await self.cart_repo.remove_item(db, cart.id, photo_id)
        if not removed:
            raise ValueError("Item not found in cart")
        return {"message": "Item removed from cart"}

    async def clear_cart(self, db: AsyncSession, user_id: str) -> dict:
        cart = await self.cart_repo.get_or_create(db, user_id)
        await self.cart_repo.clear(db, cart.id)
        return {"message": "Cart cleared"}
