from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: Union[UUID, str]
    user_id: Union[UUID, str]
    title: str
    message: str
    type: str
    is_read: bool
    link: Optional[str] = None
    created_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    page: int
    limit: int
    pages: int


class NotificationMarkRead(BaseModel):
    notification_ids: List[Union[UUID, str]]
