"""Diagnostics health check DTO schemas validation module.

This module validates payload structures returning operational states, database latencies,
and filesystem uptimes.
"""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Payload returning active status diagnostics of backend components."""
    status: str = Field(default="healthy", description="General system health status.")
    api: str = Field(default="online", description="API server online indicator.")
    database: str = Field(..., description="Database connection health indicator.")
    storage: str = Field(..., description="Filesystem storage health indicator.")
    version: str = Field(..., description="Application version metadata.")
    uptime: str = Field(..., description="Active server uptime format string.")
    timezone: str = Field(default="UTC", description="Default server timezone.")
