"""Business transactions service for projects, categories, and tags.

This module houses ProjectService, implementing automated slug calculations,
relation bindings, state modifications, and event bus broadcasts.
"""

import re
import uuid
from typing import List, Optional
from sqlmodel import select

from app.core.events import (
    ProjectCreated,
    ProjectUpdated,
    ProjectPublished,
    ProjectArchived,
    ProjectDeleted
)
from app.core.exceptions import NotFoundException, PlatformException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.projects.models import Category, Tag, Project, ProjectStatus
from app.domains.projects.repository import CategoryRepository, TagRepository, ProjectRepository
from app.domains.projects.schemas import ProjectCreate, ProjectUpdate


class ProjectService(BaseService):
    """Service governing business logic for the projects domain slice."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.project_repo = ProjectRepository(self.uow.session)
        self.category_repo = CategoryRepository(self.uow.session)
        self.tag_repo = TagRepository(self.uow.session)

    def _generate_unique_slug(self, title: str, exclude_id: Optional[uuid.UUID] = None) -> str:
        """Generates a clean, unique SEO slug from a title string.

        Args:
            title: The project title string.
            exclude_id: Optional project ID to ignore during slug lookups.

        Returns:
            str: Generated unique slug.
        """
        # Convert to lowercase, replace non-alphanumeric with hyphens
        slug = title.lower().strip()
        slug = re.sub(r"[^a-z0-9\s-]", "", slug)
        slug = re.sub(r"[\s-]+", "-", slug)
        slug = slug.strip("-")

        if not slug:
            slug = "project-" + uuid.uuid4().hex[:8]

        base_slug = slug
        counter = 1

        # Check database for conflicts
        while True:
            statement = select(Project).where(
                Project.slug == slug,
                Project.is_deleted == False
            )
            if exclude_id:
                statement = statement.where(Project.id != exclude_id)

            existing = self.uow.session.exec(statement).first()
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    async def create_project(self, payload: ProjectCreate, creator_id: Optional[uuid.UUID] = None) -> Project:
        """Generates unique slugs, resolves categories/tags, and saves a project.

        Args:
            payload: Create validation payload.
            creator_id: Optional user ID tracking creation.

        Raises:
            NotFoundException: If category ID or tag IDs are invalid.

        Returns:
            Project: The initialized and flushed Project database instance.
        """
        # Verify category ID if provided
        if payload.category_id:
            if not self.category_repo.exists(payload.category_id):
                raise NotFoundException("Category", str(payload.category_id))

        # Resolve capabilities tags
        tags: List[Tag] = []
        for tag_id in payload.tag_ids:
            tag = self.tag_repo.get_by_id(tag_id)
            if not tag:
                raise NotFoundException("Tag", str(tag_id))
            tags.append(tag)

        # Generate unique slug
        slug = self._generate_unique_slug(payload.title)

        project = Project(
            slug=slug,
            title=payload.title,
            tagline=payload.tagline,
            description=payload.description,
            category_id=payload.category_id,
            status=payload.status,
            featured=payload.featured,
            cover_image=payload.cover_image,
            github_url=payload.github_url,
            demo_url=payload.demo_url,
            sort_order=payload.sort_order,
            tags=tags,
            created_by=creator_id
        )

        created_project = self.project_repo.create(project)
        
        # Dispatch event notification
        await self.publish_event(ProjectCreated(str(created_project.id), created_project.title))
        return created_project

    async def update_project(
        self,
        project_id: uuid.UUID,
        payload: ProjectUpdate,
        updater_id: Optional[uuid.UUID] = None
    ) -> Project:
        """Applies modifications, rotates version check, and re-flushes.

        Args:
            project_id: Target project UUID.
            payload: Update validation payload.
            updater_id: Optional user ID tracking changes.

        Raises:
            NotFoundException: If project, category, or tag is missing.

        Returns:
            Project: Modified Project database instance.
        """
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise NotFoundException("Project", str(project_id))

        # Enforce optimistic locking concurrency checks
        from app.core.exceptions import ConcurrencyConflictException
        if project.version != payload.version:
            raise ConcurrencyConflictException("Project", str(project_id))

        # Apply basic updates
        update_data = payload.model_dump(exclude_unset=True, exclude={"tag_ids", "version"})
        for key, value in update_data.items():
            setattr(project, key, value)

        # Verify category ID if updated
        if payload.category_id:
            if not self.category_repo.exists(payload.category_id):
                raise NotFoundException("Category", str(payload.category_id))

        # Handle tag changes
        if payload.tag_ids is not None:
            tags = []
            for tag_id in payload.tag_ids:
                tag = self.tag_repo.get_by_id(tag_id)
                if not tag:
                    raise NotFoundException("Tag", str(tag_id))
                tags.append(tag)
            project.tags = tags

        # Re-calculate slug if title changes
        if payload.title:
            project.slug = self._generate_unique_slug(payload.title, exclude_id=project_id)

        project.updated_by = updater_id
        updated_project = self.project_repo.update(project)

        # Dispatch event notification
        await self.publish_event(ProjectUpdated(str(updated_project.id), updated_project.title))
        return updated_project

    async def delete_project(self, project_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> None:
        """Soft-deletes a project and dispatches the deletion event.

        Args:
            project_id: Target project UUID.
            user_id: Optional user ID tracking deletion.

        Raises:
            NotFoundException: If project is missing.
        """
        if not self.project_repo.exists(project_id):
            raise NotFoundException("Project", str(project_id))

        self.project_repo.soft_delete(project_id, user_id)
        await self.publish_event(ProjectDeleted(str(project_id)))

    async def publish_project(self, project_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> Project:
        """Sets a project status to Published and publishes the event.

        Args:
            project_id: Target project UUID.
            user_id: Optional user ID tracking changes.

        Returns:
            Project: Mapped project.
        """
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise NotFoundException("Project", str(project_id))

        project.status = ProjectStatus.PUBLISHED
        project.updated_by = user_id
        
        updated = self.project_repo.update(project)
        await self.publish_event(ProjectPublished(str(project_id)))
        return updated

    async def archive_project(self, project_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> Project:
        """Sets a project status to Archived and publishes the event.

        Args:
            project_id: Target project UUID.
            user_id: Optional user ID tracking changes.

        Returns:
            Project: Mapped project.
        """
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise NotFoundException("Project", str(project_id))

        project.status = ProjectStatus.ARCHIVED
        project.updated_by = user_id
        
        updated = self.project_repo.update(project)
        await self.publish_event(ProjectArchived(str(project_id)))
        return updated
