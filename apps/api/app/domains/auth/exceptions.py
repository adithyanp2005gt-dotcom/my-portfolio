"""Authentication domain-specific exception classes.

This module houses custom exceptions raised during security validation,
inheriting from the base platform authentication exceptions.
"""

from app.core.exceptions import AuthException


class InvalidCredentialsException(AuthException):
    """Raised when the username/password comparison fails during validation."""

    def __init__(self, message: str = "Incorrect username or security passphrase.") -> None:
        super().__init__(message=message)


class TokenExpiredException(AuthException):
    """Raised when a JWT access or refresh token has expired."""

    def __init__(self, message: str = "Clearance token validity expired.") -> None:
        super().__init__(message=message)


class InactiveUserException(AuthException):
    """Raised when an active authentication attempt maps to an inactive user account."""

    def __init__(self, message: str = "User account has been locked or suspended.") -> None:
        super().__init__(message=message)
