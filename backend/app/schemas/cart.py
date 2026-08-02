from datetime import datetime
from typing import List, Union
from uuid import UUID
from pydantic import BaseModel


class CartItemAdd(BaseModel):
    photo_id: Union[UUID, str]


class CartItemResponse(BaseModel):
    id: Union[UUID, str]
    cart_id: Union[UUID, str]
    photo_id: Union[UUID, str]
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    id: Union[UUID, str]
    user_id: Union[UUID, str]
    items: List[CartItemResponse]
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}
