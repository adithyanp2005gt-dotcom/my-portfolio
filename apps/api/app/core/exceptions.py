"""Global exceptions definitions and middleware handlers for the CMS backend.

This module maps domain-specific errors, HTTP violations, and Pydantic validation
failures to unified API response shapes using custom HTTP exception handlers.
"""

import logging
from typing import Any, Dict
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.core.constants import (
    ERR_UNAUTHORIZED,
    ERR_FORBIDDEN,
    ERR_NOT_FOUND,
    ERR_VALIDATION,
    ERR_OPTIMISTIC_LOCK,
    ERR_INTERNAL_SERVER,
)
from app.core.responses import error_response

# Reference logger bound to app/config/logging.py
error_logger = logging.getLogger("error")


class PlatformException(Exception):
    """Base exception class for all custom domain errors."""

    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        """Initializes the base platform exception.

        Args:
            code: Internal alphanumeric error code.
            message: Descriptive message detailing the issue.
            status_code: HTTP status code to return.
        """
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class AuthException(PlatformException):
    """Raised during login credentials failures or JWT clearance validation anomalies."""

    def __init__(self, message: str = "Access credentials verification failed.") -> None:
        super().__init__(
            code=ERR_UNAUTHORIZED,
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(PlatformException):
    """Raised when an authenticated user attempts to execute actions beyond authorization levels."""

    def __init__(self, message: str = "Clearance levels insufficient for this action.") -> None:
        super().__init__(
            code=ERR_FORBIDDEN,
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )


class NotFoundException(PlatformException):
    """Raised when a query entity cannot be resolved in the database layer."""

    def __init__(self, entity_name: str, identifier: Any) -> None:
        super().__init__(
            code=ERR_NOT_FOUND,
            message=f"The requested {entity_name} identified by '{identifier}' does not exist.",
            status_code=status.HTTP_404_NOT_FOUND
        )


class ConcurrencyConflictException(PlatformException):
    """Raised when an optimistic locking version conflict is detected during updates."""

    def __init__(self, entity_name: str, identifier: Any) -> None:
        super().__init__(
            code=ERR_OPTIMISTIC_LOCK,
            message=f"Concurrency Conflict: The {entity_name} '{identifier}' was updated by another process.",
            status_code=status.HTTP_409_CONFLICT
        )


def register_exception_handlers(app: FastAPI) -> None:
    """Hooks exception filters onto the FastAPI application interface.

    Args:
        app: The active FastAPI application instance.
    """

    @app.exception_handler(PlatformException)
    async def platform_exception_handler(request: Request, exc: PlatformException) -> JSONResponse:
        """Handles custom Platform Exceptions."""
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(code=exc.code, message=exc.message)
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Handles request validation errors and compiles diagnostic feedback."""
        # Compile validation errors lists into a readable payload string
        error_details = []
        for error in exc.errors():
            loc = " -> ".join(str(l) for l in error.get("loc", []))
            msg = error.get("msg", "invalid value")
            error_details.append(f"[{loc}]: {msg}")

        compiled_message = "; ".join(error_details)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_response(code=ERR_VALIDATION, message=compiled_message)
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Catches and handles unhandled python runtime exceptions."""
        # Log error traces to file
        error_logger.exception("Global Unhandled Exception Intercepted")
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response(
                code=ERR_INTERNAL_SERVER,
                message="An unexpected server anomaly occurred. Logs record this instance."
            )
        )
