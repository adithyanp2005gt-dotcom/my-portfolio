"""Authentication DTO validation schemas module.

This module houses input validation models for logins and token rotation,
and maps database User records to clean serializable responses.
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Payload sent by clients attempting to authenticate."""
    username: str = Field(..., min_length=3, max_length=50, description="The user's username or email.")
    password: str = Field(..., min_length=4, max_length=100, description="The user's passphrase.")


class RefreshRequest(BaseModel):
    """Payload sent to exchange an expired access token for a fresh one."""
    refresh_token: str = Field(..., description="The unexpired JWT refresh token.")


class TokenResponse(BaseModel):
    """Security token credentials returned upon validation success."""
    access_token: str = Field(..., description="JWT Access Token used in Bearer headers.")
    refresh_token: str = Field(..., description="JWT Refresh Token used for token rotation.")
    token_type: str = Field(default="bearer", description="Authentication header scheme type.")


class UserResponse(BaseModel):
    """Serializable user detail schema, protecting hashed credentials."""
    id: uuid.UUID
    username: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
