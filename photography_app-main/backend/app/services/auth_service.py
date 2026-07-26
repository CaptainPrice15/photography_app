import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.repositories.user_repo import UserRepository
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserResponse


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def register(
        self, db: AsyncSession, data: RegisterRequest
    ) -> AuthResponse:
        # Check if email exists
        existing_user = await self.user_repo.get_by_email(db, data.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Check if username exists
        existing_username = await self.user_repo.get_by_username(db, data.username)
        if existing_username:
            raise ValueError("Username already taken")

        # Create user
        hashed_password = hash_password(data.password)
        verification_token = str(uuid.uuid4())

        user = await self.user_repo.create(
            db,
            email=data.email,
            username=data.username,
            hashed_password=hashed_password,
            full_name=data.full_name,
            verification_token=verification_token,
            role="visitor",
        )

        # Generate tokens
        access_token = create_access_token(str(user.id), user.role)
        refresh_token = create_refresh_token(str(user.id))

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=self._user_to_response(user),
        )

    async def login(
        self, db: AsyncSession, data: LoginRequest
    ) -> AuthResponse:
        user = await self.user_repo.get_by_email(db, data.email)
        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(data.password, user.hashed_password):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("Account is deactivated")

        # Update last login
        await self.user_repo.update(
            db, user.id, last_login=datetime.now(timezone.utc)
        )

        # Generate tokens
        access_token = create_access_token(str(user.id), user.role)
        refresh_token = create_refresh_token(str(user.id))

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=self._user_to_response(user),
        )

    async def refresh_token(
        self, db: AsyncSession, refresh_token: str
    ) -> dict:
        payload = verify_token(refresh_token)
        if not payload:
            raise ValueError("Invalid refresh token")

        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")

        user_id = payload.get("sub")
        user = await self.user_repo.get(db, id=user_id)
        if not user:
            raise ValueError("User not found")

        if not user.is_active:
            raise ValueError("Account is deactivated")

        new_access_token = create_access_token(str(user.id), user.role)
        new_refresh_token = create_refresh_token(str(user.id))

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    async def get_current_user(
        self, db: AsyncSession, user_id: str
    ) -> Optional[User]:
        return await self.user_repo.get(db, id=user_id)

    def _user_to_response(self, user: User) -> UserResponse:
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
