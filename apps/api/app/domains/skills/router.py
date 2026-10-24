"""FastAPI router endpoint controllers for the skills vertical slice.

This module maps HTTP requests to fetch grouped skill listings (public)
and CRUD capability updates (protected).
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user, get_uow
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.skills.schemas import SkillCreate, SkillResponse, SkillUpdate
from app.domains.skills.service import SkillService
from app.domains.skills.repository import SkillRepository

router = APIRouter(prefix="/skills", tags=["Skills Registry"])


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List all skills registry",
    description="Loads a list of capability records, ordered by sort placement indexes."
)
async def list_skills(uow: UnitOfWork = Depends(get_uow)) -> dict:
    """Retrieves sorted skill listings."""
    repo = SkillRepository(uow.session)
    skills = repo.list_ordered()
    dtos = [SkillResponse.model_validate(s).model_dump() for s in skills]
    return success_response(dtos)


@router.post(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Register capability skill",
    description="Adds a new skill to the registry. (Requires authentication)."
)
async def create_skill(
    payload: SkillCreate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Creates a skill registry record."""
    async with uow:
        service = SkillService(uow)
        created = await service.create_skill(payload, creator_id=current_user.id)
        return success_response(SkillResponse.model_validate(created).model_dump())


@router.put(
    "/{skill_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Modify capability skill",
    description="Updates existing skill details. (Requires authentication)."
)
async def update_skill(
    skill_id: uuid.UUID,
    payload: SkillUpdate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Updates skill details."""
    async with uow:
        service = SkillService(uow)
        updated = await service.update_skill(skill_id, payload, updater_id=current_user.id)
        return success_response(SkillResponse.model_validate(updated).model_dump())


@router.delete(
    "/{skill_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Soft delete capability skill",
    description="Flags a skill as deleted in the database layer. (Requires authentication)."
)
async def delete_skill(
    skill_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Soft deletes skill logs."""
    async with uow:
        service = SkillService(uow)
        await service.delete_skill(skill_id, user_id=current_user.id)
        return success_response({"message": f"Skill '{skill_id}' deleted successfully."})
