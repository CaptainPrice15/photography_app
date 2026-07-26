import uuid
from sqlalchemy import String, Text, Boolean, ForeignKey, Table, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

collection_photos = Table(
    "collection_photos",
    Base.metadata,
    Column("collection_id", UUID(as_uuid=True), ForeignKey("collections.id"), primary_key=True),
    Column("photo_id", UUID(as_uuid=True), ForeignKey("photos.id"), primary_key=True),
)


class Collection(Base, TimestampMixin):
    __tablename__ = "collections"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="collections")
    photos = relationship("Photo", secondary=collection_photos)
