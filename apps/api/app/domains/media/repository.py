"""Media database query repository.

This module houses MediaRepository, resolving query details and locating
matching entries by checksum parameters.
"""

from typing import Optional
from sqlmodel import Session, select
from app.domains.shared.base_repository import BaseRepository
from app.domains.media.models import Media


class MediaRepository(BaseRepository[Media]):
    """Database query controller wrapping the media table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Media)

    def get_by_sha256(self, sha256_hash: str) -> Optional[Media]:
        """Resolves active media entries by their checksum.

        Args:
            sha256_hash: Alphanumeric hash string.

        Returns:
            Optional[Media]: Loaded media record, or None if unique.
        """
        statement = select(Media).where(
            Media.sha256 == sha256_hash,
            Media.is_deleted == False
        )
        return self.db.exec(statement).first()
