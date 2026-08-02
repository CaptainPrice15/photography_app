from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderItem
from app.models.photo import Photo
from app.models.user import User


async def has_entitlement(
    db: AsyncSession,
    user: Optional[User],
    photo: Photo,
) -> bool:
    """Admin, free photos, and paid orders grant entitlement."""
    if user is None:
        return bool(photo.is_free)
    if user.role == "admin":
        return True
    if photo.is_free:
        return True
    result = await db.execute(
        select(OrderItem.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(
            Order.user_id == user.id,
            Order.status == "paid",
            OrderItem.photo_id == photo.id,
        )
    )
    return result.scalar_one_or_none() is not None


async def get_entitlement(
    db: AsyncSession,
    user: Optional[User],
    photo: Photo,
) -> dict:
    return {
        "photo_id": str(photo.id),
        "is_free": bool(photo.is_free),
        "is_admin": bool(user and user.role == "admin"),
        "purchased": await has_entitlement(db, user, photo),
    }
