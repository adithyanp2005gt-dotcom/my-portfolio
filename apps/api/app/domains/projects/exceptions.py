"""Projects domain-specific exception classes.

This module houses custom exceptions raised during project validations
or transactional processing conflicts.
"""

from app.core.exceptions import PlatformException


class InvalidProjectSlugException(PlatformException):
    """Raised when an automatically generated or modified slug fails validation constraints."""

    def __init__(self, slug: str) -> None:
        super().__init__(
            code="INVALID_PROJECT_SLUG",
            message=f"The project slug format '{slug}' is invalid.",
            status_code=400
        )
