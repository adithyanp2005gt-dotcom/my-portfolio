"""Academic history database query repository.

This module houses EducationRepository, resolving educational details lists,
ordering academic timelines, and certificate lookups.
"""

from typing import List
from sqlmodel import Session, select
from app.domains.shared.base_repository import BaseRepository
from app.domains.education.models import Education


class EducationRepository(BaseRepository[Education]):
    """Database query controller wrapping the education table."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, Education)

    def list_ordered(self) -> List[Education]:
        """Loads education records sorted by sort_order and start_date descending.

        Returns:
            List[Education]: Ordered list of education history.
        """
        statement = (
            select(Education)
            .where(Education.is_deleted == False)
            .order_by(Education.sort_order.asc(), Education.start_date.desc())
        )
        return list(self.db.exec(statement).all())
