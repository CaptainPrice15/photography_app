from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: Union[UUID, str]
    order_id: Union[UUID, str]
    photo_id: Union[UUID, str]
    photo_title: str
    price: float
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    payment_provider: str  # stripe, paypal, razorpay, mock
    billing_name: Optional[str] = None
    billing_email: Optional[str] = None
    photo_ids: Optional[List[Union[UUID, str]]] = None


class OrderResponse(BaseModel):
    id: Union[UUID, str]
    order_number: str
    user_id: Union[UUID, str]
    status: str
    total_amount: float
    currency: str
    payment_provider: str
    payment_session_id: Optional[str] = None
    payment_id: Optional[str] = None
    payment_status: Optional[str] = None
    billing_name: Optional[str] = None
    billing_email: Optional[str] = None
    paid_at: Optional[Union[datetime, str]] = None
    items: List[OrderItemResponse]
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int
    pages: int
