"""DTO schemas definitions for projects, categories, and tags.

This module houses validation schemas mapping request payloads to business parameters,
and serializes database records for outgoing REST payloads.
"""

import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl
from app.domains.projects.models import ProjectStatus


# --------------------------------------------------------------------------
# Category DTOs
# --------------------------------------------------------------------------
class CategoryCreate(BaseModel):
    """Payload to create a new category classification."""
    name: str = Field(..., min_length=2, max_length=50, description="Display name.")
    description: Optional[str] = Field(default=None, max_length=250)


class CategoryUpdate(BaseModel):
    """Payload to modify category parameters."""
    name: Optional[str] = Field(default=None, min_length=2, max_length=50)
    description: Optional[str] = Field(default=None, max_length=250)


class CategoryResponse(BaseModel):
    """Clean category payload return schema."""
    id: uuid.UUID
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------
# Tag DTOs
# --------------------------------------------------------------------------
class TagCreate(BaseModel):
    """Payload to save a new capability tag."""
    name: str = Field(..., min_length=1, max_length=30, description="Display label.")


class TagResponse(BaseModel):
    """Clean tag payload return schema."""
    id: uuid.UUID
    name: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------
# Project DTOs
# --------------------------------------------------------------------------
class ProjectCreate(BaseModel):
    """Payload to create a new portfolio case study."""
    title: str = Field(..., min_length=3, max_length=100, description="Display title.")
    tagline: str = Field(..., min_length=5, max_length=250, description="A brief tagline summary.")
    description: str = Field(..., min_length=10, description="Comprehensive Markdown case study content.")
    category_id: Optional[uuid.UUID] = Field(default=None, description="Category classification ID.")
    status: ProjectStatus = Field(default=ProjectStatus.DRAFT, description="Initial workflow status.")
    featured: bool = Field(default=False, description="Set True to showcase on portfolio home.")
    cover_image: Optional[str] = Field(default=None, description="Static image URL path.")
    github_url: Optional[str] = Field(default=None, description="GitHub repository link.")
    demo_url: Optional[str] = Field(default=None, description="Live deployment link.")
    sort_order: int = Field(default=0, description="Visual order placement index.")
    tag_ids: List[uuid.UUID] = Field(default_factory=list, description="Associated capability tag IDs list.")


class ProjectUpdate(BaseModel):
    """Payload to modify case study details."""
    version: int = Field(..., description="Stale verification version identifier for concurrency locks.")
    title: Optional[str] = Field(default=None, min_length=3, max_length=100)
    tagline: Optional[str] = Field(default=None, min_length=5, max_length=250)
    description: Optional[str] = Field(default=None, min_length=10)
    category_id: Optional[uuid.UUID] = Field(default=None)
    status: Optional[ProjectStatus] = Field(default=None)
    featured: Optional[bool] = Field(default=None)
    cover_image: Optional[str] = Field(default=None)
    github_url: Optional[str] = Field(default=None)
    demo_url: Optional[str] = Field(default=None)
    sort_order: Optional[int] = Field(default=None)
    tag_ids: Optional[List[uuid.UUID]] = Field(default=None)


class ProjectResponse(BaseModel):
    """Clean project payload return schema containing nested categories and tags."""
    id: uuid.UUID
    slug: str
    title: str
    tagline: str
    description: str
    status: ProjectStatus
    featured: bool
    cover_image: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    sort_order: int
    category: Optional[CategoryResponse] = None
    tags: List[TagResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    version: int

    class Config:
        from_attributes = True
        populate_by_name = True
