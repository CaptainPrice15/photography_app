from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.album import (
    AlbumCreate,
    AlbumUpdate,
    AlbumResponse,
    AlbumListResponse,
    AlbumPhotoRequest,
)
from app.schemas.common import MessageResponse
from app.schemas.photo import PhotoResponse
from app.services.album_service import AlbumService

router = APIRouter(prefix="/albums", tags=["Albums"])


@router.get("", response_model=AlbumListResponse)
async def list_albums(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = AlbumService()
    items, total = await service.get_albums(db, page=page, limit=limit)
    return AlbumListResponse(
        items=[AlbumResponse.model_validate(a) for a in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.get("/featured", response_model=list[AlbumResponse])
async def get_featured_albums(
    limit: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = AlbumService()
    items = await service.get_featured(db, limit)
    return [AlbumResponse.model_validate(a) for a in items]


@router.get("/{album_id}", response_model=AlbumResponse)
async def get_album(
    album_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = AlbumService()
    album = await service.get_by_id(db, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return AlbumResponse.model_validate(album)


@router.post("", response_model=AlbumResponse, status_code=status.HTTP_201_CREATED)
async def create_album(
    data: AlbumCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = AlbumService()
    try:
        album = await service.create(db, data)
        return AlbumResponse.model_validate(album)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{album_id}", response_model=AlbumResponse)
async def update_album(
    album_id: str,
    data: AlbumUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = AlbumService()
    try:
        album = await service.update(db, album_id, data)
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")
        return AlbumResponse.model_validate(album)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{album_id}", response_model=MessageResponse)
async def delete_album(
    album_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = AlbumService()
    deleted = await service.delete(db, album_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Album not found")
    return MessageResponse(detail="Album deleted successfully")


@router.get("/{album_id}/photos", response_model=list[PhotoResponse])
async def get_album_photos(
    album_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Photos belonging to an album, newest first."""
    service = AlbumService()
    photos = await service.repo.get_photos(db, album_id)
    return [PhotoResponse.model_validate(p) for p in photos]


@router.post("/{album_id}/photos", response_model=MessageResponse)
async def add_photo_to_album(
    album_id: str,
    data: AlbumPhotoRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = AlbumService()
    try:
        await service.add_photo(db, album_id, data.photo_id, data.sort_order)
        return MessageResponse(detail="Photo added to album")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{album_id}/photos/{photo_id}", response_model=MessageResponse)
async def remove_photo_from_album(
    album_id: str,
    photo_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = AlbumService()
    await service.remove_photo(db, album_id, photo_id)
    return MessageResponse(detail="Photo removed from album")
