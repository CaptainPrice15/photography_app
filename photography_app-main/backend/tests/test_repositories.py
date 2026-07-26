import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.repositories.base import BaseRepository
from app.models.base import Base
from app.core.security import hash_password


@pytest_asyncio.fixture
async def user_repo() -> UserRepository:
    return UserRepository()


@pytest_asyncio.fixture
async def created_user(db: AsyncSession, user_repo: UserRepository) -> User:
    user = await user_repo.create(
        db,
        email="repo@example.com",
        username="repouser",
        hashed_password=hash_password("password123"),
        full_name="Repo User",
        role="visitor",
        is_verified=True,
        is_active=True,
    )
    return user


class TestUserRepository:
    async def test_create_user(self, db: AsyncSession, user_repo: UserRepository):
        user = await user_repo.create(
            db,
            email="new@example.com",
            username="newuser",
            hashed_password=hash_password("test123"),
            full_name="New User",
        )
        assert user.id is not None
        assert user.email == "new@example.com"
        assert user.username == "newuser"

    async def test_get_by_email(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        found = await user_repo.get_by_email(db, created_user.email)
        assert found is not None
        assert found.id == created_user.id

    async def test_get_by_email_not_found(self, db: AsyncSession, user_repo: UserRepository):
        found = await user_repo.get_by_email(db, "nonexistent@example.com")
        assert found is None

    async def test_get_by_username(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        found = await user_repo.get_by_username(db, created_user.username)
        assert found is not None
        assert found.id == created_user.id

    async def test_get_by_username_not_found(self, db: AsyncSession, user_repo: UserRepository):
        found = await user_repo.get_by_username(db, "nonexistentuser")
        assert found is None

    async def test_email_exists(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        assert await user_repo.email_exists(db, created_user.email) is True
        assert await user_repo.email_exists(db, "other@example.com") is False

    async def test_username_exists(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        assert await user_repo.username_exists(db, created_user.username) is True
        assert await user_repo.username_exists(db, "otheruser") is False

    async def test_update_user(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        updated = await user_repo.update(db, created_user.id, full_name="Updated Name")
        assert updated is not None
        assert updated.full_name == "Updated Name"

    async def test_delete_user(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        deleted = await user_repo.delete(db, created_user.id)
        assert deleted is True
        found = await user_repo.get(db, created_user.id)
        assert found is None

    async def test_get_multi(self, db: AsyncSession, user_repo: UserRepository, created_user: User):
        items, total = await user_repo.get_multi(db)
        assert total >= 1
        assert any(u.id == created_user.id for u in items)
