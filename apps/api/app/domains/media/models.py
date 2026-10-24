"""Media asset database model definition.

This module houses the Media table schema mapping file metadata, sizes, formats,
dimensions, average RGB hex codes, and thumbnail paths.
"""

from typing import Optional
from sqlmodel import Field
from app.domains.shared.base import BaseModel


class Media(BaseModel, table=True):
    """Media asset representation inside the database layers."""

    __tablename__ = "media"

    filename: str = Field(nullable=False)
    original_name: str = Field(nullable=False)
    mime_type: str = Field(nullable=False, index=True)
    
    # Image properties
    width: Optional[int] = Field(default=None, nullable=True)
    height: Optional[int] = Field(default=None, nullable=True)
    aspect_ratio: Optional[float] = Field(default=None, nullable=True)
    dominant_color: Optional[str] = Field(default=None, nullable=True)
    
    size: int = Field(nullable=False)
    folder: str = Field(nullable=False, index=True)
    
    alt_text: Optional[str] = Field(default=None, nullable=True)
    caption: Optional[str] = Field(default=None, nullable=True)
    
    # SHA256 checksum to prevent duplicate uploads
    sha256: str = Field(nullable=False, index=True)
    
    thumbnail_path: Optional[str] = Field(default=None, nullable=True)
    filepath: str = Field(nullable=False)
