"""Framework Core components package initialisation.

Exposes request contexts, middleware setup scripts, custom exceptions,
event bus, dependencies injectors, UOW contexts, validators, and paginator utilities.
"""

from app.core.constants import *
from app.core.request_context import (
    set_request_id,
    get_request_id,
    set_user_id,
    get_user_id,
    set_client_ip,
    get_client_ip,
    set_timezone,
    get_timezone,
    set_locale,
    get_locale,
    set_start_time,
    get_start_time,
    clear_context
)
from app.core.request_id import RequestIdMiddleware
from app.core.middleware import register_middlewares
from app.core.exceptions import (
    PlatformException,
    AuthException,
    ForbiddenException,
    NotFoundException,
    ConcurrencyConflictException,
    register_exception_handlers
)
from app.core.responses import success_response, error_response
from app.core.events import event_bus, Event
from app.core.dependencies import get_db, get_uow, get_current_user, get_current_superuser
from app.core.uow import UnitOfWork, SqlModelUnitOfWork
from app.core.validators import (
    is_valid_slug,
    is_valid_url,
    is_safe_filename,
    is_valid_image_mime,
    is_valid_uuid
)
from app.core.pagination import PageParams, PageResponse
