"""Unit of Work transaction management module for the CMS backend.

This module implements the abstract and concrete Unit of Work structures,
coordinating database session commits and rollbacks atomically.
"""

from abc import ABC, abstractmethod
from typing import Any
from sqlmodel import Session


class UnitOfWork(ABC):
    """Abstract base class establishing Unit of Work context manager interfaces."""

    async def __aenter__(self) -> "UnitOfWork":
        return self

    async def __aexit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        if exc_type is not None:
            await self.rollback()
        else:
            await self.commit()

    @abstractmethod
    async def commit(self) -> None:
        """Commits the active transaction database queries."""
        pass

    @abstractmethod
    async def rollback(self) -> None:
        """Rolls back the active database transaction modifications."""
        pass


class SqlModelUnitOfWork(UnitOfWork):
    """SQLModel session wrapper coordinating database transaction boundaries."""

    def __init__(self, session: Session) -> None:
        """Initializes the database Unit of Work.

        Args:
            session: Injected active SQLModel Session.
        """
        self.session = session

    async def commit(self) -> None:
        """Commits transaction modifications to the database."""
        self.session.commit()

    async def rollback(self) -> None:
        """Rolls back database modifications during errors."""
        self.session.rollback()
