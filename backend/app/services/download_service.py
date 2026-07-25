from datetime import datetime, timedelta, timezone
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.download_repo import DownloadRepository
from app.repositories.photo_repo import PhotoRepository
from app.core.security import create_access_token
from app.schemas.download import DownloadTokenVerify


class DownloadService:
    def __init__(self):
        self.repo = DownloadRepository()
        self.photo_repo = PhotoRepository()

    async def create_download_token(
        self, db: AsyncSession, user_id: str, photo_id: str, order_id: str | None = None
    ) -> dict:
        photo = await self.photo_repo.get(db, photo_id)
        if not photo:
            raise ValueError("Photo not found")

        download_token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

        download = await self.repo.create(
            db,
            user_id=user_id,
            photo_id=photo_id,
            order_id=order_id,
            download_token=download_token,
            expires_at=expires_at,
            max_downloads=5,
        )

        return {
            "download_token": download_token,
            "expires_at": expires_at.isoformat(),
        }

    async def verify_token(
        self, db: AsyncSession, token: str
    ) -> DownloadTokenVerify:
        download = await self.repo.get_by_token(db, token)
        if not download:
            return DownloadTokenVerify(valid=False)

        if download.expires_at < datetime.now(timezone.utc):
            return DownloadTokenVerify(valid=False)

        if download.download_count >= download.max_downloads:
            return DownloadTokenVerify(valid=False)

        photo = await self.photo_repo.get(db, download.photo_id)
        if not photo:
            return DownloadTokenVerify(valid=False)

        download.download_count += 1
        await db.commit()

        await self.photo_repo.increment_download_count(db, photo.id)

        return DownloadTokenVerify(
            valid=True,
            photo_id=str(photo.id),
            photo_title=photo.title,
            original_url=photo.original_url,
            expires_at=download.expires_at,
            downloads_remaining=download.max_downloads - download.download_count,
        )
