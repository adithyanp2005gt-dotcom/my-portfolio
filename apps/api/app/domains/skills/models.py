"""Grouped skills registry database model definition.

This module houses the Skill table schema mapping technology names, categories
(e.g. Frontend, Backend, Systems), expertise levels, and sort ordering indices.
"""

from sqlmodel import Field
from app.domains.shared.base import BaseModel


class Skill(BaseModel, table=True):
    """Skill representation inside the database layers."""

    __tablename__ = "skills"

    name: str = Field(nullable=False, index=True)
    
    # Category sorting classification (e.g. Backend, Embedded Systems)
    category: str = Field(nullable=False, index=True)
    
    # Optional expertise descriptor (e.g. Expert, Advanced)
    level: str = Field(default="Intermediate", nullable=False)
    
    sort_order: int = Field(default=0, nullable=False)
