"""Diagnostics system health router endpoint controllers.

This module maps HTTP requests to diagnostic health checks, checking database connection,
verifying storage folders, and compiling uptime statistics.
"""

import os
import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select

from app.config.settings import settings
from app.config.database import get_db_session
from app.domains.health.schemas import HealthResponse

router = APIRouter(prefix="/health", tags=["Operational Status"])

# Keep track of application startup timestamps
START_TIME = datetime.now(timezone.utc)


def _get_uptime_string() -> str:
    """Calculates active system running durations.

    Returns:
        str: Human-readable uptime duration description.
    """
    delta = datetime.now(timezone.utc) - START_TIME
    days = delta.days
    hours, remainder = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days}d")
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")
    parts.append(f"{seconds}s")
    
    return " ".join(parts)


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Get system health status",
    description="Diagnostics check validating API, database connectivity, and filesystem access."
)
async def get_health(db: Session = Depends(get_db_session)) -> dict:
    """Runs connectivity checks across services."""
    
    # 1. Verify Database availability
    database_status = "online"
    try:
        db.exec(select(1)).first()
    except Exception:
        database_status = "offline"

    # 2. Verify Storage folder access
    storage_status = "online"
    base_storage = settings.LOCAL_STORAGE_PATH
    if not os.path.exists(base_storage) or not os.access(base_storage, os.W_OK):
        storage_status = "offline"

    # 3. Overall status compilation
    general_status = "healthy"
    if database_status == "offline" or storage_status == "offline":
        general_status = "unhealthy"

    return {
        "status": general_status,
        "api": "online",
        "database": database_status,
        "storage": storage_status,
        "version": settings.APP_VERSION,
        "uptime": _get_uptime_string(),
        "timezone": settings.DEFAULT_TIMEZONE
    }
