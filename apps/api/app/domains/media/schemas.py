"""Media DTO schemas validation module.

This module formats media records payloads, exposing file details,
paths, and metadata metrics for portfolio applications.
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MediaResponse(BaseModel):
    """Clean media details return schema."""
    id: uuid.UUID
    filename: str
    original_name: str = Field(..., serialization_alias="originalName")
    mime_type: str = Field(..., serialization_alias="mimeType")
    size: int
    folder: str
    width: Optional[int] = None
    height: Optional[int] = None
    aspect_ratio: Optional[float] = Field(default=None, serialization_alias="aspectRatio")
    dominant_color: Optional[str] = Field(default=None, serialization_alias="dominantColor")
    alt_text: Optional[str] = Field(default=None, serialization_alias="altText")
    caption: Optional[str] = None
    thumbnail_path: Optional[str] = Field(default=None, serialization_alias="thumbnailPath")
    filepath: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
