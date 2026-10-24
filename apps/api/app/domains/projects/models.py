"""Database models definition for the projects vertical slice.

This module houses the Category, Tag, ProjectTag link table, and Project tables,
defining field schemas, foreign keys, and status enums.
"""

import uuid
import sqlalchemy as sa
from enum import Enum
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from app.domains.shared.base import BaseModel


class ProjectStatus(str, Enum):
    """Supported lifecycle states for case study listings."""
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ProjectTag(SQLModel, table=True):
    """Link table mapping the many-to-many relationship between Projects and Tags."""

    __tablename__ = "project_tags"

    project_id: uuid.UUID = Field(
        foreign_key="projects.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    tag_id: uuid.UUID = Field(
        foreign_key="tags.id",
        primary_key=True,
        ondelete="CASCADE"
    )


class Category(BaseModel, table=True):
    """Category classification descriptor group (e.g. Embedded Systems, IoT)."""

    __tablename__ = "categories"

    name: str = Field(nullable=False, index=True)
    slug: str = Field(nullable=False, index=True, sa_column_kwargs={"unique": True})
    description: Optional[str] = Field(default=None, nullable=True)

    # Relationships
    projects: List["Project"] = Relationship(back_populates="category")


class Tag(BaseModel, table=True):
    """Meta-tag labels associated with technical capabilities (e.g. C++, FreeRTOS)."""

    __tablename__ = "tags"

    name: str = Field(nullable=False, index=True)
    slug: str = Field(nullable=False, index=True, sa_column_kwargs={"unique": True})

    # Many-to-many back relationship
    projects: List["Project"] = Relationship(
        back_populates="tags",
        link_model=ProjectTag
    )


class Project(BaseModel, table=True):
    """Project record mapping case study details, URLs, and status settings."""

    __tablename__ = "projects"

    slug: str = Field(
        nullable=False,
        index=True,
        sa_column_kwargs={"unique": True}
    )
    title: str = Field(nullable=False, index=True)
    tagline: str = Field(nullable=False)
    description: str = Field(nullable=False)

    category_id: Optional[uuid.UUID] = Field(
        default=None,
        foreign_key="categories.id",
        nullable=True
    )

    status: ProjectStatus = Field(
        default=ProjectStatus.DRAFT,
        sa_column=sa.Column(
            sa.Enum(ProjectStatus),
            default=ProjectStatus.DRAFT,
            nullable=False
        )
    )

    featured: bool = Field(default=False, nullable=False, index=True)
    cover_image: Optional[str] = Field(default=None, nullable=True)
    github_url: Optional[str] = Field(default=None, nullable=True)
    demo_url: Optional[str] = Field(default=None, nullable=True)
    sort_order: int = Field(default=0, nullable=False)

    # Relationships
    category: Optional[Category] = Relationship(back_populates="projects")
    tags: List[Tag] = Relationship(
        back_populates="projects",
        link_model=ProjectTag
    )
