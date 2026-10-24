"""V1 API Router compiler module.

Imports and mounts all domain-specific endpoints routers (auth, projects,
media, dashboard, health, skills, education) under a consolidated API router.
"""

from fastapi import APIRouter
from app.domains.cms_sync.router import router as cms_router
from app.domains.auth.router import router as auth_router
from app.domains.education.router import router as education_router
from app.domains.media.router import router as media_router
from app.domains.messages.router import router as messages_router
from app.domains.dashboard.router import router as dashboard_router
from app.domains.health.router import router as health_router

# Core API router instance for v1 routes
api_router = APIRouter()

# Register CMS synchronization endpoints first
api_router.include_router(cms_router)

# Register other service endpoint routers
api_router.include_router(auth_router)
api_router.include_router(education_router)
api_router.include_router(media_router)
api_router.include_router(messages_router)
api_router.include_router(dashboard_router)
api_router.include_router(health_router)

