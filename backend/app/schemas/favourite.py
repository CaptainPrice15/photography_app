from typing import List
from pydantic import BaseModel


class FavouriteRequest(BaseModel):
    photo_id: str


class FavouriteResponse(BaseModel):
    id: str
    user_id: str
    photo_id: str
    created_at: str

    model_config = {"from_attributes": True}


class FavouriteListResponse(BaseModel):
    items: List[FavouriteResponse]
    total: int
    page: int
    limit: int
    pages: int
