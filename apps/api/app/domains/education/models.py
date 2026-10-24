"""Academic history database model definition.

This module houses the Education table schema mapping degrees, institution titles,
dates timelines, certificates URLs, achievements lists, and sorting orders.
"""

import sqlalchemy as sa
from datetime import datetime
from typing import Optional
from sqlmodel import Field
from app.domains.shared.base import BaseModel


class Education(BaseModel, table=True):
    """Education representation inside the database layers."""

    __tablename__ = "education"

    institution: str = Field(nullable=False, index=True)
    degree: str = Field(nullable=False, index=True)
    
    start_date: datetime = Field(
        sa_column=sa.Column(sa.DateTime(timezone=True), nullable=False)
    )
    
    end_date: Optional[datetime] = Field(
        default=None,
        sa_column=sa.Column(sa.DateTime(timezone=True), nullable=True)
    )

    description: Optional[str] = Field(default=None, nullable=True)
    achievements: Optional[str] = Field(default=None, nullable=True) # Text block or CSV
    certificate_url: Optional[str] = Field(default=None, nullable=True)
    
    sort_order: int = Field(default=0, nullable=False)
