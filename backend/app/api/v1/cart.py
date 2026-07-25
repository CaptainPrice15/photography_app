from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartResponse
from app.schemas.common import MessageResponse
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CartService()
    cart = await service.get_cart(db, str(current_user.id))
    return CartResponse.model_validate(cart)


@router.post("/items", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    data: CartItemAdd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CartService()
    try:
        result = await service.add_item(db, str(current_user.id), data)
        return MessageResponse(detail=result["message"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/items/{photo_id}", response_model=MessageResponse)
async def remove_from_cart(
    photo_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CartService()
    try:
        result = await service.remove_item(db, str(current_user.id), photo_id)
        return MessageResponse(detail=result["message"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("", response_model=MessageResponse)
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = CartService()
    result = await service.clear_cart(db, str(current_user.id))
    return MessageResponse(detail=result["message"])
