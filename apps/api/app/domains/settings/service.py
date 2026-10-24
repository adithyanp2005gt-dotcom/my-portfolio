"""System settings business transaction service.

This module houses SettingsService, implementing configuration updates merges,
providing fallback configurations, and notifying listeners on changes.
"""

import uuid
from typing import Dict, Any, Optional
from app.core.events import SettingsUpdated
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.settings.models import SystemSetting
from app.domains.settings.repository import SettingsRepository
from app.domains.settings.schemas import SettingsDto, SettingsUpdate

# Seed configurations used when database record is not yet initialized
DEFAULT_CONFIG: Dict[str, Any] = {
    "heroTitle": "Adithyan",
    "heroSubtitle": "AI Developer & Embedded Systems Engineer",
    "aboutContent": "I design intelligent software and embedded systems combining precision and reliable code.",
    "contactEmail": "adithyanp2005gt@gmail.com",
    "resumeUrl": "/uploads/resume.pdf",
    "githubLink": "https://github.com/adithyanp2005gt-dotcom",
    "linkedinLink": "https://linkedin.com/in/adithyan-dev",
    "seoTitle": "Adithyan | AI & Embedded Systems Engineer",
    "seoDescription": "Portfolio case studies showcasing firmware engineering and IoT networks.",
    "footerLine": "Building intelligent systems with precision.",
    "themeSettings": {
        "primaryColor": "#4F8CFF",
        "darkMode": True
    }
}


class SettingsService(BaseService):
    """Service governing dynamic settings configuration updates."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.repo = SettingsRepository(self.uow.session)

    async def get_site_config(self) -> SettingsDto:
        """Retrieves active configurations, falling back to default variables if missing.

        Returns:
            SettingsDto: Structured configuration schema.
        """
        record = self.repo.get_by_key("site_config")
        if not record:
            return SettingsDto.model_validate(DEFAULT_CONFIG)
        
        # Merge DB variables onto DEFAULT_CONFIG to guarantee complete schemas
        config_data = DEFAULT_CONFIG.copy()
        config_data.update(record.value)
        return SettingsDto.model_validate(config_data)

    async def update_site_config(self, payload: SettingsUpdate, updater_id: Optional[uuid.UUID] = None) -> SettingsDto:
        """Merges updates, triggers DB saves, and fires event bus notifications.

        Args:
            payload: Parameters modifications payload.
            updater_id: Optional user UUID tracking changes.

        Returns:
            SettingsDto: Mapped updated configuration settings.
        """
        record = self.repo.get_by_key("site_config")
        
        current_values = DEFAULT_CONFIG.copy()
        if record:
            current_values.update(record.value)
        else:
            record = SystemSetting(key="site_config")
            record.created_by = updater_id

        # Merge updates
        updates = payload.model_dump(exclude_unset=True)
        current_values.update(updates)
        
        record.value = current_values
        record.updated_by = updater_id

        if record.id is None:
            self.repo.create(record)
        else:
            self.repo.update(record)

        # Notify event listeners
        await self.publish_event(SettingsUpdated("site_config"))

        return SettingsDto.model_validate(current_values)
