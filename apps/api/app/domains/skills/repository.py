"""Grouped skills database query repository.

This module houses SkillRepository, resolving capability registers, sorting orders,
and categories listings.
"""

from typing import List
from sqlmodel import Session, select
from app.domains.shared.base_repository import BaseRepository
from app.domains.skills.models import Skill


class SkillRepository(BaseRepository[Skill]):
    """Database query controller wrapping the skills table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Skill)

    def list_ordered(self) -> List[Skill]:
        """Loads skills sorted by sort_order and name alphabetically.

        Returns:
            List[Skill]: Ordered list of skills.
        """
        statement = (
            select(Skill)
            .where(Skill.is_deleted == False)
            .order_by(Skill.sort_order.asc(), Skill.name.asc())
        )
        return list(self.db.exec(statement).all())
