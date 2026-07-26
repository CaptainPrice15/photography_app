import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()

    async def get_by_verification_token(self, db: AsyncSession, token: str) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.verification_token == token)
        )
        return result.scalar_one_or_none()

    async def get_by_reset_token(self, db: AsyncSession, token: str) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.reset_password_token == token)
        )
        return result.scalar_one_or_none()

    async def email_exists(self, db: AsyncSession, email: str) -> bool:
        result = await db.execute(
            select(func.count()).where(User.email == email)
        )
        return result.scalar() > 0

    async def username_exists(self, db: AsyncSession, username: str) -> bool:
        result = await db.execute(
            select(func.count()).where(User.username == username)
        )
        return result.scalar() > 0


from sqlalchemy import func
