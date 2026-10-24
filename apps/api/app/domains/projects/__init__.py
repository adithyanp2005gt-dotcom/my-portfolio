"""Projects domain package initialisation.

Exports database models, request schemas, repositories, and router modules.
"""

from app.domains.projects.models import Project, Category, Tag, ProjectTag, ProjectStatus
from app.domains.projects.schemas import (
    CategoryCreate,
    CategoryResponse,
    TagCreate,
    TagResponse,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate
)
from app.domains.projects.repository import ProjectRepository, CategoryRepository, TagRepository
from app.domains.projects.service import ProjectService
from app.domains.projects.router import router
from app.domains.projects.exceptions import InvalidProjectSlugException
