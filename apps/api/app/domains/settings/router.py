"""System settings router endpoint controllers.

This module maps HTTP requests to fetch and update dynamic site parameters
inside a unified JSON wrapper response.
"""

from fastapi import APIRouter, Depends, status
from app.core.dependencies import get_current_user, get_uow
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.settings.schemas import SettingsDto, SettingsUpdate
from app.domains.settings.service import SettingsService

router = APIRouter(prefix="/settings", tags=["Site Parameters"])


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Get site configurations",
    description="Loads current dynamic configurations (e.g. Hero strings, SEO descriptors)."
)
async def get_settings(uow: UnitOfWork = Depends(get_uow)) -> dict:
    """Retrieves site configurations."""
    service = SettingsService(uow)
    config = await service.get_site_config()
    return success_response(config.model_dump())


@router.put(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Modify site configurations",
    description="Updates database configuration fields. (Requires authentication)."
)
async def update_settings(
    payload: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Updates database configuration parameters."""
    async with uow:
        service = SettingsService(uow)
        config = await service.update_site_config(payload, updater_id=current_user.id)
        return success_response(config.model_dump())
