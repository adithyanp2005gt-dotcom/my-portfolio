"""Generic Base Repository class implementation module.

This module houses BaseRepository, standardizing database queries and filtering,
supporting soft deletions, version increments, and pagination.
"""

import uuid
from datetime import datetime, timezone
from typing import Generic, List, Optional, Type, TypeVar
from sqlmodel import Session, select, func
from app.core.exceptions import ConcurrencyConflictException, NotFoundException
from app.core.pagination import PageParams, PageResponse
from app.domains.shared.base import BaseModel

# Type variable bound to our audit BaseModel
T = TypeVar("T", bound=BaseModel)


class BaseRepository(Generic[T]):
    """Generic repository mapping standard query operations to SQLModel entities."""

    def __init__(self, db: Session, model_class: Type[T]) -> None:
        """Initializes the repository with a database session context.

        Args:
            db: Active SQLModel session.
            model_class: Target SQLModel subclass class reference.
        """
        self.db = db
        self.model_class = model_class

    def create(self, model: T) -> T:
        """Adds a new entity, tracking the initial version details.

        Args:
            model: Model instance to create.

        Returns:
            T: Created model instance.
        """
        model.is_deleted = False
        model.version = 1
        self.db.add(model)
        self.db.flush()
        return model

    def update(self, model: T) -> T:
        """Saves modifications, performing optimistic concurrency checks.

        Args:
            model: Model instance containing modified values.

        Raises:
            ConcurrencyConflictException: If another process updated the record.

        Returns:
            T: Updated model instance.
        """
        # Read the current record from database state to verify version
        db_record = self.db.exec(
            select(self.model_class)
            .where(self.model_class.id == model.id)
            .where(self.model_class.is_deleted == False)
        ).first()

        if not db_record:
            raise NotFoundException(self.model_class.__name__, str(model.id))

        if db_record.version != model.version:
            raise ConcurrencyConflictException(self.model_class.__name__, str(model.id))

        # Increment version to prevent race updates
        model.version += 1
        model.updated_at = datetime.now(timezone.utc)

        # Merge changes into database session
        self.db.merge(model)
        self.db.flush()
        return model

    def get_by_id(self, entity_id: uuid.UUID) -> Optional[T]:
        """Resolves an active record by its UUID.

        Args:
            entity_id: Unique record ID UUID.

        Returns:
            Optional[T]: Loaded model, or None if missing or soft-deleted.
        """
        statement = select(self.model_class).where(
            self.model_class.id == entity_id,
            self.model_class.is_deleted == False
        )
        return self.db.exec(statement).first()

    def exists(self, entity_id: uuid.UUID) -> bool:
        """Checks if a record exists in the active database dataset.

        Args:
            entity_id: Unique record ID UUID.

        Returns:
            bool: True if present and not deleted, False otherwise.
        """
        statement = select(func.count()).select_from(self.model_class).where(
            self.model_class.id == entity_id,
            self.model_class.is_deleted == False
        )
        count_val = self.db.exec(statement).one()
        return count_val > 0

    def list(self) -> List[T]:
        """Retrieves all active records.

        Returns:
            List[T]: List of loaded active records.
        """
        statement = select(self.model_class).where(self.model_class.is_deleted == False)
        return list(self.db.exec(statement).all())

    def paginate(self, params: PageParams) -> PageResponse[T]:
        """Generates paginated subsets of active database records.

        Args:
            params: Standard page parameters (offsets, sorting, sorting vectors).

        Returns:
            PageResponse[T]: Paginated page response wrapper.
        """
        # Base query ignoring soft-deleted entities
        query = select(self.model_class).where(self.model_class.is_deleted == False)

        # Search parameter query filtering (searches by title or description if supported)
        if params.search and hasattr(self.model_class, "title"):
            query = query.where(
                getattr(self.model_class, "title").ilike(f"%{params.search}%")
            )
        elif params.search and hasattr(self.model_class, "name"):
            query = query.where(
                getattr(self.model_class, "name").ilike(f"%{params.search}%")
            )

        # Calculate total matching count
        count_query = select(func.count()).select_from(query.subquery())
        total = self.db.exec(count_query).one()

        # Sort order configuration
        sort_attr = getattr(self.model_class, params.sort, self.model_class.created_at)
        if params.order.lower() == "desc":
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        # Offsets limit execution
        items = list(self.db.exec(query.offset(params.offset).limit(params.size)).all())

        return PageResponse(
            items=items,
            page=params.page,
            size=params.size,
            total=total
        )

    def count(self) -> int:
        """Returns the total number of active records.

        Returns:
            int: Number of records.
        """
        statement = select(func.count()).select_from(self.model_class).where(
            self.model_class.is_deleted == False
        )
        return self.db.exec(statement).one()

    def soft_delete(self, entity_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> bool:
        """Soft-deletes a record from the database.

        Args:
            entity_id: Target record ID UUID.
            user_id: Optional user ID tracking deletion actions.

        Returns:
            bool: True if soft-deleted successfully, False if missing.
        """
        record = self.get_by_id(entity_id)
        if not record:
            return False

        record.is_deleted = True
        record.deleted_at = datetime.now(timezone.utc)
        record.deleted_by = user_id

        # Save updates to session
        self.db.add(record)
        self.db.flush()
        return True

    def restore(self, entity_id: uuid.UUID) -> bool:
        """Restores a soft-deleted record back to active state.

        Args:
            entity_id: Target record ID UUID.

        Returns:
            bool: True if restored successfully, False if not found.
        """
        statement = select(self.model_class).where(
            self.model_class.id == entity_id,
            self.model_class.is_deleted == True
        )
        record = self.db.exec(statement).first()
        if not record:
            return False

        record.is_deleted = False
        record.deleted_at = None
        record.deleted_by = None

        self.db.add(record)
        self.db.flush()
        return True
