"""Repositories database query controller for projects, categories, and tags.

This module extends the generic BaseRepository class to resolve queries,
supporting relationship eager loading, slugs matches, and featured listings.
"""

import uuid
import sqlalchemy as sa
from typing import List, Optional
from sqlmodel import Session, select, func
from app.domains.shared.base_repository import BaseRepository
from app.domains.projects.models import Category, Tag, Project, ProjectStatus
from app.core.pagination import PageParams, PageResponse


class CategoryRepository(BaseRepository[Category]):
    """Database query controller wrapping the categories table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Category)

    def get_by_slug(self, slug: str) -> Optional[Category]:
        """Resolves a category by its slug."""
        statement = select(Category).where(
            Category.slug == slug,
            Category.is_deleted == False
        )
        return self.db.exec(statement).first()


class TagRepository(BaseRepository[Tag]):
    """Database query controller wrapping the tags table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Tag)

    def get_by_slug(self, slug: str) -> Optional[Tag]:
        """Resolves a tag by its slug."""
        statement = select(Tag).where(
            Tag.slug == slug,
            Tag.is_deleted == False
        )
        return self.db.exec(statement).first()


class ProjectRepository(BaseRepository[Project]):
    """Database query controller wrapping the projects table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Project)

    def get_by_id(self, entity_id: uuid.UUID) -> Optional[Project]:
        """Loads a project, eager loading its categories and tags to avoid N+1 query issues.

        Args:
            entity_id: Target project UUID.

        Returns:
            Optional[Project]: Eager-loaded Project model, or None.
        """
        statement = (
            select(Project)
            .where(Project.id == entity_id, Project.is_deleted == False)
            .options(sa.orm.selectinload(Project.category), sa.orm.selectinload(Project.tags))
        )
        return self.db.exec(statement).first()

    def get_by_slug(self, slug: str) -> Optional[Project]:
        """Resolves a project by its unique SEO slug, eager loading relationships.

        Args:
            slug: Unique slug string.

        Returns:
            Optional[Project]: Eager-loaded Project model.
        """
        statement = (
            select(Project)
            .where(Project.slug == slug, Project.is_deleted == False)
            .options(sa.orm.selectinload(Project.category), sa.orm.selectinload(Project.tags))
        )
        return self.db.exec(statement).first()

    def get_featured_projects(self) -> List[Project]:
        """Retrieves published projects flagged as featured, sorted by sort_order.

        Returns:
            List[Project]: Featured project listings.
        """
        statement = (
            select(Project)
            .where(
                Project.is_deleted == False,
                Project.status == ProjectStatus.PUBLISHED,
                Project.featured == True
            )
            .order_by(Project.sort_order.asc(), Project.created_at.desc())
            .options(sa.orm.selectinload(Project.category), sa.orm.selectinload(Project.tags))
        )
        return list(self.db.exec(statement).all())

    def paginate_projects(self, params: PageParams, status_filter: Optional[ProjectStatus] = None) -> PageResponse[Project]:
        """Paginates project queries, supporting search criteria and status filters.

        Args:
            params: Standard pagination and sorting specs.
            status_filter: Optional filter restricting items to status.

        Returns:
            PageResponse[Project]: Mapped paginated project list.
        """
        query = select(Project).where(Project.is_deleted == False)

        if status_filter:
            query = query.where(Project.status == status_filter)

        if params.search:
            # Filters search strings across title, tagline, and description
            query = query.where(
                Project.title.ilike(f"%{params.search}%")
                | Project.tagline.ilike(f"%{params.search}%")
                | Project.description.ilike(f"%{params.search}%")
            )

        # Count operations
        count_query = select(func.count()).select_from(query.subquery())
        total = self.db.exec(count_query).one()

        # Sort configurations
        sort_attr = getattr(Project, params.sort, Project.sort_order)
        if params.order.lower() == "desc":
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        # Paginated retrieval with relationship preloadings
        query = query.offset(params.offset).limit(params.size).options(
            sa.orm.selectinload(Project.category),
            sa.orm.selectinload(Project.tags)
        )
        items = list(self.db.exec(query).all())

        return PageResponse(
            items=items,
            page=params.page,
            size=params.size,
            total=total
        )
