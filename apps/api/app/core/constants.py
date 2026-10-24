"""Core constants and static variables for the CMS backend.

This module houses global error codes, pagination parameters, and status
strings to prevent duplicate values and literal strings in the code.
"""

from typing import Final

# API Info
API_VERSION: Final[str] = "v1"

# Error Codes
ERR_UNAUTHORIZED: Final[str] = "UNAUTHORIZED"
ERR_FORBIDDEN: Final[str] = "FORBIDDEN"
ERR_NOT_FOUND: Final[str] = "NOT_FOUND"
ERR_VALIDATION: Final[str] = "VALIDATION_FAILED"
ERR_DATABASE: Final[str] = "DATABASE_ERROR"
ERR_OPTIMISTIC_LOCK: Final[str] = "CONCURRENCY_CONFLICT"
ERR_INTERNAL_SERVER: Final[str] = "INTERNAL_SERVER_ERROR"
ERR_DUPLICATE_RESOURCE: Final[str] = "DUPLICATE_RESOURCE"
ERR_LIMIT_EXCEEDED: Final[str] = "RATE_LIMIT_EXCEEDED"

# Default pagination constants
DEFAULT_PAGE: Final[int] = 1
DEFAULT_LIMIT: Final[int] = 10
MAX_LIMIT: Final[int] = 100

# Project Status Indicators
STATUS_DRAFT: Final[str] = "draft"
STATUS_REVIEW: Final[str] = "review"
STATUS_PUBLISHED: Final[str] = "published"
STATUS_ARCHIVED: Final[str] = "archived"
VALID_PROJECT_STATUSES: Final[tuple] = (STATUS_DRAFT, STATUS_REVIEW, STATUS_PUBLISHED, STATUS_ARCHIVED)

# File Categories
MEDIA_FOLDER_IMAGES: Final[str] = "images"
MEDIA_FOLDER_DOCUMENTS: Final[str] = "documents"
VALID_MEDIA_FOLDERS: Final[tuple] = (MEDIA_FOLDER_IMAGES, MEDIA_FOLDER_DOCUMENTS)
