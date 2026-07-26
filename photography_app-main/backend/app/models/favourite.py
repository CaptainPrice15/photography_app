import uuid
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Favourite(Base, TimestampMixin):
    __tablename__ = "favourites"
    __table_args__ = (UniqueConstraint("user_id", "photo_id", name="uq_favourite_user_photo"),)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    photo_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("photos.id"), nullable=False
    )

    user = relationship("User", back_populates="favourites")
    photo = relationship("Photo", back_populates="favourites")
