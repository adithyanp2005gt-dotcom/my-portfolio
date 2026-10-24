"""Admin dashboard metrics business transaction service.

This module houses DashboardService, aggregating queries across projects,
messages, skills, media, and users tables to output platform statistics.
"""

import sqlalchemy as sa
from typing import List, Optional
from sqlmodel import select, func

from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.projects.models import Project, ProjectStatus
from app.domains.skills.models import Skill
from app.domains.media.models import Media
from app.domains.messages.models import ContactMessage
from app.domains.auth.models import User
from app.domains.dashboard.schemas import DashboardStatsResponse, RecentLoginDto


class DashboardService(BaseService):
    """Service aggregating admin statistics and platform metrics."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)

    async def get_dashboard_metrics(self) -> DashboardStatsResponse:
        """Retrieves and consolidates site stats and recent activity.

        Returns:
            DashboardStatsResponse: Consolidated dashboard stats payload.
        """
        session = self.uow.session

        # 1. Projects Count Aggregates
        total_projects = session.exec(select(func.count(Project.id)).where(Project.is_deleted == False)).one() or 0
        published_projects = session.exec(
            select(func.count(Project.id))
            .where(Project.is_deleted == False)
            .where(Project.status == ProjectStatus.PUBLISHED)
        ).one() or 0
        draft_projects = session.exec(
            select(func.count(Project.id))
            .where(Project.is_deleted == False)
            .where(Project.status == ProjectStatus.DRAFT)
        ).one() or 0

        # 2. Skills Count
        total_skills = session.exec(select(func.count(Skill.id)).where(Skill.is_deleted == False)).one() or 0

        # 3. Media Registry & Storage Footprint size
        total_media = session.exec(select(func.count(Media.id)).where(Media.is_deleted == False)).one() or 0
        storage_usage = session.exec(
            select(func.sum(Media.size))
            .where(Media.is_deleted == False)
        ).one() or 0

        # 4. Unread messages count
        unread_messages = session.exec(
            select(func.count(ContactMessage.id))
            .where(ContactMessage.is_deleted == False)
            .where(ContactMessage.is_read == False)
        ).one() or 0

        # 5. Latest published project
        latest_project = session.exec(
            select(Project)
            .where(Project.is_deleted == False)
            .where(Project.status == ProjectStatus.PUBLISHED)
            .order_by(Project.created_at.desc())
            .limit(1)
        ).first()

        # 6. Recent Uploads (Latest 5 items)
        recent_uploads = list(session.exec(
            select(Media)
            .where(Media.is_deleted == False)
            .order_by(Media.created_at.desc())
            .limit(5)
        ).all())

        # 7. Recent Messages (Latest 5 items)
        recent_messages = list(session.exec(
            select(ContactMessage)
            .where(ContactMessage.is_deleted == False)
            .order_by(ContactMessage.created_at.desc())
            .limit(5)
        ).all())

        # 8. Recent Logins (Latest 5 user logins)
        recent_users = list(session.exec(
            select(User)
            .where(User.is_deleted == False)
            .where(User.last_login != None)
            .order_by(User.last_login.desc())
            .limit(5)
        ).all())

        recent_logins = [
            RecentLoginDto(
                userId=str(u.id),
                username=u.username,
                lastLogin=u.last_login.isoformat()
            )
            for u in recent_users if u.last_login
        ]

        return DashboardStatsResponse(
            totalProjects=total_projects,
            publishedProjects=published_projects,
            draftProjects=draft_projects,
            totalSkills=total_skills,
            totalMedia=total_media,
            unreadMessages=unread_messages,
            storageUsage=storage_usage,
            latestPublishedProject=latest_project,
            recentUploads=recent_uploads,
            recentMessages=recent_messages,
            recentLogins=recent_logins
        )
