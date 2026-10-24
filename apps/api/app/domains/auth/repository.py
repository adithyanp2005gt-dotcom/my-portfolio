"""User database query repository for the authentication slice.

This module extends the generic BaseRepository class to search accounts
by usernames, emails, or composite identity fields.
"""

from typing import Optional
from sqlmodel import Session, select
from app.domains.shared.base_repository import BaseRepository
from app.domains.auth.models import User


class UserRepository(BaseRepository[User]):
    """Database query controller wrapping the users table."""

    def __init__(self, db: Session) -> None:
        """Initializes the User repository context.

        Args:
            db: Injected active SQLModel session.
        """
        super().__init__(db, User)

    def get_by_username(self, username: str) -> Optional[User]:
        """Resolves an active user by their exact username.

        Args:
            username: Target username string.

        Returns:
            Optional[User]: Loaded User instance, or None if missing/soft-deleted.
        """
        statement = select(User).where(
            User.username == username,
            User.is_deleted == False
        )
        return self.db.exec(statement).first()

    def get_by_email(self, email: str) -> Optional[User]:
        """Resolves an active user by their exact email address.

        Args:
            email: Target email string.

        Returns:
            Optional[User]: Loaded User instance, or None if missing/soft-deleted.
        """
        statement = select(User).where(
            User.email == email,
            User.is_deleted == False
        )
        return self.db.exec(statement).first()

    def get_by_identifier(self, identifier: str) -> Optional[User]:
        """Resolves an active user by either their username or email address.

        Args:
            identifier: Match string (username or email).

        Returns:
            Optional[User]: Loaded User instance, or None if missing.
        """
        statement = select(User).where(
            (User.username == identifier) | (User.email == identifier)
        ).where(User.is_deleted == False)
        
        return self.db.exec(statement).first()
