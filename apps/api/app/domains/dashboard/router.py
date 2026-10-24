"""Admin dashboard statistics router endpoint controllers.

This module maps HTTP requests to aggregate CMS metrics tables data,
returning standardized JSON response shapes.
"""

from fastapi import APIRouter, Depends, status
from app.core.dependencies import get_current_user, get_uow
from app.core.responses import SuccessResponseModel, success_response
from app.core.uow import UnitOfWork
from app.domains.auth.models import User
from app.domains.dashboard.schemas import DashboardStatsResponse
from app.domains.dashboard.service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    response_model=SuccessResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Get admin dashboard statistics",
    description="Aggregates site metrics across case studies, media, and contact forms. (Requires authentication)."
)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow)
) -> dict:
    """Retrieves consolidated dashboard analytics and aggregates."""
    service = DashboardService(uow)
    stats: DashboardStatsResponse = await service.get_dashboard_metrics()
    return success_response(stats.model_dump())
