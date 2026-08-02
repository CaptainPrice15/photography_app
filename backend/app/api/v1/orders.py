from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService()
    if current_user.role == "admin":
        items, total = await service.get_all_orders(db, skip=(page - 1) * limit, limit=limit)
    else:
        items, total = await service.get_user_orders(
            db, str(current_user.id), page=page, limit=limit
        )
    return OrderListResponse(
        items=[OrderResponse.model_validate(o) for o in items],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService()
    try:
        result = await service.create_order(db, str(current_user.id), data)
        order = await service.get_by_id(db, result["order_id"])
        return OrderResponse.model_validate(order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = OrderService()
    order = await service.get_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if str(order.user_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return OrderResponse.model_validate(order)


@router.post("/{order_id}/mock-pay", response_model=OrderResponse)
async def mock_pay_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sandbox: mark an order as paid without a real payment provider."""
    service = OrderService()
    order = await service.get_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if str(order.user_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    order = await service.mark_paid(db, order_id, provider_name="mock")
    return OrderResponse.model_validate(order)
