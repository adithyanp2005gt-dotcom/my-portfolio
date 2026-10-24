"""Contact message DTO validation schemas module.

This module validates payload structures when submitting contact form requests
and maps database message records to serialized outputs.
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class MessageCreate(BaseModel):
    """Payload sent by clients submitting a contact form request."""
    sender_name: str = Field(..., min_length=2, max_length=100, description="The sender's name.")
    email: EmailStr = Field(..., description="The sender's email address.")
    subject: Optional[str] = Field(default=None, max_length=150, description="The message subject header.")
    message: str = Field(..., min_length=5, max_length=2000, description="The message content text.")


class MessageResponse(BaseModel):
    """Clean contact message details return schema."""
    id: uuid.UUID
    sender_name: str = Field(..., serialization_alias="senderName")
    email: EmailStr
    subject: Optional[str] = None
    message: str
    is_read: bool = Field(..., serialization_alias="isRead")
    is_starred: bool = Field(..., serialization_alias="isStarred")
    is_archived: bool = Field(..., serialization_alias="isArchived")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
