"""User database model definition for the authentication slice.

This module houses the User table schema inheriting timestamps, soft deletion,
and optimistic concurrency controls from the shared BaseModel.
"""

import sqlalchemy as sa
from datetime import datetime
from typing import Optional
from sqlmodel import Field
from app.domains.shared.base import BaseModel


class User(BaseModel, table=True):
    """User representation inside the database layers."""

    __tablename__ = "users"

    username: str = Field(
        nullable=False,
        index=True,
        sa_column_kwargs={"unique": True}
    )

    email: str = Field(
        nullable=False,
        index=True,
        sa_column_kwargs={"unique": True}
    )

    password_hash: str = Field(nullable=False)

    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)

    # Track login telemetry timezone-aware datetime
    last_login: Optional[datetime] = Field(
        default=None,
        sa_column=sa.Column(sa.DateTime(timezone=True), nullable=True)
    )
