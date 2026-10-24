"""Admin dashboard domain package initialisation.

Exports response schemas, services, and router modules.
"""

from app.domains.dashboard.schemas import DashboardStatsResponse
from app.domains.dashboard.service import DashboardService
from app.domains.dashboard.router import router
