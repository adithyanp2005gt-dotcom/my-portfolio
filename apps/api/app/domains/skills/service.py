"""Grouped skills business transaction service.

This module houses SkillService, executing standard CRUD modifications
under transactional boundaries.
"""

import uuid
from typing import Optional
from app.core.exceptions import NotFoundException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.skills.models import Skill
from app.domains.skills.repository import SkillRepository
from app.domains.skills.schemas import SkillCreate, SkillUpdate


class SkillService(BaseService):
    """Service governing skills registry updates."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.repo = SkillRepository(self.uow.session)

    async def create_skill(self, payload: SkillCreate, creator_id: Optional[uuid.UUID] = None) -> Skill:
        """Saves a new skill record.

        Args:
            payload: Create payload validation schema.
            creator_id: Optional user UUID tracking creation.

        Returns:
            Skill: Initialized Skill database instance.
        """
        skill = Skill(
            name=payload.name,
            category=payload.category,
            level=payload.level,
            sort_order=payload.sort_order,
            created_by=creator_id
        )
        return self.repo.create(skill)

    async def update_skill(
        self,
        skill_id: uuid.UUID,
        payload: SkillUpdate,
        updater_id: Optional[uuid.UUID] = None
    ) -> Skill:
        """Applies updates to a skill record.

        Args:
            skill_id: Target skill UUID.
            payload: Update payload validation schema.
            updater_id: Optional user UUID tracking updates.

        Returns:
            Skill: Modified Skill database instance.
        """
        skill = self.repo.get_by_id(skill_id)
        if not skill:
            raise NotFoundException("Skill", str(skill_id))

        # Enforce optimistic locking concurrency checks
        from app.core.exceptions import ConcurrencyConflictException
        if skill.version != payload.version:
            raise ConcurrencyConflictException("Skill", str(skill_id))

        update_data = payload.model_dump(exclude_unset=True, exclude={"version"})
        for key, value in update_data.items():
            setattr(skill, key, value)

        skill.updated_by = updater_id
        return self.repo.update(skill)

    async def delete_skill(self, skill_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> None:
        """Soft deletes a skill record.

        Args:
            skill_id: Target skill UUID.
            user_id: Optional user UUID tracking deletion.
        """
        if not self.repo.exists(skill_id):
            raise NotFoundException("Skill", str(skill_id))
        self.repo.soft_delete(skill_id, user_id)
