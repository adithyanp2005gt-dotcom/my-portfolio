from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel
from datetime import datetime

T = TypeVar('T')

class ErrorDetail(BaseModel):
    code: str
    message: str

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[ErrorDetail] = None
    meta: dict[str, Any] = {
        "version": "v1",
        "timestamp": datetime.utcnow().isoformat()
    }

def success_response(data: T, meta: Optional[dict[str, Any]] = None) -> dict[str, Any]:
    response_meta = {"version": "v1", "timestamp": datetime.utcnow().isoformat()}
    if meta:
        response_meta.update(meta)
    return {
        "success": True,
        "data": data,
        "error": None,
        "meta": response_meta
    }

def error_response(code: str, message: str) -> dict[str, Any]:
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message
        },
        "meta": {
            "version": "v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    }
