import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    String, Text, Integer, BigInteger, Float, Boolean, Numeric,
    DateTime, ForeignKey, JSON
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Photo(Base, TimestampMixin):
    __tablename__ = "photos"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    original_file_id: Mapped[str] = mapped_column(String(100), nullable=False)
    thumbnail_file_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

    width: Mapped[int] = mapped_column(Integer, nullable=False)
    height: Mapped[int] = mapped_column(Integer, nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    format: Mapped[str] = mapped_column(String(10), nullable=False)

    camera_make: Mapped[str | None] = mapped_column(String(100), nullable=True)
    camera_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    lens: Mapped[str | None] = mapped_column(String(200), nullable=True)
    focal_length: Mapped[str | None] = mapped_column(String(50), nullable=True)
    aperture: Mapped[str | None] = mapped_column(String(20), nullable=True)
    shutter_speed: Mapped[str | None] = mapped_column(String(50), nullable=True)
    iso: Mapped[int | None] = mapped_column(Integer, nullable=True)
    taken_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    location_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    is_free: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    tags: Mapped[list[str]] = mapped_column(ARRAY(String).with_variant(JSON, "sqlite"), default=[], nullable=False)
    has_watermark: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True
    )
    uploaded_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    category = relationship("Category", back_populates="photos")
    photographer = relationship("User", backref="uploaded_photos")
    favourites = relationship("Favourite", back_populates="photo", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="photo", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="photo")
    albums = relationship("Album", secondary="album_photos", back_populates="photos")
    exhibitions = relationship("Exhibition", secondary="exhibition_photos", back_populates="photos")
