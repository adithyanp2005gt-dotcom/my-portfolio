"""Database engine and session factory configuration for the CMS backend.

This module initializes the SQLAlchemy connection engine and sessionmaker,
supporting custom connection pools, connection recycling, and engine logging.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
from app.config.settings import settings

# Determine database engine specifics (e.g. SQLite thread sharing rules)
is_sqlite = settings.DATABASE_URL.startswith("sqlite")

# Connection arguments required for local SQLite database file locks
connect_args = {"check_same_thread": False} if is_sqlite else {}

# Connection pooling variables are bypassed for SQLite database engine
engine_kwargs = {}
if not is_sqlite:
    engine_kwargs = {
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "pool_timeout": settings.DB_POOL_TIMEOUT,
        "pool_recycle": settings.DB_POOL_RECYCLE,
    }

# Create SQLModel engine instance
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    connect_args=connect_args,
    **engine_kwargs
)

# Custom SessionMaker factory bound to the SQLModel connection engine
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session
)


def get_db_session() -> Generator[Session, None, None]:
    """Generates transactional sessions for database operations.

    Yields:
        Session: Active SQLModel transactional session.
    """
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
