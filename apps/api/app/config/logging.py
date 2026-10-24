"""Structured JSON logging configuration module for the CMS backend.

This module initializes standard and custom rotating file loggers, formatting
logs in JSON shapes to capture Request-IDs, durations, and client contexts.
"""

import json
import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime, timezone
from app.config.settings import settings


class JsonFormatter(logging.Formatter):
    """Custom logging formatter that serializes log records into structured JSON."""

    def format(self, record: logging.LogRecord) -> str:
        """Formats a LogRecord into a JSON string.

        Args:
            record: The LogRecord instance to format.

        Returns:
            str: JSON serialized log entry.
        """
        # Fetch request-scoped context metrics if stored in extra parameters
        request_id = getattr(record, "request_id", "-")
        endpoint = getattr(record, "endpoint", "-")
        method = getattr(record, "method", "-")
        status_code = getattr(record, "status_code", "-")
        duration = getattr(record, "duration", 0.0)
        user = getattr(record, "user", "-")
        ip = getattr(record, "ip", "-")

        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id,
            "endpoint": endpoint,
            "method": method,
            "status_code": status_code,
            "duration": duration,
            "user": user,
            "ip": ip,
        }

        # Include traceback details if an exception is logged
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_logging() -> None:
    """Configures system-wide structured rotating loggers."""
    log_dir = settings.LOG_DIRECTORY
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    formatter = JsonFormatter()

    # 1. Main API general requests log
    api_handler = RotatingFileHandler(
        os.path.join(log_dir, "api.log"),
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    api_handler.setFormatter(formatter)

    # 2. Audit log tracker
    audit_handler = RotatingFileHandler(
        os.path.join(log_dir, "audit.log"),
        maxBytes=5 * 1024 * 1024,
        backupCount=10,
        encoding="utf-8"
    )
    audit_handler.setFormatter(formatter)

    # 3. Security logs
    security_handler = RotatingFileHandler(
        os.path.join(log_dir, "security.log"),
        maxBytes=5 * 1024 * 1024,
        backupCount=10,
        encoding="utf-8"
    )
    security_handler.setFormatter(formatter)

    # 4. Error log files
    error_handler = RotatingFileHandler(
        os.path.join(log_dir, "error.log"),
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    error_handler.setFormatter(formatter)

    # Base logging configurations
    logging.basicConfig(level=logging.getLevelName(settings.LOG_LEVEL), handlers=[api_handler])

    # Isolated loggers settings
    audit_logger = logging.getLogger("audit")
    audit_logger.setLevel(logging.INFO)
    audit_logger.propagate = False
    audit_logger.addHandler(audit_handler)

    security_logger = logging.getLogger("security")
    security_logger.setLevel(logging.INFO)
    security_logger.propagate = False
    security_logger.addHandler(security_handler)

    error_logger = logging.getLogger("error")
    error_logger.setLevel(logging.ERROR)
    error_logger.propagate = False
    error_logger.addHandler(error_handler)

    # Forward default warnings and errors to error logger handler
    root_logger = logging.getLogger()
    root_logger.addHandler(error_handler)
