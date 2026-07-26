from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user, require_admin
from app.models.user import User
from app.schemas.upload import UploadRequest, UploadResponse
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_photo(
    data: UploadRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    # TODO: Implement file upload with pCloud
    # This endpoint will receive multipart form data
    # For now, return a placeholder
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="File upload not yet implemented"
    )


@router.post("/multiple", response_model=list[UploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_multiple_photos(
    data: list[UploadRequest],
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    # TODO: Implement multi-file upload with pCloud
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Multi-file upload not yet implemented"
    )
