import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Numeric, DateTime, Enum as SAEnum, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        SAEnum("pending", "paid", "failed", "refunded", "completed", name="order_status"),
        default="pending",
        nullable=False,
    )
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    payment_provider: Mapped[str] = mapped_column(
        SAEnum("stripe", "paypal", "razorpay", "mock", name="payment_provider"),
        nullable=False,
    )
    payment_session_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    payment_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    payment_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    billing_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    billing_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    downloads = relationship("Download", back_populates="order")


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"
    __table_args__ = (UniqueConstraint("order_id", "photo_id", name="uq_order_item_order_photo"),)

    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False
    )
    photo_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("photos.id"), nullable=False
    )
    photo_title: Mapped[str] = mapped_column(String(200), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    photo = relationship("Photo", back_populates="order_items")
