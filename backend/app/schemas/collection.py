from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
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
    id: Union[UUID, str]
    name: str
    user_id: Union[UUID, str]
    description: Optional[str] = None
    is_public: bool
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class CollectionListResponse(BaseModel):
    items: List[CollectionResponse]
    total: int
    page: int
    limit: int
    pages: int


class CollectionPhotoRequest(BaseModel):
    photo_id: Union[UUID, str]
