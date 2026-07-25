from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, ChangePasswordRequest
from app.schemas.common import MessageResponse
from app.services.user_service import UserService
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        avatar_url=current_user.avatar_url,
        bio=current_user.bio,
        role=current_user.role,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at.isoformat(),
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = UserService()
    updated_user = await service.update_profile(db, str(current_user.id), data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return service.user_to_response(updated_user)


@router.put("/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    service = UserService()
    await service.update_profile(
        db, str(current_user.id), UserUpdate()
    )
    # Update password separately
    from app.repositories.user_repo import UserRepository
    user_repo = UserRepository()
    await user_repo.update(
        db, current_user.id, hashed_password=hash_password(data.new_password)
    )
    return MessageResponse(detail="Password changed successfully")


@router.get("/{user_id}", response_model=UserResponse)
async def get_public_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = UserService()
    user = await service.get_public_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return service.user_to_response(user)
