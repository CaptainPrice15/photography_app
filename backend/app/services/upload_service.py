from typing import Optional
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.image_processor import ImageProcessor


class UploadService:
    def __init__(self):
        self.processor = ImageProcessor()

    async def upload_photo(
        self,
        db: AsyncSession,
        file: UploadFile,
        title: str,
        description: Optional[str] = None,
        category_id: Optional[str] = None,
        tags: list[str] = [],
        price: Optional[float] = None,
        is_free: bool = False,
        is_published: bool = True,
        uploaded_by: str = "",
    ) -> dict:
        file_bytes = await file.read()

        max_size = 50 * 1024 * 1024  # 50MB
        if len(file_bytes) > max_size:
            raise ValueError("File size exceeds 50MB limit")

        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise ValueError(f"Unsupported file type: {file.content_type}")

        return await self.processor.process_upload(
            db,
            file_bytes=file_bytes,
            filename=file.filename or "upload.jpg",
            title=title,
            description=description,
            category_id=category_id,
            tags=tags,
            price=price,
            is_free=is_free,
            is_published=is_published,
            uploaded_by=uploaded_by,
        )

    async def upload_multiple(
        self,
        db: AsyncSession,
        files: list[UploadFile],
        title_prefix: str = "Photo",
        description: Optional[str] = None,
        category_id: Optional[str] = None,
        tags: list[str] = [],
        price: Optional[float] = None,
        is_free: bool = False,
        is_published: bool = True,
        uploaded_by: str = "",
    ) -> list[dict]:
        results = []
        for i, file in enumerate(files):
            title = f"{title_prefix} {i + 1}"
            result = await self.upload_photo(
                db,
                file=file,
                title=title,
                description=description,
                category_id=category_id,
                tags=tags,
                price=price,
                is_free=is_free,
                is_published=is_published,
                uploaded_by=uploaded_by,
            )
            results.append(result)
        return results
