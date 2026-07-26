import uuid
import io
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.storage.pcloud import PCloudStorage
from app.utils.exif import extract_exif
from app.utils.image import optimize_image, generate_thumbnail
from app.repositories.photo_repo import PhotoRepository


class ImageProcessor:
    def __init__(self):
        self.storage = PCloudStorage()
        self.photo_repo = PhotoRepository()

    async def process_upload(
        self,
        db: AsyncSession,
        file_bytes: bytes,
        filename: str,
        title: str,
        description: Optional[str] = None,
        category_id: Optional[str] = None,
        tags: list[str] = [],
        price: Optional[float] = None,
        is_free: bool = False,
        is_published: bool = True,
        uploaded_by: str = "",
    ) -> dict:
        exif = extract_exif(file_bytes)

        optimized_bytes, width, height, fmt = optimize_image(file_bytes)

        thumb_bytes, thumb_width, thumb_height = generate_thumbnail(file_bytes)

        slug = f"{title.lower().replace(' ', '-')}_{str(uuid.uuid4())[:8]}"

        original_metadata = await self.storage.upload_file(
            optimized_bytes,
            f"{slug}.{fmt}",
            folder_id=0,
        )
        original_file_id = str(original_metadata.get("fileid"))

        thumb_metadata = await self.storage.upload_file(
            thumb_bytes,
            f"{slug}_thumb.jpg",
            folder_id=0,
        )
        thumb_file_id = str(thumb_metadata.get("fileid"))

        original_url = await self.storage.get_file_link(int(original_file_id))
        thumb_url = await self.storage.get_thumb_link(int(thumb_file_id), 800, 600)

        from datetime import datetime
        taken_at = None
        if exif.taken_at:
            try:
                taken_at = datetime.strptime(exif.taken_at, "%Y:%m:%d %H:%M:%S")
            except ValueError:
                pass

        photo = await self.photo_repo.create(
            db,
            title=title,
            slug=slug,
            description=description,
            original_file_id=original_file_id,
            thumbnail_file_id=thumb_file_id,
            original_url=original_url,
            thumbnail_url=thumb_url,
            width=width,
            height=height,
            file_size=len(optimized_bytes),
            format=fmt,
            camera_make=exif.camera_make,
            camera_model=exif.camera_model,
            lens=exif.lens,
            focal_length=exif.focal_length,
            aperture=exif.aperture,
            shutter_speed=exif.shutter_speed,
            iso=exif.iso,
            taken_at=taken_at,
            latitude=exif.latitude,
            longitude=exif.longitude,
            price=price,
            is_free=is_free,
            is_published=is_published,
            tags=tags,
            category_id=category_id,
            uploaded_by=uploaded_by,
        )

        return {
            "id": str(photo.id),
            "title": photo.title,
            "slug": photo.slug,
            "original_file_id": original_file_id,
            "thumbnail_file_id": thumb_file_id,
            "original_url": original_url,
            "thumbnail_url": thumb_url,
            "width": width,
            "height": height,
            "created_at": photo.created_at.isoformat(),
        }

    async def delete_photo(self, db: AsyncSession, photo_id: str) -> bool:
        photo = await self.photo_repo.get(db, photo_id)
        if not photo:
            return False

        try:
            await self.storage.delete_file(int(photo.original_file_id))
        except Exception:
            pass

        try:
            if photo.thumbnail_file_id:
                await self.storage.delete_file(int(photo.thumbnail_file_id))
        except Exception:
            pass

        return await self.photo_repo.delete(db, photo_id)
