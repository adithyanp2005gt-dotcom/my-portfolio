"""FastAPI router endpoint controllers for the projects vertical slice.

This module maps HTTP requests to CRUD operations for projects, categories, and tags,
returning validated PageResponse wrappers or item payloads.
"""

import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_user, get_uow
from app.core.pagination import PageParams, PageResponse
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.projects.models import ProjectStatus, Category, Tag
from app.domains.projects.schemas import (
    CategoryCreate,
    CategoryResponse,
    TagCreate,
    TagResponse,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate
)
from app.domains.projects.service import ProjectService
from app.domains.projects.repository import ProjectRepository, CategoryRepository, TagRepository

router = APIRouter(prefix="/projects", tags=["Selected Case Studies"])


# --------------------------------------------------------------------------
# Category Endpoints
# --------------------------------------------------------------------------
@router.get(
    "/categories",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List all categories",
    description="Retrieves a list of all active classification categories."
)
async def list_categories(db = Depends(get_uow)) -> dict:
    repo = CategoryRepository(db.session)
    categories = repo.list()
    dtos = [CategoryResponse.model_validate(c).model_dump() for c in categories]
    return success_response(dtos)


@router.post(
    "/categories",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Create classification category",
    description="Registers a new project category. (Requires authentication)."
)
async def create_category(
    payload: CategoryCreate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        # Convert name into a slug natively
        import re
        slug = payload.name.lower().strip()
        slug = re.sub(r"[^a-z0-9\s-]", "", slug)
        slug = re.sub(r"[\s-]+", "-", slug).strip("-")
        
        repo = CategoryRepository(uow.session)
        category = Category(name=payload.name, slug=slug, description=payload.description, created_by=current_user.id)
        created = repo.create(category)
        return success_response(CategoryResponse.model_validate(created).model_dump())


# --------------------------------------------------------------------------
# Tag Endpoints
# --------------------------------------------------------------------------
@router.get(
    "/tags",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List all capability tags",
    description="Retrieves a list of all active technology and capability tags."
)
async def list_tags(db = Depends(get_uow)) -> dict:
    repo = TagRepository(db.session)
    tags = repo.list()
    dtos = [TagResponse.model_validate(t).model_dump() for t in tags]
    return success_response(dtos)


@router.post(
    "/tags",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Create capability tag",
    description="Registers a new technology tag. (Requires authentication)."
)
async def create_tag(
    payload: TagCreate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        import re
        slug = payload.name.lower().strip()
        slug = re.sub(r"[^a-z0-9\s-]", "", slug)
        slug = re.sub(r"[\s-]+", "-", slug).strip("-")

        repo = TagRepository(uow.session)
        tag = Tag(name=payload.name, slug=slug, created_by=current_user.id)
        created = repo.create(tag)
        return success_response(TagResponse.model_validate(created).model_dump())


# --------------------------------------------------------------------------
# Project Endpoints
# --------------------------------------------------------------------------
@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Paginate case studies list",
    description="Loads a paginated list of projects, supporting search strings and status filters."
)
async def list_projects(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    sort: str = Query("sort_order"),
    order: str = Query("asc"),
    search: Optional[str] = Query(None),
    status: Optional[ProjectStatus] = Query(None),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    params = PageParams(page=page, size=size, sort=sort, order=order, search=search)
    repo = ProjectRepository(uow.session)
    page_res = repo.paginate_projects(params, status_filter=status)
    
    # Map raw SQLModel entities to clean response DTOs
    items_dtos = [ProjectResponse.model_validate(p).model_dump() for p in page_res.items]
    
    return success_response({
        "items": items_dtos,
        "page": page_res.page,
        "size": page_res.size,
        "total": page_res.total
    })


@router.get(
    "/featured",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List featured portfolio projects",
    description="Retrieves a list of published projects flagged as featured, sorted by sort_order."
)
async def list_featured(uow: UnitOfWork = Depends(get_uow)) -> dict:
    repo = ProjectRepository(uow.session)
    projects = repo.get_featured_projects()
    dtos = [ProjectResponse.model_validate(p).model_dump() for p in projects]
    return success_response(dtos)


@router.get(
    "/{project_id_or_slug}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Get single case study details",
    description="Loads a project details by its UUID or unique slug."
)
async def get_project(
    project_id_or_slug: str,
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    repo = ProjectRepository(uow.session)
    project = None
    try:
        # Check if ID is UUID
        project_uuid = uuid.UUID(project_id_or_slug)
        project = repo.get_by_id(project_uuid)
    except ValueError:
        # Resolve by slug
        project = repo.get_by_slug(project_id_or_slug)

    if not project:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Project", project_id_or_slug)

    return success_response(ProjectResponse.model_validate(project).model_dump())


@router.post(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_201_CREATED,
    summary="Publish new case study",
    description="Registers a new project details and assigns unique slug. (Requires authentication)."
)
async def create_project(
    payload: ProjectCreate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        service = ProjectService(uow)
        created = await service.create_project(payload, creator_id=current_user.id)
        return success_response(ProjectResponse.model_validate(created).model_dump())


@router.put(
    "/{project_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Modify project case study",
    description="Applies updates to project metadata fields. (Requires authentication)."
)
async def update_project(
    project_id: uuid.UUID,
    payload: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        service = ProjectService(uow)
        updated = await service.update_project(project_id, payload, updater_id=current_user.id)
        return success_response(ProjectResponse.model_validate(updated).model_dump())


@router.delete(
    "/{project_id}",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Soft delete project case study",
    description="Flags a project as deleted in the database layer. (Requires authentication)."
)
async def delete_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        service = ProjectService(uow)
        await service.delete_project(project_id, user_id=current_user.id)
        return success_response({"message": f"Project '{project_id}' soft-deleted successfully."})


@router.post(
    "/{project_id}/publish",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Publish project",
    description="Transitions a project status to Published. (Requires authentication)."
)
async def publish_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        service = ProjectService(uow)
        updated = await service.publish_project(project_id, user_id=current_user.id)
        return success_response(ProjectResponse.model_validate(updated).model_dump())


@router.post(
    "/{project_id}/archive",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Archive project",
    description="Transitions a project status to Archived. (Requires authentication)."
)
async def archive_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    async with uow:
        service = ProjectService(uow)
        updated = await service.archive_project(project_id, user_id=current_user.id)
        return success_response(ProjectResponse.model_validate(updated).model_dump())
