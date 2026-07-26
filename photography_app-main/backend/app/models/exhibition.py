import uuid
from datetime import date, datetime
from sqlalchemy import String, Text, Boolean, Date, DateTime, ForeignKey, Table, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

exhibition_photos = Table(
    "exhibition_photos",
    Base.metadata,
    Column("exhibition_id", UUID(as_uuid=True), ForeignKey("exhibitions.id"), primary_key=True),
    Column("photo_id", UUID(as_uuid=True), ForeignKey("photos.id"), primary_key=True),
    Column("sort_order", nullable=False, default=0),
)


class Exhibition(Base, TimestampMixin):
    __tablename__ = "exhibitions"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    long_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    venue: Mapped[str | None] = mapped_column(String(200), nullable=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cover_image_file_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_virtual: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    exhibition_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    photos = relationship("Photo", secondary=exhibition_photos, back_populates="exhibitions")
