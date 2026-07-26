import uuid
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey, Table, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

album_photos = Table(
    "album_photos",
    Base.metadata,
    Column("album_id", UUID(as_uuid=True), ForeignKey("albums.id"), primary_key=True),
    Column("photo_id", UUID(as_uuid=True), ForeignKey("photos.id"), primary_key=True),
    Column("sort_order", Integer, default=0, nullable=False),
)


class Album(Base, TimestampMixin):
    __tablename__ = "albums"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_photo_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("photos.id"), nullable=True
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    photo_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    cover_photo = relationship("Photo", foreign_keys=[cover_photo_id])
    photos = relationship("Photo", secondary=album_photos, back_populates="albums")
