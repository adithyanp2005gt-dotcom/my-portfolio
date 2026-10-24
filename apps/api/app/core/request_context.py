"""Request-scoped context variables manager for the CMS backend.

This module exposes thread-safe/async-safe contextvars to track request parameters
like request IDs, client IPs, timezone offsets, and authenticating users.
"""

from contextvars import ContextVar
from datetime import datetime
from typing import Optional
from uuid import UUID

# Thread-safe context variables with safe default values
_request_id: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
_user_id: ContextVar[Optional[UUID]] = ContextVar("user_id", default=None)
_client_ip: ContextVar[Optional[str]] = ContextVar("client_ip", default=None)
_timezone: ContextVar[str] = ContextVar("timezone", default="UTC")
_locale: ContextVar[str] = ContextVar("locale", default="en_US")
_start_time: ContextVar[Optional[datetime]] = ContextVar("start_time", default=None)


def set_request_id(value: str) -> None:
    """Sets the active request's unique ID.

    Args:
        value: The unique request ID string.
    """
    _request_id.set(value)


def get_request_id() -> Optional[str]:
    """Retrieves the active request's unique ID.

    Returns:
        Optional[str]: Unique request ID, if set.
    """
    return _request_id.get()


def set_user_id(value: UUID) -> None:
    """Sets the authenticated user's database ID.

    Args:
        value: The user ID UUID.
    """
    _user_id.set(value)


def get_user_id() -> Optional[UUID]:
    """Retrieves the authenticated user's database ID.

    Returns:
        Optional[UUID]: User ID, if authenticated.
    """
    return _user_id.get()


def set_client_ip(value: str) -> None:
    """Sets the active request's client IP.

    Args:
        value: Client IP address string.
    """
    _client_ip.set(value)


def get_client_ip() -> Optional[str]:
    """Retrieves the active request's client IP.

    Returns:
        Optional[str]: Client IP address string.
    """
    return _client_ip.get()


def set_timezone(value: str) -> None:
    """Sets the active request's client timezone.

    Args:
        value: Client timezone descriptor (e.g. UTC, Asia/Kolkata).
    """
    _timezone.set(value)


def get_timezone() -> str:
    """Retrieves the active request's client timezone.

    Returns:
        str: Client timezone descriptor.
    """
    return _timezone.get()


def set_locale(value: str) -> None:
    """Sets the active request's client locale.

    Args:
        value: Client locale descriptor (e.g. en_US, fr_FR).
    """
    _locale.set(value)


def get_locale() -> str:
    """Retrieves the active request's client locale.

    Returns:
        str: Client locale descriptor.
    """
    return _locale.get()


def set_start_time(value: datetime) -> None:
    """Sets the timestamp at which request execution started.

    Args:
        value: Timezone-aware start datetime.
    """
    _start_time.set(value)


def get_start_time() -> Optional[datetime]:
    """Retrieves the timestamp at which request execution started.

    Returns:
        Optional[datetime]: Timezone-aware start datetime.
    """
    return _start_time.get()


def clear_context() -> None:
    """Cleans up request-scoped variables to prevent cross-request pollution."""
    _request_id.set(None)
    _user_id.set(None)
    _client_ip.set(None)
    _timezone.set("UTC")
    _locale.set("en_US")
    _start_time.set(None)
