"""FastAPI router endpoint controllers for the media vertical slice.

This module maps HTTP requests to upload static files, list logged media assets,
and delete media entries.
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlmodel import select, func

from app.core.dependencies import get_current_user, get_uow
from app.core.pagination import PageParams, PageResponse
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.media.models import Media
from app.domains.media.schemas import MediaResponse
from app.domains.media.service import MediaService
from app.domains.media.repository import MediaRepository

router = APIRouter(prefix="/media", tags=["Static Asset Library"])


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Paginate media assets list",
    description="Loads a paginated registry of upload media records, filtered by folder."
)
async def list_media(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    search: Optional[str] = Query(None),
    folder: Optional[str] = Query(None),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Retrieves paginated assets logs."""
    params = PageParams(page=page, size=size, sort=sort, order=order, search=search)
    
    # Custom pagination query for media folders ignoring soft-deleted entities
    query = select(Media).where(Media.is_deleted == False)
    if folder:
        query = query.where(Media.folder == folder)
        
    if params.search:
        query = query.where(
            Media.original_name.ilike(f"%{params.search}%")
            | Media.filename.ilike(f"%{params.search}%")
        )

    # Count matching records
    count_query = select(func.count()).select_from(query.subquery())
    total = uow.session.exec(count_query).one()

    # Sort logic
    sort_attr = getattr(Media, params.sort, Media.created_at)
    if params.order.lower() == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

    # Fetch offset results
    query = query.offset(params.offset).limit(params.size)
    items = list(uow.session.exec(query).all())
    dtos = [MediaResponse.model_validate(m).model_dump() for m in items]

    return success_response({
        "items": dtos,
        "page": params.page,
        "size": params.size,
        "total": total
    })


@router.post(
    "/upload",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Upload media asset file",
    description="Saves a static file on local storage, optimizing images to WebP. (Requires authentication)."
)
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    alt_text: Optional[str] = Form(None),
    caption: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Uploads and registers an asset file within a transactional Unit of Work."""
    async with uow:
        service = MediaService(uow)
        file_bytes = await file.read()
        media = await service.upload_file(
            file_bytes=file_bytes,
            filename=file.filename or "upload_file",
            folder=folder,
            alt_text=alt_text,
            caption=caption,
            creator_id=current_user.id
        )
        return success_response(MediaResponse.model_validate(media).model_dump())


@router.delete(
    "/{media_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Delete media asset",
    description="Soft deletes a media asset registry and deletes file on disk. (Requires authentication)."
)
async def delete_media(
    media_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Purges physical storage paths and database records."""
    async with uow:
        service = MediaService(uow)
        await service.delete_media(media_id, user_id=current_user.id)
        return success_response({"message": f"Media asset '{media_id}' purged successfully."})
