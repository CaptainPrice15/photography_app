import pytest
from httpx import AsyncClient


class TestUsersProfile:
    async def test_get_profile_authenticated(self, client: AsyncClient, auth_headers):
        response = await client.get("/api/v1/users/profile", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["username"] == "testuser"

    async def test_get_profile_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/v1/users/profile")
        assert response.status_code == 401

    async def test_update_profile(self, client: AsyncClient, auth_headers):
        payload = {"full_name": "Updated Test User", "bio": "A test bio"}
        response = await client.put("/api/v1/users/profile", json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Updated Test User"
        assert data["bio"] == "A test bio"

    async def test_change_password(self, client: AsyncClient, auth_headers):
        payload = {
            "current_password": "testpassword123",
            "new_password": "newpassword123",
            "confirm_password": "newpassword123",
        }
        response = await client.put("/api/v1/users/change-password", json=payload, headers=auth_headers)
        assert response.status_code == 200

    async def test_change_password_wrong_current(self, client: AsyncClient, auth_headers):
        payload = {
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
            "confirm_password": "newpassword123",
        }
        response = await client.put("/api/v1/users/change-password", json=payload, headers=auth_headers)
        assert response.status_code == 400


class TestUsersPublic:
    async def test_get_public_profile(self, client: AsyncClient, test_user):
        response = await client.get(f"/api/v1/users/{test_user.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"

    async def test_get_public_profile_not_found(self, client: AsyncClient):
        response = await client.get("/api/v1/users/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
