"""Injectable FastAPI dependencies for database operations and security sessions.

This module exposes parameters checking JWT authenticity, resolving database
connections, and wrapping execution scopes in Unit of Work boundaries.
"""

from typing import Generator, Any
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.config.database import get_db_session
from app.config.security import decode_token
from app.core.exceptions import AuthException, ForbiddenException
from app.core.uow import UnitOfWork, SqlModelUnitOfWork

# Standard OAuth2 scheme pointing to login route
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_db() -> Generator[Session, None, None]:
    """Exposes an active transactional database session.

    Yields:
        Session: Active SQLModel session.
    """
    yield from get_db_session()


def get_uow(db: Session = Depends(get_db)) -> Generator[UnitOfWork, None, None]:
    """Exposes a transactional Unit of Work coordinator.

    Args:
        db: Injected database session.

    Yields:
        UnitOfWork: bound context manager.
    """
    uow = SqlModelUnitOfWork(db)
    yield uow


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Any:
    """Authenticates the incoming request, resolving the active user.

    Args:
        token: Injected JWT access token.
        db: Injected database session.

    Raises:
        AuthException: If credentials or tokens are invalid.

    Returns:
        User: Database User model instance.
    """
    from app.domains.auth.models import User  # Deferred import to prevent circularity

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise AuthException("Authentication credentials validation failed.")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthException("Clearance token claims invalid.")

    import uuid
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise AuthException("Clearance token claims invalid.")

    user = db.get(User, user_uuid)
    if not user or not user.is_active or user.is_deleted:
        raise AuthException("Clearance user resolution failed.")

    return user


async def get_current_superuser(
    current_user = Depends(get_current_user)
) -> Any:
    """Verifies that the resolved user has superuser privileges.

    Args:
        current_user: The authenticated User.

    Raises:
        ForbiddenException: If the user lacks admin access levels.

    Returns:
        User: Admin User instance.
    """
    if not current_user.is_superuser:
        raise ForbiddenException("Administrator clearance required.")
    return current_user
