"""Main Application entry point for the Adithyan Platform CMS API.

This module initializes the FastAPI application, binding lifespan events,
registering middlewares, routing endpoints, and setting up static folders.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config.settings import settings
from app.config.logging import setup_logging
from app.config.storage import initialize_storage_directories
from app.config.database import SessionLocal
from app.core.request_id import RequestIdMiddleware
from app.core.middleware import register_middlewares
from app.core.exceptions import register_exception_handlers
from app.api.v1.router import api_router
from app.startup.seed import seed_initial_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages application startup and teardown transaction boundaries."""
    # 1. Initialize structured rotating JSON logging
    setup_logging()

    # 2. Guarantee upload directory structures exist on disk
    initialize_storage_directories()

    # 2b. Automatically create all tables on startup if they do not exist
    from sqlmodel import SQLModel
    from app.config.database import engine
    import app.db
    SQLModel.metadata.create_all(engine)

    # 3. Seed default admin account if table is empty
    db_session = SessionLocal()
    try:
        seed_initial_admin(db_session)
    finally:
        db_session.close()

    yield
    # Cleanup tasks go here (e.g. database pool shutdown)


# Initialize FastAPI application instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade API backend engine for Adithyan Portfolio CMS.",
    lifespan=lifespan
)

# Hook global exceptions and validation filters
register_exception_handlers(app)

# Inject request identifier middleware first to track subsequent logs
app.add_middleware(RequestIdMiddleware)

# Hook CORS permissions and timing middlewares
register_middlewares(app)

# Mount consolidated v1 API routes under prefix /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Expose uploaded static documents and images directories
if not os.path.exists(settings.LOCAL_STORAGE_PATH):
    os.makedirs(settings.LOCAL_STORAGE_PATH)

app.mount(
    "/uploads",
    StaticFiles(directory=settings.LOCAL_STORAGE_PATH),
    name="uploads"
)
