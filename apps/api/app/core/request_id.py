"""Request ID generation and response injection middleware module.

This module guarantees that every request has a tracking ID associated with it,
attaching it to headers and request variables to maintain traceability in logs.
"""

import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from app.core.request_context import set_request_id


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Middleware to assign a unique transaction tracking ID to every HTTP request."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Processes request headers, injecting a unique request ID.

        Args:
            request: The incoming Starlette/FastAPI HTTP request.
            call_next: The downstream endpoint router function.

        Returns:
            Response: Outgoing HTTP response with request ID headers attached.
        """
        # Read request ID from header or generate a new UUID4 string if missing
        request_id = request.headers.get("X-Request-ID")
        if not request_id:
            request_id = str(uuid.uuid4())

        # Set the request ID in thread-local request context
        set_request_id(request_id)

        # Proceed down the execution pipeline
        response = await call_next(request)

        # Attach the request ID to the outgoing response headers
        response.headers["X-Request-ID"] = request_id
        return response
