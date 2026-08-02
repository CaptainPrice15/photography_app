from datetime import datetime
from typing import Optional, Union
from uuid import UUID
from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None


class CategoryResponse(BaseModel):
    id: Union[UUID, str]
    name: str
    slug: str
    description: Optional[str] = None
    sort_order: int
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}
