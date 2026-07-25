from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import UserRepository
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse


class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def get_profile(self, db: AsyncSession, user_id: str) -> Optional[User]:
        return await self.user_repo.get(db, id=user_id)

    async def update_profile(
        self, db: AsyncSession, user_id: str, data: UserUpdate
    ) -> Optional[User]:
        update_data = data.model_dump(exclude_unset=True)
        return await self.user_repo.update(db, id=user_id, **update_data)

    async def get_public_profile(self, db: AsyncSession, user_id: str) -> Optional[User]:
        user = await self.user_repo.get(db, id=user_id)
        if user and user.role == "admin":
            return user
        return None

    def user_to_response(self, user: User) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            role=user.role,
            is_verified=user.is_verified,
            created_at=user.created_at.isoformat(),
        )
