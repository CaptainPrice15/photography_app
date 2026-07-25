from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.download import Download
from app.repositories.base import BaseRepository


class DownloadRepository(BaseRepository[Download]):
    def __init__(self):
        super().__init__(Download)

    async def get_by_token(self, db: AsyncSession, token: str) -> Optional[Download]:
        result = await db.execute(
            select(Download).where(Download.download_token == token)
        )
        return result.scalar_one_or_none()

    async def get_by_user_and_photo(
        self, db: AsyncSession, user_id: str, photo_id: str
    ) -> Optional[Download]:
        result = await db.execute(
            select(Download).where(
                Download.user_id == user_id,
                Download.photo_id == photo_id,
            )
        )
        return result.scalar_one_or_none()
