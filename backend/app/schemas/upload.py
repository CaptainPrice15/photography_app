from typing import Optional, List
from pydantic import BaseModel


class UploadRequest(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    tags: List[str] = []
    price: Optional[float] = None
    is_free: bool = False
    is_published: bool = True


class UploadResponse(BaseModel):
    id: str
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
    created_at: str

    model_config = {"from_attributes": True}
