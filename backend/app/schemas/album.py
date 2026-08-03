from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel, model_validator


class AlbumCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    cover_photo_id: Optional[Union[UUID, str]] = None
    is_published: bool = True
    is_featured: bool = False
    sort_order: int = 0


class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_photo_id: Optional[Union[UUID, str]] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class AlbumResponse(BaseModel):
    id: Union[UUID, str]
    title: str
    slug: str
    description: Optional[str] = None
    cover_photo_id: Optional[Union[UUID, str]] = None
    cover_photo_url: Optional[str] = None
    is_published: bool
    is_featured: bool
    sort_order: int
    photo_count: int
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def build_cover_url(self) -> "AlbumResponse":
        if self.cover_photo_id:
            self.cover_photo_url = f"/api/v1/photos/{self.cover_photo_id}/preview"
        return self


class AlbumListResponse(BaseModel):
    items: List[AlbumResponse]
    total: int
    page: int
    limit: int
    pages: int


class AlbumPhotoRequest(BaseModel):
    photo_id: Union[UUID, str]
    sort_order: int = 0

