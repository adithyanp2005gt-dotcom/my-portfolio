"""System settings database model definition.

This module houses the SystemSetting table schema used to save dynamic portfolio
configurations (such as Hero, SEO, navigation, themes) inside JSON columns.
"""

import sqlalchemy as sa
from sqlmodel import Field, Column
from app.domains.shared.base import BaseModel


class SystemSetting(BaseModel, table=True):
    """Database record mapping a configuration key to a serialized JSON value block."""

    __tablename__ = "settings"

    key: str = Field(
        nullable=False,
        index=True,
        sa_column_kwargs={"unique": True}
    )

    # Serialized settings dictionary
    value: dict = Field(
        default_factory=dict,
        sa_column=sa.Column(sa.JSON, nullable=False)
    )
