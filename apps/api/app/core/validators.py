"""Reusable validation helpers and sanitization checks for the CMS backend.

This module houses security rules checking slug layouts, verifying MIME ranges,
and blocking directory traversal parameters during file uploads.
"""

import re
from uuid import UUID
from typing import Optional


# Regular expressions for validation compiles
_SLUG_REGEX = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
_URL_REGEX = re.compile(
    r"^(?:http|ftp)s?://"  # http:// or https://
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
    r"localhost|"  # localhost...
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
    r"(?::\d+)?"  # optional port
    r"(?:/?|[/?]\S+)$", re.IGNORECASE
)

# Supported image MIME types matching WebP conversion logic
ALLOWED_IMAGE_MIMES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}

# Supported document types
ALLOWED_DOCUMENT_MIMES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


def is_valid_slug(slug: str) -> bool:
    """Verifies that a slug is formatted correctly for SEO URLs (lowercase alphanumeric and hyphens).

    Args:
        slug: The target slug string.

    Returns:
        bool: True if format matches regex, False otherwise.
    """
    return bool(_SLUG_REGEX.match(slug))


def is_valid_url(url: Optional[str]) -> bool:
    """Checks if a URL string follows correct standard HTTP format rules.

    Args:
        url: The URL string.

    Returns:
        bool: True if valid or empty, False if malformed.
    """
    if not url:
        return True
    return bool(_URL_REGEX.match(url))


def is_safe_filename(filename: str) -> bool:
    """Detects and flags potential directory traversal vectors in filenames.

    Args:
        filename: Target filename string.

    Returns:
        bool: True if safe, False if path indicators are found.
    """
    cleaned = filename.strip()
    if not cleaned or cleaned in (".", ".."):
        return False
    return not any(char in cleaned for char in ("/", "\\", ".."))


def is_valid_image_mime(mime_type: str) -> bool:
    """Verifies if a MIME type matches standard supported web image formats.

    Args:
        mime_type: File content MIME string.

    Returns:
        bool: True if supported image format, False otherwise.
    """
    return mime_type.lower() in ALLOWED_IMAGE_MIMES


def is_valid_uuid(uuid_str: str) -> bool:
    """Checks if a string is a valid UUID structure.

    Args:
        uuid_str: Candidate UUID string.

    Returns:
        bool: True if parsing succeeds, False otherwise.
    """
    try:
        UUID(uuid_str)
        return True
    except ValueError:
        return False
