"""FastAPI router endpoint controllers for education timeline records.

This module maps HTTP requests to fetch academic timeline registers (public)
and CRUD record updates (protected).
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user, get_uow
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.education.schemas import EducationCreate, EducationResponse, EducationUpdate
from app.domains.education.service import EducationService
from app.domains.education.repository import EducationRepository

router = APIRouter(prefix="/education", tags=["Academic Records"])


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List all education history",
    description="Loads a list of education history records, sorted by sort placement indexes."
)
async def list_education(uow: UnitOfWork = Depends(get_uow)) -> dict:
    """Retrieves sorted education history."""
    repo = EducationRepository(uow.session)
    education_list = repo.list_ordered()
    dtos = [EducationResponse.model_validate(e).model_dump() for e in education_list]
    return success_response(dtos)


@router.post(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Register education history entry",
    description="Adds a new academic timeline record. (Requires authentication)."
)
async def create_education(
    payload: EducationCreate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Creates an education history record."""
    async with uow:
        service = EducationService(uow)
        created = await service.create_education(payload, creator_id=current_user.id)
        return success_response(EducationResponse.model_validate(created).model_dump())


@router.put(
    "/{edu_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Modify education history entry",
    description="Updates existing academic record details. (Requires authentication)."
)
async def update_education(
    edu_id: uuid.UUID,
    payload: EducationUpdate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Updates education record details."""
    async with uow:
        service = EducationService(uow)
        updated = await service.update_education(edu_id, payload, updater_id=current_user.id)
        return success_response(EducationResponse.model_validate(updated).model_dump())


@router.delete(
    "/{edu_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Soft delete education entry",
    description="Flags an academic record as deleted in the database layer. (Requires authentication)."
)
async def delete_education(
    edu_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Soft deletes education timeline logs."""
    async with uow:
        service = EducationService(uow)
        await service.delete_education(edu_id, user_id=current_user.id)
        return success_response({"message": f"Education record '{edu_id}' deleted successfully."})
