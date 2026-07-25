from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    photo_id: str
    photo_title: str
    price: float
    created_at: str

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    payment_provider: str  # stripe, paypal, razorpay
    billing_name: Optional[str] = None
    billing_email: Optional[str] = None


class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    status: str
    total_amount: float
    currency: str
    payment_provider: str
    payment_session_id: Optional[str] = None
    payment_id: Optional[str] = None
    payment_status: Optional[str] = None
    billing_name: Optional[str] = None
    billing_email: Optional[str] = None
    paid_at: Optional[datetime] = None
    items: List[OrderItemResponse]
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int
    pages: int
