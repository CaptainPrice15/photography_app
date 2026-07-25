from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DownloadRequest(BaseModel):
    photo_id: str


class DownloadResponse(BaseModel):
    id: str
    user_id: str
    photo_id: str
    order_id: Optional[str] = None
    download_token: str
    expires_at: datetime
    download_count: int
    max_downloads: int
    created_at: str

    model_config = {"from_attributes": True}


class DownloadTokenVerify(BaseModel):
    valid: bool
    photo_id: Optional[str] = None
    photo_title: Optional[str] = None
    original_url: Optional[str] = None
    expires_at: Optional[datetime] = None
    downloads_remaining: Optional[int] = None
