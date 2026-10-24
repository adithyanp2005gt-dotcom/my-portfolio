"""Authentication business transactions service for the auth slice.

This module houses AuthService, managing user identity validations, password
checks, session token generation, and login audit tracking.
"""

import uuid
from datetime import datetime, timezone
from app.config.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.events import UserLoggedIn, UserLoggedOut
from app.core.exceptions import AuthException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.auth.repository import UserRepository
from app.domains.auth.schemas import LoginRequest, RefreshRequest, TokenResponse


class AuthService(BaseService):
    """Business service governing logins, sessions, and token state cycles."""

    def __init__(self, uow: UnitOfWork) -> None:
        """Initializes the AuthService with the unit of work.

        Args:
            uow: Injected database Unit of Work.
        """
        super().__init__(uow)
        # Instantiate repository bound to UOW database session
        self.repo = UserRepository(self.uow.session)

    async def authenticate_user(self, payload: LoginRequest) -> TokenResponse:
        """Validates credentials and generates security tokens on success.

        Args:
            payload: User login credentials schema.

        Raises:
            AuthException: If password verification fails or user is missing.

        Returns:
            TokenResponse: Generated access/refresh credentials.
        """
        # Resolve user by username or email address
        user = self.repo.get_by_identifier(payload.username)
        if not user or not user.is_active:
            raise AuthException("Incorrect access credentials provided.")

        # Verify password hash using security utility
        if not verify_password(payload.password, user.password_hash):
            raise AuthException("Incorrect access credentials provided.")

        # Update last login timestamp
        user.last_login = datetime.now(timezone.utc)
        self.repo.update(user)

        # Generate fresh tokens
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))

        # Dispatch log in tracking event
        await self.publish_event(UserLoggedIn(str(user.id), user.username))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    async def refresh_tokens(self, payload: RefreshRequest) -> TokenResponse:
        """Decodes a refresh token to generate a fresh credentials pair.

        Args:
            payload: Refresh request token payload.

        Raises:
            AuthException: If token is expired, corrupt, or user is deleted.

        Returns:
            TokenResponse: Newly rotated access/refresh credentials.
        """
        claims = decode_token(payload.refresh_token)
        if not claims or claims.get("type") != "refresh":
            raise AuthException("Session validation token expired or corrupt.")

        user_id = claims.get("sub")
        if not user_id:
            raise AuthException("Clearance token claims invalid.")

        # Check user database record
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            raise AuthException("Invalid user ID claims shape.")

        user = self.repo.get_by_id(user_uuid)
        if not user or not user.is_active:
            raise AuthException("User clearance resolution failed.")

        # Generate fresh token pairs (Refresh token rotation)
        new_access = create_access_token(str(user.id))
        new_refresh = create_refresh_token(str(user.id))

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_refresh
        )

    async def logout_user(self, user_id: uuid.UUID) -> None:
        """Logs out a user and publishes the termination event.

        Args:
            user_id: Unique database ID of the user logging out.
        """
        await self.publish_event(UserLoggedOut(str(user_id)))
