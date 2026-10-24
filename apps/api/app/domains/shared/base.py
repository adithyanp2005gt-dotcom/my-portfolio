"""Reusable database Base Model configuration for CMS database models.

This module houses the BaseModel class containing primary UUIDs, UTC timezone-aware
timestamps, audit tracking columns, soft deletion states, and concurrency locking versions.
"""

import uuid
import sqlalchemy as sa
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    """Base persistence model mapping shared audit and concurrency variables to database rows."""

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=sa.DateTime(timezone=True),
        nullable=False
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=sa.DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}
    )

    deleted_at: Optional[datetime] = Field(
        default=None,
        sa_type=sa.DateTime(timezone=True),
        nullable=True
    )

    created_by: Optional[uuid.UUID] = Field(default=None, nullable=True)
    updated_by: Optional[uuid.UUID] = Field(default=None, nullable=True)
    deleted_by: Optional[uuid.UUID] = Field(default=None, nullable=True)

    is_deleted: bool = Field(default=False, nullable=False, index=True)

    # Optimistic locking version column to handle concurrency checks
    version: int = Field(default=1, nullable=False, sa_column_kwargs={"server_default": "1"})
