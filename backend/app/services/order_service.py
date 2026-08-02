from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.repositories.order_repo import OrderRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.photo_repo import PhotoRepository
from app.models.order import Order
from app.schemas.order import OrderCreate
from app.payments import get_payment_provider


class OrderService:
    def __init__(self):
        self.order_repo = OrderRepository()
        self.cart_repo = CartRepository()
        self.photo_repo = PhotoRepository()

    async def create_order(
        self, db: AsyncSession, user_id: str, data: OrderCreate
    ) -> dict:
        if data.photo_ids:
            selected_photos = []
            for photo_id in data.photo_ids:
                photo = await self.photo_repo.get(db, photo_id)
                if photo and photo.price is not None:
                    selected_photos.append(photo)
            if not selected_photos:
                raise ValueError("No purchasable photos provided")
            cart_items = selected_photos
        else:
            cart = await self.cart_repo.get_by_user(db, user_id)
            if not cart or not cart.items:
                raise ValueError("Cart is empty")
            cart_items = []
            for cart_item in cart.items:
                photo = await self.photo_repo.get(db, cart_item.photo_id)
                if photo:
                    cart_items.append(photo)

        order_number = await self.order_repo.generate_order_number(db)

        total = 0.0
        items = []
        for photo in cart_items:
            total += float(photo.price or 0)
            items.append({
                "photo_id": str(photo.id),
                "photo_title": photo.title,
                "price": float(photo.price or 0),
            })

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

        for photo in cart_items:
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

        if not data.photo_ids:
            await self.cart_repo.clear(db, cart.id)

        provider = get_payment_provider(data.payment_provider)
        success_url = f"{settings.FRONTEND_URL}/checkout/success"
        cancel_url = f"{settings.FRONTEND_URL}/checkout/cancel"

        session = await provider.create_checkout_session(
            order_id=str(order.id),
            items=items,
            success_url=success_url,
            cancel_url=cancel_url,
        )

        await self.order_repo.update(
            db,
            order.id,
            payment_session_id=session.get("session_id"),
        )

        return {
            "order_id": str(order.id),
            "order_number": order.order_number,
            "session_id": session.get("session_id"),
            "session_url": session.get("session_url"),
        }

    async def get_by_id(self, db: AsyncSession, order_id: str) -> Optional[Order]:
        return await self.order_repo.get_with_items(db, order_id)

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

    async def mark_paid(
        self, db: AsyncSession, order_id: str, provider_name: str = "mock"
    ) -> Optional[Order]:
        """Set an order to paid — used by mock-pay and payment webhooks."""
        from datetime import datetime, timezone
        order = await self.order_repo.get(db, order_id)
        if not order:
            return None
        if order.status == "paid":
            return order
        return await self.order_repo.update(
            db,
            order.id,
            status="paid",
            paid_at=datetime.now(timezone.utc),
            payment_status="paid",
            payment_provider=provider_name,
        )

    async def handle_payment_success(
        self, db: AsyncSession, provider_name: str, session_id: str
    ) -> Optional[Order]:
        provider = get_payment_provider(provider_name)
        status = await provider.get_payment_status(session_id)

        order = await self.order_repo.get_by_payment_session(db, session_id)
        if not order:
            return None

        if status in ("paid", "COMPLETED"):
            from datetime import datetime, timezone
            order = await self.order_repo.update(
                db,
                order.id,
                status="paid",
                paid_at=datetime.now(timezone.utc),
                payment_status=status,
            )
        elif status in ("failed", "DECLINED", "EXPIRED"):
            order = await self.order_repo.update(
                db,
                order.id,
                status="failed",
                payment_status=status,
            )

        return order
