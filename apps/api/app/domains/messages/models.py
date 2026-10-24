"""Contact message inbox database model definition.

This module houses the ContactMessage table schema mapping sender details, email contacts,
subjects, messages content, read states, and starred indicators.
"""

from typing import Optional
from sqlmodel import Field
from app.domains.shared.base import BaseModel


class ContactMessage(BaseModel, table=True):
    """Contact message representation inside the database layers."""

    __tablename__ = "messages"

    sender_name: str = Field(nullable=False, index=True)
    email: str = Field(nullable=False, index=True)
    subject: Optional[str] = Field(default=None, nullable=True)
    message: str = Field(nullable=False)

    is_read: bool = Field(default=False, nullable=False, index=True)
    is_starred: bool = Field(default=False, nullable=False, index=True)
    is_archived: bool = Field(default=False, nullable=False, index=True)
