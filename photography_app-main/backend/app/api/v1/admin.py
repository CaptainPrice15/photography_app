from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.common import MessageResponse
from app.services.user_service import UserService
from app.repositories.user_repo import UserRepository

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user_repo = UserRepository()
    items, total = await user_repo.get_multi(db, skip=(page - 1) * limit, limit=limit)
    return [UserResponse.model_validate(u) for u in items]


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    role: str = Query(..., regex="^(admin|visitor)$"),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user_repo = UserRepository()
    user = await user_repo.update(db, user_id, role=role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


@router.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user_repo = UserRepository()
    deleted = await user_repo.delete(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return MessageResponse(detail="User deleted successfully")
