from typing import List
from pydantic import BaseModel


class CartItemAdd(BaseModel):
    photo_id: str


class CartItemResponse(BaseModel):
    id: str
    cart_id: str
    photo_id: str
    created_at: str

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    id: str
    user_id: str
    items: List[CartItemResponse]
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
