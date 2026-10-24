"""Grouped skills DTO schemas validation module.

This module validates payload structures when configuring capabilities listings
and maps database skill records to serialized outputs.
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    """Payload to save a new capability registry record."""
    name: str = Field(..., min_length=1, max_length=50, description="Skill name.")
    category: str = Field(..., min_length=2, max_length=50, description="Skill classification group.")
    level: str = Field(default="Intermediate", min_length=2, max_length=50, description="Expertise level.")
    sort_order: int = Field(default=0, description="Visual order placement index.")


class SkillUpdate(BaseModel):
    """Payload to modify skill parameters."""
    version: int = Field(..., description="Stale verification version identifier for concurrency locks.")
    name: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)
    level: Optional[str] = Field(default=None)
    sort_order: Optional[int] = Field(default=None)


class SkillResponse(BaseModel):
    """Clean capability registry response return schema."""
    id: uuid.UUID
    name: str
    category: str
    level: str
    sort_order: int = Field(..., serialization_alias="sortOrder")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
