"""Central HTTP request pipelines, timers, and CORS middlewares.

This module processes logging transactions, records metrics (such as duration,
IP address, and status codes), and resets context variables after requests complete.
"""

import time
import logging
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.config.settings import settings
from app.core.request_context import (
    clear_context,
    set_client_ip,
    set_locale,
    set_start_time,
    set_timezone,
    get_request_id
)

# Reference the root API logger configured in app/config/logging.py
logger = logging.getLogger("api")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to track request processing durations and log transactions in structured JSON."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Benchmarks request performance, registers context metadata, and logs outcomes.

        Args:
            request: The incoming HTTP request.
            call_next: The downstream endpoint router function.

        Returns:
            Response: Outgoing HTTP response with duration metrics attached.
        """
        # Save request parameters to thread-local variables
        start_time = time.perf_counter()
        set_start_time(datetime.now(timezone.utc))
        set_client_ip(request.client.host if request.client else "0.0.0.0")
        
        # Read locale and timezone headers
        set_timezone(request.headers.get("X-Timezone", "UTC"))
        set_locale(request.headers.get("X-Locale", "en_US"))

        response = Response(status_code=500)
        try:
            response = await call_next(request)
        finally:
            # Calculate execution duration
            duration = time.perf_counter() - start_time
            response.headers["X-Process-Time"] = f"{duration:.4f}s"

            # Parse user reference from state if injected by auth dependency
            user_ref = "-"
            if hasattr(request.state, "user") and request.state.user:
                user_ref = str(request.state.user.id)

            # Log request details using JSON format
            log_extra = {
                "request_id": get_request_id(),
                "endpoint": request.url.path,
                "method": request.method,
                "status_code": response.status_code,
                "duration": duration,
                "user": user_ref,
                "ip": request.client.host if request.client else "0.0.0.0"
            }

            if response.status_code >= 400:
                logger.error(
                    f"HTTP Request Failure: {request.method} {request.url.path}",
                    extra=log_extra
                )
            else:
                logger.info(
                    f"HTTP Request Success: {request.method} {request.url.path}",
                    extra=log_extra
                )

            # Essential context cleanup to prevent memory/thread leakage
            clear_context()

        return response


def register_middlewares(app: FastAPI) -> None:
    """Configures global CORS settings and request loggers on the FastAPI application.

    Args:
        app: The active FastAPI application instance.
    """
    # 1. Register CORS configurations
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.ALLOW_CREDENTIALS,
        allow_methods=settings.cors_methods,
        allow_headers=settings.cors_headers,
    )

    # 2. Add performance tracking loggers middleware
    app.add_middleware(LoggingMiddleware)
