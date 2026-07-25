from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.order_repo import OrderRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.photo_repo import PhotoRepository
from app.models.order import Order
from app.schemas.order import OrderCreate


class OrderService:
    def __init__(self):
        self.order_repo = OrderRepository()
        self.cart_repo = CartRepository()
        self.photo_repo = PhotoRepository()

    async def create_order(
        self, db: AsyncSession, user_id: str, data: OrderCreate
    ) -> Order:
        cart = await self.cart_repo.get_by_user(db, user_id)
        if not cart or not cart.items:
            raise ValueError("Cart is empty")

        order_number = await self.order_repo.generate_order_number(db)

        total = 0.0
        for cart_item in cart.items:
            photo = await self.photo_repo.get(db, cart_item.photo_id)
            if photo and photo.price:
                total += float(photo.price)

        order = await self.order_repo.create(
            db,
            order_number=order_number,
            user_id=user_id,
            status="pending",
            total_amount=total,
            currency="USD",
            payment_provider=data.payment_provider,
            billing_name=data.billing_name,
            billing_email=data.billing_email,
        )

        for cart_item in cart.items:
            photo = await self.photo_repo.get(db, cart_item.photo_id)
            if photo:
                from app.models.order import OrderItem
                item = OrderItem(
                    order_id=order.id,
                    photo_id=photo.id,
                    photo_title=photo.title,
                    price=photo.price or 0,
                )
                db.add(item)

        await db.commit()
        await db.refresh(order)

        await self.cart_repo.clear(db, cart.id)

        return order

    async def get_by_id(self, db: AsyncSession, order_id: str) -> Optional[Order]:
        return await self.order_repo.get(db, order_id)

    async def get_by_order_number(
        self, db: AsyncSession, order_number: str
    ) -> Optional[Order]:
        return await self.order_repo.get_by_order_number(db, order_number)

    async def get_user_orders(
        self, db: AsyncSession, user_id: str, page: int = 1, limit: int = 20
    ) -> tuple[list[Order], int]:
        skip = (page - 1) * limit
        return await self.order_repo.get_by_user(db, user_id, skip=skip, limit=limit)

    async def update_status(
        self, db: AsyncSession, order_id: str, status: str
    ) -> Optional[Order]:
        return await self.order_repo.update(db, order_id, status=status)
