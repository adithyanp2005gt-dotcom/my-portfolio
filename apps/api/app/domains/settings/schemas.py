"""System settings DTO schemas validation module.

This module validates payload structures when configuring site details
and exposes clean serializable outputs for portfolio frontends.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field


class SettingsDto(BaseModel):
    """Clean site configuration payload return schema."""
    heroTitle: str = Field(..., description="Main hero heading.")
    heroSubtitle: str = Field(..., description="Supporting subtitle.")
    aboutContent: str = Field(..., description="Markdown biography text.")
    contactEmail: EmailStr = Field(..., description="Default destination email address.")
    resumeUrl: Optional[str] = Field(default=None, description="Path to resume file.")
    githubLink: Optional[str] = Field(default=None, description="GitHub profile URL.")
    linkedinLink: Optional[str] = Field(default=None, description="LinkedIn profile URL.")
    seoTitle: str = Field(..., description="Page title SEO parameter.")
    seoDescription: str = Field(..., description="Meta description tag contents.")
    footerLine: str = Field(..., description="Copyright/sign-off notice.")
    themeSettings: Dict[str, Any] = Field(default_factory=dict, description="Visual theme attributes.")


class SettingsUpdate(BaseModel):
    """Payload to modify configuration parameters."""
    heroTitle: Optional[str] = Field(default=None)
    heroSubtitle: Optional[str] = Field(default=None)
    aboutContent: Optional[str] = Field(default=None)
    contactEmail: Optional[EmailStr] = Field(default=None)
    resumeUrl: Optional[str] = Field(default=None)
    githubLink: Optional[str] = Field(default=None)
    linkedinLink: Optional[str] = Field(default=None)
    seoTitle: Optional[str] = Field(default=None)
    seoDescription: Optional[str] = Field(default=None)
    footerLine: Optional[str] = Field(default=None)
    themeSettings: Optional[Dict[str, Any]] = Field(default=None)
