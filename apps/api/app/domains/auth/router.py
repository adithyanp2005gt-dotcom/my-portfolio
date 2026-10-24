"""Authentication router endpoint controllers for the auth slice.

This module maps HTTP requests to login routes, token rotation routes, and logout
routines, returning unified JSON response shapes.
"""

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.dependencies import get_current_user, get_uow
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.auth.schemas import LoginRequest, RefreshRequest, TokenResponse, UserResponse
from app.domains.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Validate credentials",
    description="Authenticates username or email with password, returning JWT access and refresh tokens."
)
async def login(
    payload: LoginRequest,
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Processes login credentials validations within a Unit of Work context."""
    async with uow:
        service = AuthService(uow)
        tokens: TokenResponse = await service.authenticate_user(payload)
        return success_response(tokens.model_dump())


@router.post(
    "/login-form",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Validate credentials via form",
    description="Authenticates user credentials using OAuth2 form parameters (for Swagger compatability)."
)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """OAuth2 compatible credentials check utilizing Form inputs."""
    async with uow:
        service = AuthService(uow)
        payload = LoginRequest(username=form_data.username, password=form_data.password)
        tokens: TokenResponse = await service.authenticate_user(payload)
        return success_response(tokens.model_dump())


@router.post(
    "/refresh",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Refresh access tokens",
    description="Rotates access and refresh tokens using an unexpired JWT refresh token."
)
async def refresh(
    payload: RefreshRequest,
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Refreshes credentials token rotation sessions."""
    async with uow:
        service = AuthService(uow)
        tokens: TokenResponse = await service.refresh_tokens(payload)
        return success_response(tokens.model_dump())


@router.post(
    "/logout",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Purge session credentials",
    description="Logs out the authenticated user, purging credentials and logging logout timelines."
)
async def logout(
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Terminates session tokens validity states."""
    async with uow:
        service = AuthService(uow)
        await service.logout_user(current_user.id)
        return success_response({"message": "Clearence token purged successfully."})
