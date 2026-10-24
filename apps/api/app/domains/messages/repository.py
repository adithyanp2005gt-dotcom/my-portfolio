"""Contact message inbox database query repository.

This module houses MessageRepository, resolving message lists, statuses,
and read/starred flag lookups.
"""

from sqlmodel import Session
from app.domains.shared.base_repository import BaseRepository
from app.domains.messages.models import ContactMessage


class MessageRepository(BaseRepository[ContactMessage]):
    """Database query controller wrapping the messages table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, ContactMessage)
