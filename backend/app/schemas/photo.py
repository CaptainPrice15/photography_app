from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel


class PhotoCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    original_file_id: str
    thumbnail_file_id: Optional[str] = None
    original_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    width: int
    height: int
    file_size: int
    format: str
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[int] = None
    taken_at: Optional[datetime] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price: Optional[float] = None
    is_free: bool = False
    is_featured: bool = False
    is_published: bool = True
    tags: List[str] = []
    has_watermark: bool = True
    category_id: Optional[str] = None


class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    original_file_id: Optional[str] = None
    thumbnail_file_id: Optional[str] = None
    original_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None
    format: Optional[str] = None
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[int] = None
    taken_at: Optional[datetime] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price: Optional[float] = None
    is_free: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    tags: Optional[List[str]] = None
    has_watermark: Optional[bool] = None
    category_id: Optional[str] = None


class PhotoResponse(BaseModel):
    id: Union[UUID, str]
    title: str
    slug: str
    description: Optional[str] = None
    original_file_id: str
    thumbnail_file_id: Optional[str] = None
    original_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    width: int
    height: int
    file_size: int
    format: str
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[int] = None
    taken_at: Optional[Union[datetime, str]] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price: Optional[float] = None
    is_free: bool
    is_featured: bool
    is_published: bool
    view_count: int
    download_count: int
    tags: List[str]
    has_watermark: bool
    category_id: Optional[Union[UUID, str]] = None
    uploaded_by: Union[UUID, str]
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class PhotoListResponse(BaseModel):
    items: List[PhotoResponse]
    total: int
    page: int
    limit: int
    pages: int
