from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.download import DownloadRequest, DownloadResponse, DownloadTokenVerify
from app.services.download_service import DownloadService

router = APIRouter(prefix="/downloads", tags=["Downloads"])


@router.post("", response_model=DownloadResponse, status_code=201)
async def create_download(
    data: DownloadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DownloadService()
    try:
        result = await service.create_download_token(
            db, current_user, data.photo_id
        )
        return DownloadResponse(**result)
    except ValueError as e:
        if str(e) == "Payment required":
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/verify/{token}")
async def verify_download_token(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    service = DownloadService()
    result = await service.verify_token(db, token)
    if not result.valid:
        return DownloadTokenVerify(valid=False)

    safe_name = "".join(c for c in result.photo_title if c.isalnum() or c in "._- ") or "photo"
    return Response(
        content=result.original_bytes,
        media_type=result.content_type or "application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{safe_name}.jpg"'},
    )
