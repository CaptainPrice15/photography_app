from typing import Optional, List
from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    is_approved: Optional[bool] = None


class CommentResponse(BaseModel):
    id: str
    user_id: str
    photo_id: str
    content: str
    is_approved: bool
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class CommentListResponse(BaseModel):
    items: List[CommentResponse]
    total: int
    page: int
    limit: int
    pages: int
