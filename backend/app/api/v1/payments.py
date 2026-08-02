from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.services.order_service import OrderService

router = APIRouter(prefix="/payments", tags=["Payments"])


async def _handle_webhook(
    db: AsyncSession,
    provider: str,
    body: dict,
) -> Response:
    """Generic webhook handler: parse session/order id and mark order paid."""
    session_id = (
        body.get("data", {}).get("object", {}).get("id")
        if isinstance(body.get("data"), dict)
        else body.get("id")
    )
    if not session_id:
        session_id = body.get("session_id") or body.get("order_id")

    if not session_id:
        return Response(content='{"received": true}', media_type="application/json")

    service = OrderService()
    order = await service.order_repo.get_by_payment_session(db, str(session_id))
    if not order:
        return Response(content='{"received": true}', media_type="application/json")

    await service.mark_paid(db, str(order.id), provider_name=provider)
    return Response(content='{"received": true}', media_type="application/json")


@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await _handle_webhook(db, "stripe", body)


@router.post("/paypal/webhook")
async def paypal_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await _handle_webhook(db, "paypal", body)


@router.post("/razorpay/webhook")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await _handle_webhook(db, "razorpay", body)
