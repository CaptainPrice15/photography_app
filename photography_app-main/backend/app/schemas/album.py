from typing import Optional, List
from pydantic import BaseModel


class AlbumCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    cover_photo_id: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False
    sort_order: int = 0


class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_photo_id: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class AlbumResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    cover_photo_id: Optional[str] = None
    is_published: bool
    is_featured: bool
    sort_order: int
    photo_count: int
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class AlbumListResponse(BaseModel):
    items: List[AlbumResponse]
    total: int
    page: int
    limit: int
    pages: int


class AlbumPhotoRequest(BaseModel):
    photo_id: str
    sort_order: int = 0
