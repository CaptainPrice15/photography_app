from datetime import datetime
from typing import Optional, Union
from uuid import UUID
from pydantic import BaseModel


class DownloadRequest(BaseModel):
    photo_id: Union[UUID, str]


class DownloadResponse(BaseModel):
    id: Union[UUID, str]
    user_id: Union[UUID, str]
    photo_id: Union[UUID, str]
    order_id: Optional[Union[UUID, str]] = None
    download_token: str
    expires_at: Union[datetime, str]
    download_count: int
    max_downloads: int
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class DownloadTokenVerify(BaseModel):
    valid: bool
    photo_id: Optional[Union[UUID, str]] = None
    photo_title: Optional[str] = None
    original_url: Optional[str] = None
    expires_at: Optional[Union[datetime, str]] = None
    downloads_remaining: Optional[int] = None
