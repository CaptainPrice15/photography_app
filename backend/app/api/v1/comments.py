from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse, CommentListResponse
from app.schemas.common import MessageResponse
from app.services.comment_service import CommentService

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.get("/{photo_id}", response_model=CommentListResponse)
async def list_comments(
    photo_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = CommentService()
    items, total = await service.get_photo_comments(db, photo_id, page=page, limit=limit)
    return CommentListResponse(
        items=[CommentResponse.model_validate(c) for c in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.post("/{photo_id}", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    photo_id: str,
    data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CommentService()
    comment = await service.create(db, str(current_user.id), photo_id, data)
    return CommentResponse.model_validate(comment)


@router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: str,
    data: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CommentService()
    comment = await service.update(db, comment_id, data)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return CommentResponse.model_validate(comment)


@router.delete("/{comment_id}", response_model=MessageResponse)
async def delete_comment(
    comment_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CommentService()
    deleted = await service.delete(db, comment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Comment not found")
    return MessageResponse(detail="Comment deleted successfully")
