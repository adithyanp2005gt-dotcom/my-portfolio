"""System settings database query repository.

This module houses SettingsRepository, managing configuration lookups
and updating configuration key-value blocks.
"""

from typing import Optional
from sqlmodel import Session, select
from app.domains.shared.base_repository import BaseRepository
from app.domains.settings.models import SystemSetting


class SettingsRepository(BaseRepository[SystemSetting]):
    """Database query controller wrapping the settings table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, SystemSetting)

    def get_by_key(self, key: str) -> Optional[SystemSetting]:
        """Resolves system configurations by key identifier.

        Args:
            key: The target configuration key (e.g. site_config).

        Returns:
            Optional[SystemSetting]: Loaded record, or None.
        """
        statement = select(SystemSetting).where(
            SystemSetting.key == key,
            SystemSetting.is_deleted == False
        )
        return self.db.exec(statement).first()
