from datetime import datetime
from typing import List, Union
from uuid import UUID
from pydantic import BaseModel


class FavouriteRequest(BaseModel):
    photo_id: Union[UUID, str]


class FavouriteResponse(BaseModel):
    id: Union[UUID, str]
    user_id: Union[UUID, str]
    photo_id: Union[UUID, str]
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class FavouriteListResponse(BaseModel):
    items: List[FavouriteResponse]
    total: int
    page: int
    limit: int
    pages: int
