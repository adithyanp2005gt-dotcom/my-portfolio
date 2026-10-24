"""FastAPI router endpoint controllers for contact message inbox.

This module maps HTTP requests to send contact requests (public) and manage messages
records states like read/unread, stars, archives, and deletes (protected).
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlmodel import select, func

from app.core.dependencies import get_current_user, get_uow
from app.core.pagination import PageParams, PageResponse
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.messages.models import ContactMessage
from app.domains.messages.schemas import MessageCreate, MessageResponse
from app.domains.messages.service import MessageService
from app.domains.messages.repository import MessageRepository

router = APIRouter(prefix="/messages", tags=["Contact Messages"])


@router.post(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Submit contact form request",
    description="Registers a contact message from the portfolio form. (Public endpoint)."
)
async def submit_message(
    payload: MessageCreate,
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Submits a message transaction."""
    async with uow:
        service = MessageService(uow)
        created = await service.receive_message(payload)
        return success_response(MessageResponse.model_validate(created).model_dump())


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Paginate message inbox entries",
    description="Retrieves a list of inbox messages, supporting filters. (Requires authentication)."
)
async def list_messages(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Retrieves paginated messages registry."""
    params = PageParams(page=page, size=size, sort=sort, order=order, search=search)
    
    query = select(ContactMessage).where(ContactMessage.is_deleted == False)
    if params.search:
        query = query.where(
            ContactMessage.sender_name.ilike(f"%{params.search}%")
            | ContactMessage.email.ilike(f"%{params.search}%")
            | ContactMessage.message.ilike(f"%{params.search}%")
        )

    total = uow.session.exec(select(func.count()).select_from(query.subquery())).one()
    
    sort_attr = getattr(ContactMessage, params.sort, ContactMessage.created_at)
    if params.order.lower() == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

    items = list(uow.session.exec(query.offset(params.offset).limit(params.size)).all())
    dtos = [MessageResponse.model_validate(m).model_dump() for m in items]

    return success_response({
        "items": dtos,
        "page": params.page,
        "size": params.size,
        "total": total
    })


@router.post(
    "/{message_id}/read",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Mark message as read",
    description="Updates message status read state. (Requires authentication)."
)
async def mark_message_read(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Updates read state status."""
    async with uow:
        service = MessageService(uow)
        updated = await service.mark_read(message_id)
        return success_response(MessageResponse.model_validate(updated).model_dump())


@router.post(
    "/{message_id}/unread",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Mark message as unread",
    description="Updates message status unread state. (Requires authentication)."
)
async def mark_message_unread(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Updates unread state status."""
    async with uow:
        service = MessageService(uow)
        updated = await service.mark_unread(message_id)
        return success_response(MessageResponse.model_validate(updated).model_dump())


@router.post(
    "/{message_id}/star",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Toggle star message flag",
    description="Toggles starred flag indicator. (Requires authentication)."
)
async def star_message(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Toggles star state status."""
    async with uow:
        service = MessageService(uow)
        updated = await service.toggle_star(message_id)
        return success_response(MessageResponse.model_validate(updated).model_dump())


@router.post(
    "/{message_id}/archive",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Archive message entry",
    description="Updates archived status state. (Requires authentication)."
)
async def archive_message(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Sets archived state status."""
    async with uow:
        service = MessageService(uow)
        updated = await service.archive_message(message_id)
        return success_response(MessageResponse.model_validate(updated).model_dump())


@router.delete(
    "/{message_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Soft delete message",
    description="Soft deletes a contact message entry. (Requires authentication)."
)
async def delete_message(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Soft deletes message logs."""
    async with uow:
        service = MessageService(uow)
        await service.delete_message(message_id, user_id=current_user.id)
        return success_response({"message": f"Message '{message_id}' deleted successfully."})
