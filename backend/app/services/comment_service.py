from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.comment_repo import CommentRepository
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


class CommentService:
    def __init__(self):
        self.repo = CommentRepository()

    async def get_photo_comments(
        self, db: AsyncSession, photo_id: str, page: int = 1, limit: int = 20
    ) -> tuple[list[Comment], int]:
        skip = (page - 1) * limit
        return await self.repo.get_by_photo(db, photo_id, skip=skip, limit=limit)

    async def create(
        self, db: AsyncSession, user_id: str, photo_id: str, data: CommentCreate
    ) -> Comment:
        return await self.repo.create(
            db,
            user_id=user_id,
            photo_id=photo_id,
            content=data.content,
        )

    async def update(
        self, db: AsyncSession, comment_id: str, data: CommentUpdate
    ) -> Optional[Comment]:
        update_data = data.model_dump(exclude_unset=True)
        return await self.repo.update(db, comment_id, **update_data)

    async def delete(self, db: AsyncSession, comment_id: str) -> bool:
        return await self.repo.delete(db, comment_id)
