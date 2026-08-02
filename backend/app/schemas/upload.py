from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel


class UploadRequest(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[Union[UUID, str]] = None
    tags: List[str] = []
    price: Optional[float] = None
    is_free: bool = False
    is_published: bool = True


class UploadResponse(BaseModel):
    id: Union[UUID, str]
    title: str
    slug: str
    original_file_id: str
    thumbnail_file_id: Optional[str] = None
    original_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    width: int
    height: int
    file_size: int
    format: str
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}
