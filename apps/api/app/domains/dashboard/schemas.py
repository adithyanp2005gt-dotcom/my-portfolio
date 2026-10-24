"""Admin dashboard metrics DTO schemas validation module.

This module formats aggregated stats, storage parameters, and recent log lists
payloads returned by admin console endpoints.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.domains.projects.schemas import ProjectResponse
from app.domains.media.schemas import MediaResponse
from app.domains.messages.schemas import MessageResponse


class RecentLoginDto(BaseModel):
    """Metadata block mapping user login audit timestamps."""
    userId: str = Field(..., serialization_alias="userId")
    username: str
    lastLogin: str = Field(..., serialization_alias="lastLogin")


class DashboardStatsResponse(BaseModel):
    """Clean consolidated stats response return schema."""
    totalProjects: int = Field(..., serialization_alias="totalProjects")
    publishedProjects: int = Field(..., serialization_alias="publishedProjects")
    draftProjects: int = Field(..., serialization_alias="draftProjects")
    totalSkills: int = Field(..., serialization_alias="totalSkills")
    totalMedia: int = Field(..., serialization_alias="totalMedia")
    unreadMessages: int = Field(..., serialization_alias="unreadMessages")
    storageUsage: int = Field(..., serialization_alias="storageUsage") # size in bytes
    
    latestPublishedProject: Optional[ProjectResponse] = Field(None, serialization_alias="latestPublishedProject")
    recentUploads: List[MediaResponse] = Field(default_factory=list, serialization_alias="recentUploads")
    recentMessages: List[MessageResponse] = Field(default_factory=list, serialization_alias="recentMessages")
    recentLogins: List[RecentLoginDto] = Field(default_factory=list, serialization_alias="recentLogins")

    class Config:
        from_attributes = True
        populate_by_name = True
