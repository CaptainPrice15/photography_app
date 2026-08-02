from datetime import datetime
from typing import Optional, List, Union
from uuid import UUID
from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    is_approved: Optional[bool] = None


class CommentResponse(BaseModel):
    id: Union[UUID, str]
    user_id: Union[UUID, str]
    photo_id: Union[UUID, str]
    content: str
    is_approved: bool
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]

    model_config = {"from_attributes": True}


class CommentListResponse(BaseModel):
    items: List[CommentResponse]
    total: int
    page: int
    limit: int
    pages: int
