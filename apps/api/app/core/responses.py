"""Standardized API JSON response wrappers for the CMS backend.

This module guarantees that both successful returns and error states adhere to
the client-side unified response schema layout.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class SuccessMeta(BaseModel):
    """Metadata block returned inside successful API responses."""
    version: str = "v1"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SuccessResponseModel(BaseModel):
    """Standard success envelope model wrapper."""
    success: bool = True
    data: Any
    meta: SuccessMeta = Field(default_factory=SuccessMeta)


class ErrorDetail(BaseModel):
    """Diagnostic details returned inside error responses."""
    code: str
    message: str


class ErrorResponseModel(BaseModel):
    """Standard error envelope model wrapper."""
    success: bool = False
    error: ErrorDetail


def success_response(data: Any, meta_override: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Builds a standardized successful response dictionary.

    Args:
        data: The payload content to wrap (dictionary, list, or primitive).
        meta_override: Optional metadata updates.

    Returns:
        Dict[str, Any]: Standard success wrapper payload.
    """
    meta = {
        "version": "v1",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    if meta_override:
        meta.update(meta_override)

    return {
        "success": True,
        "data": data,
        "meta": meta
    }


def error_response(code: str, message: str) -> Dict[str, Any]:
    """Builds a standardized error response dictionary.

    Args:
        code: The alphanumeric error code.
        message: The detailed description of the error.

    Returns:
        Dict[str, Any]: Standard error wrapper payload.
    """
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
