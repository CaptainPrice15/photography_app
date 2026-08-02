from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.favourite import FavouriteRequest, FavouriteResponse, FavouriteListResponse
from app.schemas.common import MessageResponse
from app.services.favourite_service import FavouriteService

router = APIRouter(prefix="/favourites", tags=["Favourites"])


@router.get("", response_model=FavouriteListResponse)
async def list_favourites(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = FavouriteService()
    items, total = await service.repo.get_for_user(
        db, str(current_user.id), skip=(page - 1) * limit, limit=limit
    )
    return FavouriteListResponse(
        items=[FavouriteResponse.model_validate(f) for f in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.post("/toggle", response_model=MessageResponse)
async def toggle_favourite(
    data: FavouriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = FavouriteService()
    is_fav = await service.toggle_favourite(
        db, str(current_user.id), data.photo_id
    )
    message = "Added to favourites" if is_fav else "Removed from favourites"
    return MessageResponse(detail=message)


@router.get("/check/{photo_id}")
async def check_favourite(
    photo_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = FavouriteService()
    is_fav = await service.is_favourited(db, str(current_user.id), photo_id)
    return {"is_favourited": is_fav}
