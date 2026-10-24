"""Pagination schemas and parameter builders for CMS list endpoints.

This module enforces a standard page request configuration (e.g. page indices,
limits, order vectors) and wraps list results in uniform JSON wrappers.
"""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from app.core.constants import DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT

# Generic type variable mapping to resource DTO shapes
T = TypeVar("T")


class PageParams(BaseModel):
    """Container for API pagination parameters."""

    page: int = Field(default=DEFAULT_PAGE, ge=1, description="Page index (1-based).")
    size: int = Field(default=DEFAULT_LIMIT, ge=1, le=MAX_LIMIT, description="Number of items per page.")
    sort: str = Field(default="created_at", description="Field name to sort items by.")
    order: str = Field(default="desc", description="Sort direction (asc or desc).")
    search: Optional[str] = Field(default=None, description="Search query string.")

    @property
    def offset(self) -> int:
        """Calculates SQL database query query offsets.

        Returns:
            int: Calculated index offset.
        """
        return (self.page - 1) * self.size


class PageResponse(BaseModel, Generic[T]):
    """Standard pagination envelope return wrapper."""

    items: List[T] = Field(..., description="List of items on the current page.")
    page: int = Field(..., description="Current page index.")
    size: int = Field(..., description="Current page size.")
    total: int = Field(..., description="Total count of database records matching query filters.")
