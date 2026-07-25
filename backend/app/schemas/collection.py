from typing import Optional, List
from pydantic import BaseModel


class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = True


class CollectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


class CollectionResponse(BaseModel):
    id: str
    name: str
    user_id: str
    description: Optional[str] = None
    is_public: bool
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class CollectionListResponse(BaseModel):
    items: List[CollectionResponse]
    total: int
    page: int
    limit: int
    pages: int


class CollectionPhotoRequest(BaseModel):
    photo_id: str
