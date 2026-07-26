import pytest
from httpx import AsyncClient


class TestAuthRegister:
    async def test_register_success(self, client: AsyncClient):
        payload = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "strongpassword123",
            "full_name": "New User",
        }
        response = await client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["username"] == "newuser"

    async def test_register_duplicate_email(self, client: AsyncClient, test_user):
        payload = {
            "email": "test@example.com",
            "username": "anotheruser",
            "password": "strongpassword123",
            "full_name": "Another User",
        }
        response = await client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    async def test_register_duplicate_username(self, client: AsyncClient, test_user):
        payload = {
            "email": "another@example.com",
            "username": "testuser",
            "password": "strongpassword123",
            "full_name": "Another User",
        }
        response = await client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 400
        assert "already taken" in response.json()["detail"].lower()

    async def test_register_invalid_email(self, client: AsyncClient):
        payload = {
            "email": "not-an-email",
            "username": "validuser",
            "password": "strongpassword123",
            "full_name": "Valid User",
        }
        response = await client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 422


class TestAuthLogin:
    async def test_login_success(self, client: AsyncClient, test_user):
        payload = {
            "email": "test@example.com",
            "password": "testpassword123",
        }
        response = await client.post("/api/v1/auth/login", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "test@example.com"

    async def test_login_wrong_password(self, client: AsyncClient, test_user):
        payload = {
            "email": "test@example.com",
            "password": "wrongpassword",
        }
        response = await client.post("/api/v1/auth/login", json=payload)
        assert response.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        payload = {
            "email": "nobody@example.com",
            "password": "somepassword",
        }
        response = await client.post("/api/v1/auth/login", json=payload)
        assert response.status_code == 401


class TestAuthRefresh:
    async def test_refresh_success(self, client: AsyncClient, test_user, user_token):
        response = await client.post("/api/v1/auth/register", json={
            "email": "refresh_test@example.com",
            "username": "refreshtest",
            "password": "password123",
            "full_name": "Refresh Test",
        })
        assert response.status_code == 201
        data = response.json()
        refresh_token = data["refresh_token"]

        refresh_response = await client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token,
        })
        assert refresh_response.status_code == 200
        refresh_data = refresh_response.json()
        assert "access_token" in refresh_data
        assert "refresh_token" in refresh_data

    async def test_refresh_invalid_token(self, client: AsyncClient):
        response = await client.post("/api/v1/auth/refresh", json={
            "refresh_token": "invalid_refresh_token",
        })
        assert response.status_code == 401


class TestAuthMe:
    async def test_get_me_authenticated(self, client: AsyncClient, auth_headers):
        response = await client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["username"] == "testuser"

    async def test_get_me_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401

    async def test_get_me_invalid_token(self, client: AsyncClient):
        headers = {"Authorization": "Bearer invalid_token"}
        response = await client.get("/api/v1/auth/me", headers=headers)
        assert response.status_code == 401
