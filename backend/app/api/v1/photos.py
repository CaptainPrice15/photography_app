from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.photo import PhotoCreate, PhotoUpdate, PhotoResponse, PhotoListResponse
from app.schemas.common import MessageResponse
from app.services.photo_service import PhotoService
from app.services.favourite_service import FavouriteService

router = APIRouter(prefix="/photos", tags=["Photos"])


@router.get("", response_model=PhotoListResponse)
async def list_photos(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None, alias="category"),
    location: Optional[str] = Query(None),
    camera: Optional[str] = Query(None),
    lens: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    items, total = await service.get_photos(
        db,
        search=search,
        category_id=category,
        location=location,
        camera=camera,
        lens=lens,
        year=year,
        sort=sort,
        page=page,
        limit=limit,
    )
    return PhotoListResponse(
        items=[PhotoResponse.model_validate(p) for p in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.get("/featured", response_model=list[PhotoResponse])
async def get_featured_photos(
    limit: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    items = await service.get_featured(db, limit)
    return [PhotoResponse.model_validate(p) for p in items]


@router.get("/latest", response_model=list[PhotoResponse])
async def get_latest_photos(
    limit: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    items = await service.get_latest(db, limit)
    return [PhotoResponse.model_validate(p) for p in items]


@router.get("/popular", response_model=list[PhotoResponse])
async def get_popular_photos(
    limit: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    items = await service.get_popular(db, limit)
    return [PhotoResponse.model_validate(p) for p in items]


@router.get("/{photo_id}", response_model=PhotoResponse)
async def get_photo(
    photo_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    photo = await service.get_by_id(db, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    await service.increment_view_count(db, photo_id)
    return PhotoResponse.model_validate(photo)


@router.get("/{photo_id}/related", response_model=list[PhotoResponse])
async def get_related_photos(
    photo_id: str,
    limit: int = Query(6, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    service = PhotoService()
    items = await service.get_related(db, photo_id, limit)
    return [PhotoResponse.model_validate(p) for p in items]


@router.post("", response_model=PhotoResponse, status_code=status.HTTP_201_CREATED)
async def create_photo(
    data: PhotoCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = PhotoService()
    try:
        photo = await service.create(db, data)
        return PhotoResponse.model_validate(photo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{photo_id}", response_model=PhotoResponse)
async def update_photo(
    photo_id: str,
    data: PhotoUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = PhotoService()
    try:
        photo = await service.update(db, photo_id, data)
        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")
        return PhotoResponse.model_validate(photo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{photo_id}", response_model=MessageResponse)
async def delete_photo(
    photo_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = PhotoService()
    deleted = await service.delete(db, photo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Photo not found")
    return MessageResponse(detail="Photo deleted successfully")
