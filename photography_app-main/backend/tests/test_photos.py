import pytest
from httpx import AsyncClient

from app.core.security import hash_password
from app.repositories.photo_repo import PhotoRepository
from app.repositories.category_repo import CategoryRepository


class TestPhotosList:
    async def test_list_photos_empty(self, client: AsyncClient):
        response = await client.get("/api/v1/photos")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["items"] == []

    async def test_list_photos_with_pagination(self, client: AsyncClient):
        response = await client.get("/api/v1/photos?page=1&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "pages" in data

    async def test_list_photos_invalid_page(self, client: AsyncClient):
        response = await client.get("/api/v1/photos?page=0")
        assert response.status_code == 422

    async def test_list_photos_excessive_limit(self, client: AsyncClient):
        response = await client.get("/api/v1/photos?limit=200")
        assert response.status_code == 422


class TestPhotosFeatured:
    async def test_featured_photos(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/featured")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_featured_photos_with_limit(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/featured?limit=5")
        assert response.status_code == 200

    async def test_featured_photos_invalid_limit(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/featured?limit=100")
        assert response.status_code == 422


class TestPhotosLatest:
    async def test_latest_photos(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/latest")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestPhotosPopular:
    async def test_popular_photos(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/popular")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestPhotosCRUD:
    async def test_get_photo_not_found(self, client: AsyncClient):
        response = await client.get("/api/v1/photos/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404

    async def test_create_photo_requires_admin(self, client: AsyncClient, auth_headers):
        payload = {
            "title": "Test Photo",
            "description": "A test photo",
        }
        response = await client.post("/api/v1/photos", json=payload, headers=auth_headers)
        assert response.status_code == 403

    async def test_create_photo_as_admin(self, client: AsyncClient, admin_headers):
        payload = {
            "title": "Admin Photo",
            "description": "Created by admin",
        }
        response = await client.post("/api/v1/photos", json=payload, headers=admin_headers)
        assert response.status_code == 201

    async def test_delete_photo_requires_admin(self, client: AsyncClient, auth_headers):
        response = await client.delete(
            "/api/v1/photos/00000000-0000-0000-0000-000000000000",
            headers=auth_headers,
        )
        assert response.status_code == 403

    async def test_delete_photo_not_found(self, client: AsyncClient, admin_headers):
        response = await client.delete(
            "/api/v1/photos/00000000-0000-0000-0000-000000000000",
            headers=admin_headers,
        )
        assert response.status_code == 404
