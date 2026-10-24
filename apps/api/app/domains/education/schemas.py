"""Academic history DTO schemas validation module.

This module validates payload structures when configuring education records
and maps database education rows to clean serializable responses.
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EducationCreate(BaseModel):
    """Payload to save a new education record."""
    institution: str = Field(..., min_length=2, max_length=100, description="University/Institution title.")
    degree: str = Field(..., min_length=2, max_length=100, description="Field of study or certificate degree.")
    start_date: datetime = Field(..., description="Timeline start date.")
    end_date: Optional[datetime] = Field(default=None, description="Timeline graduation date.")
    description: Optional[str] = Field(default=None, max_length=1000)
    achievements: Optional[str] = Field(default=None, description="Detailed coursework or awards list.")
    certificate_url: Optional[str] = Field(default=None, description="URL/Path to PDF credentials certificate.")
    sort_order: int = Field(default=0, description="Visual order placement index.")


class EducationUpdate(BaseModel):
    """Payload to modify academic details."""
    version: int = Field(..., description="Stale verification version identifier for concurrency locks.")
    institution: Optional[str] = Field(default=None)
    degree: Optional[str] = Field(default=None)
    start_date: Optional[datetime] = Field(default=None)
    end_date: Optional[datetime] = Field(default=None)
    description: Optional[str] = Field(default=None)
    achievements: Optional[str] = Field(default=None)
    certificate_url: Optional[str] = Field(default=None)
    sort_order: Optional[int] = Field(default=None)


class EducationResponse(BaseModel):
    """Clean academic history response return schema."""
    id: uuid.UUID
    institution: str
    degree: str
    start_date: datetime = Field(..., serialization_alias="startDate")
    end_date: Optional[datetime] = Field(default=None, serialization_alias="endDate")
    description: Optional[str] = None
    achievements: Optional[str] = None
    certificate_url: Optional[str] = Field(default=None, serialization_alias="certificateUrl")
    sort_order: int = Field(..., serialization_alias="sortOrder")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
