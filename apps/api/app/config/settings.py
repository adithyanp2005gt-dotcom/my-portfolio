"""Configuration Settings module for the Adithyan Platform CMS backend.

This module defines the Settings class which reads configurations from the environment
variables and .env files, performing type-safety validations on system boundaries.
"""

import os
from typing import List
from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """System-wide configuration settings loaded from environment variables and environment files."""

    # --------------------------------------------------------------------------
    # Application Configuration
    # --------------------------------------------------------------------------
    APP_ENV: str = "development"
    APP_NAME: str = "Adithyan Platform API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    DEFAULT_TIMEZONE: str = "UTC"

    # --------------------------------------------------------------------------
    # Security Configuration
    # --------------------------------------------------------------------------
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_HASH_SCHEME: str = "argon2"

    # --------------------------------------------------------------------------
    # CORS Configuration
    # --------------------------------------------------------------------------
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:4173,http://localhost:3000"
    ALLOWED_METHODS: str = "*"
    ALLOWED_HEADERS: str = "*"
    ALLOW_CREDENTIALS: bool = True

    @property
    def cors_origins(self) -> List[str]:
        """Parses the ALLOWED_ORIGINS comma-separated string into a list of strings."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def cors_methods(self) -> List[str]:
        """Parses the ALLOWED_METHODS comma-separated string into a list of strings."""
        return [method.strip() for method in self.ALLOWED_METHODS.split(",") if method.strip()]

    @property
    def cors_headers(self) -> List[str]:
        """Parses the ALLOWED_HEADERS comma-separated string into a list of strings."""
        return [header.strip() for header in self.ALLOWED_HEADERS.split(",") if header.strip()]

    # --------------------------------------------------------------------------
    # Database Configuration
    # --------------------------------------------------------------------------
    DATABASE_URL: str = "sqlite:///database.db"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800
    DB_ECHO: bool = False

    # --------------------------------------------------------------------------
    # Upload & Optimization Configuration
    # --------------------------------------------------------------------------
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    IMAGE_QUALITY: int = 90
    THUMBNAIL_WIDTH: int = 512
    THUMBNAIL_HEIGHT: int = 512

    # --------------------------------------------------------------------------
    # Cache Configuration
    # --------------------------------------------------------------------------
    CACHE_PROVIDER: str = "memory"
    CACHE_DEFAULT_TTL: int = 300
    REDIS_URL: str = "redis://localhost:6379/0"

    # --------------------------------------------------------------------------
    # Email (SMTP) Configuration
    # --------------------------------------------------------------------------
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    # --------------------------------------------------------------------------
    # Storage Configuration
    # --------------------------------------------------------------------------
    STORAGE_PROVIDER: str = "local"
    LOCAL_STORAGE_PATH: str = "uploads"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = ""
    AWS_BUCKET: str = ""

    # --------------------------------------------------------------------------
    # Logging Configuration
    # --------------------------------------------------------------------------
    LOG_LEVEL: str = "INFO"
    LOG_JSON: bool = True
    LOG_DIRECTORY: str = "logs"

    # --------------------------------------------------------------------------
    # Monitoring Configuration
    # --------------------------------------------------------------------------
    ENABLE_REQUEST_LOGGING: bool = True
    ENABLE_AUDIT_LOGGING: bool = True
    ENABLE_SECURITY_LOGGING: bool = True

    # --------------------------------------------------------------------------
    # Health Checks Configuration
    # --------------------------------------------------------------------------
    HEALTH_CHECK_CACHE: bool = True
    HEALTH_CHECK_STORAGE: bool = True

    # --------------------------------------------------------------------------
    # Rate Limiting Configuration
    # --------------------------------------------------------------------------
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # --------------------------------------------------------------------------
    # Default Admin Seeding Configuration
    # --------------------------------------------------------------------------
    DEFAULT_ADMIN_USERNAME: str = "admin"
    DEFAULT_ADMIN_PASSWORD: str = "admin"

    # --------------------------------------------------------------------------
    # Frontend Configurations
    # --------------------------------------------------------------------------
    PORTFOLIO_URL: str = "http://localhost:5173"
    ADMIN_URL: str = "http://localhost:4173"

    # --------------------------------------------------------------------------
    # Server Listener Configurations
    # --------------------------------------------------------------------------
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # --------------------------------------------------------------------------
    # Feature Flags Configuration
    # --------------------------------------------------------------------------
    ENABLE_ANALYTICS: bool = True
    ENABLE_SEARCH: bool = False
    ENABLE_MEDIA_OPTIMIZATION: bool = True

    # Configure Pydantic to read environment files dynamically
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development", ".env.production"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Centralized settings instance exported across modules
settings = Settings()
