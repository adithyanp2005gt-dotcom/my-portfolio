"""Academic history business transaction service.

This module houses EducationService, executing standard CRUD modifications
under transactional boundaries.
"""

import uuid
from typing import Optional
from app.core.exceptions import NotFoundException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.education.models import Education
from app.domains.education.repository import EducationRepository
from app.domains.education.schemas import EducationCreate, EducationUpdate


class EducationService(BaseService):
    """Service governing education registry updates."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.repo = EducationRepository(self.uow.session)

    async def create_education(
        self,
        payload: EducationCreate,
        creator_id: Optional[uuid.UUID] = None
    ) -> Education:
        """Saves a new education record.

        Args:
            payload: Create payload validation schema.
            creator_id: Optional user UUID tracking creation.

        Returns:
            Education: Initialized Education database instance.
        """
        education = Education(
            institution=payload.institution,
            degree=payload.degree,
            start_date=payload.start_date,
            end_date=payload.end_date,
            description=payload.description,
            achievements=payload.achievements,
            certificate_url=payload.certificate_url,
            sort_order=payload.sort_order,
            created_by=creator_id
        )
        return self.repo.create(education)

    async def update_education(
        self,
        edu_id: uuid.UUID,
        payload: EducationUpdate,
        updater_id: Optional[uuid.UUID] = None
    ) -> Education:
        """Applies updates to an academic record.

        Args:
            edu_id: Target education UUID.
            payload: Update payload validation schema.
            updater_id: Optional user UUID tracking updates.

        Returns:
            Education: Modified Education database instance.
        """
        education = self.repo.get_by_id(edu_id)
        if not education:
            raise NotFoundException("Education", str(edu_id))

        # Enforce optimistic locking concurrency checks
        from app.core.exceptions import ConcurrencyConflictException
        if education.version != payload.version:
            raise ConcurrencyConflictException("Education", str(edu_id))

        update_data = payload.model_dump(exclude_unset=True, exclude={"version"})
        for key, value in update_data.items():
            setattr(education, key, value)

        education.updated_by = updater_id
        return self.repo.update(education)

    async def delete_education(self, edu_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> None:
        """Soft deletes an academic record.

        Args:
            edu_id: Target education UUID.
            user_id: Optional user UUID tracking deletion.
        """
        if not self.repo.exists(edu_id):
            raise NotFoundException("Education", str(edu_id))
        self.repo.soft_delete(edu_id, user_id)
