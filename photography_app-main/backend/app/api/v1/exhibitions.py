from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.exhibition import (
    ExhibitionCreate,
    ExhibitionUpdate,
    ExhibitionResponse,
    ExhibitionListResponse,
)
from app.schemas.common import MessageResponse
from app.services.exhibition_service import ExhibitionService

router = APIRouter(prefix="/exhibitions", tags=["Exhibitions"])


@router.get("", response_model=ExhibitionListResponse)
async def list_exhibitions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = ExhibitionService()
    items, total = await service.get_exhibitions(db, page=page, limit=limit)
    return ExhibitionListResponse(
        items=[ExhibitionResponse.model_validate(e) for e in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.get("/published", response_model=list[ExhibitionResponse])
async def get_published_exhibitions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = ExhibitionService()
    items = await service.get_published(db, page=page, limit=limit)
    return [ExhibitionResponse.model_validate(e) for e in items]


@router.get("/{exhibition_id}", response_model=ExhibitionResponse)
async def get_exhibition(
    exhibition_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = ExhibitionService()
    exhibition = await service.get_by_id(db, exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    return ExhibitionResponse.model_validate(exhibition)


@router.post("", response_model=ExhibitionResponse, status_code=status.HTTP_201_CREATED)
async def create_exhibition(
    data: ExhibitionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = ExhibitionService()
    try:
        exhibition = await service.create(db, data)
        return ExhibitionResponse.model_validate(exhibition)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{exhibition_id}", response_model=ExhibitionResponse)
async def update_exhibition(
    exhibition_id: str,
    data: ExhibitionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = ExhibitionService()
    try:
        exhibition = await service.update(db, exhibition_id, data)
        if not exhibition:
            raise HTTPException(status_code=404, detail="Exhibition not found")
        return ExhibitionResponse.model_validate(exhibition)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{exhibition_id}", response_model=MessageResponse)
async def delete_exhibition(
    exhibition_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = ExhibitionService()
    deleted = await service.delete(db, exhibition_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    return MessageResponse(detail="Exhibition deleted successfully")
