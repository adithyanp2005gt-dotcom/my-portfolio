import os
import logging
from logging.handlers import RotatingFileHandler

def setup_logging():
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Standard formatter configuration
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] - %(message)s'
    )

    # Base Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # Rotating file handler for standard logs
    api_handler = RotatingFileHandler(
        os.path.join(log_dir, "api.log"), maxBytes=10*1024*1024, backupCount=5
    )
    api_handler.setFormatter(formatter)
    api_handler.setLevel(logging.INFO)
    root_logger.addHandler(api_handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)

    # Separate logger for audit logs
    audit_logger = logging.getLogger("audit")
    audit_logger.setLevel(logging.INFO)
    audit_logger.propagate = False # prevent logging audit trail to api.log

    audit_handler = RotatingFileHandler(
        os.path.join(log_dir, "audit.log"), maxBytes=5*1024*1024, backupCount=10
    )
    audit_handler.setFormatter(logging.Formatter('[%(asctime)s] - %(message)s'))
    audit_logger.addHandler(audit_handler)
