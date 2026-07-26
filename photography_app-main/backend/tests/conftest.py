import uuid
import pytest
import pytest_asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator, Generator

from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import create_app
from app.models.base import Base
from app.api.deps import get_db
from app.core.security import hash_password, create_access_token
from app.models.user import User
from app.repositories.user_repo import UserRepository

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def app() -> FastAPI:
    return create_app()


@pytest_asyncio.fixture(scope="session")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestSessionLocal() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def db() -> AsyncGenerator[AsyncSession, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


def override_get_db():
    async def _override():
        async with TestSessionLocal() as session:
            try:
                yield session
            finally:
                await session.close()
    return _override


@pytest_asyncio.fixture(scope="function")
async def client(app: FastAPI, db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    app.dependency_overrides[get_db] = override_get_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def test_user(db: AsyncSession) -> User:
    repo = UserRepository()
    user = await repo.create(
        db,
        email="test@example.com",
        username="testuser",
        hashed_password=hash_password("testpassword123"),
        full_name="Test User",
        role="visitor",
        is_verified=True,
        is_active=True,
    )
    return user


@pytest_asyncio.fixture(scope="function")
async def test_admin(db: AsyncSession) -> User:
    repo = UserRepository()
    admin = await repo.create(
        db,
        email="admin@example.com",
        username="adminuser",
        hashed_password=hash_password("adminpassword123"),
        full_name="Admin User",
        role="admin",
        is_verified=True,
        is_active=True,
    )
    return admin


@pytest.fixture
def user_token(test_user: User) -> str:
    return create_access_token(str(test_user.id), test_user.role)


@pytest.fixture
def admin_token(test_admin: User) -> str:
    return create_access_token(str(test_admin.id), test_admin.role)


@pytest.fixture
def auth_headers(user_token: str) -> dict:
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}
