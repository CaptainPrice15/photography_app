from datetime import date
from typing import Optional, List
from pydantic import BaseModel


class ExhibitionCreate(BaseModel):
    title: str
    slug: str
    description: str
    long_description: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    cover_image_url: Optional[str] = None
    cover_image_file_id: Optional[str] = None
    is_virtual: bool = False
    exhibition_url: Optional[str] = None
    is_published: bool = True


class ExhibitionUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    cover_image_url: Optional[str] = None
    cover_image_file_id: Optional[str] = None
    is_virtual: Optional[bool] = None
    exhibition_url: Optional[str] = None
    is_published: Optional[bool] = None


class ExhibitionResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    long_description: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    cover_image_url: Optional[str] = None
    cover_image_file_id: Optional[str] = None
    is_virtual: bool
    exhibition_url: Optional[str] = None
    is_published: bool
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class ExhibitionListResponse(BaseModel):
    items: List[ExhibitionResponse]
    total: int
    page: int
    limit: int
    pages: int


class ExhibitionPhotoRequest(BaseModel):
    photo_id: str
    sort_order: int = 0
