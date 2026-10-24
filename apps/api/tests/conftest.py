"""Testing fixtures configuration for the API test suite.

This module initializes in-memory databases, registers mock connections overrides,
and yields clean client instances before running test suites.
"""

import pytest
import os
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel

# Configure dummy test settings environment
os.environ["SECRET_KEY"] = "TEST_SECRET_KEY_MUST_BE_SECURE_MIN_32_CHARS_LONG"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["LOG_LEVEL"] = "WARNING"
os.environ["LOG_JSON"] = "False"
os.environ["CACHE_PROVIDER"] = "memory"

from app.main import app
from app.config.database import get_db_session
from app.config.security import get_password_hash
from app.domains.auth.models import User

# In-memory SQLite connection engine configuration
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)


@pytest.fixture(name="db_session")
def db_session_fixture() -> Generator[Session, None, None]:
    """Yields a clean, isolated database session.

    Creates schemas before testing, flushing updates on exit.
    """
    SQLModel.metadata.create_all(test_engine)
    with Session(test_engine) as session:
        yield session
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture(name="client")
def client_fixture(db_session: Session) -> Generator[TestClient, None, None]:
    """Yields a FastAPI TestClient with database session overrides.

    Args:
        db_session: Injected test database session fixture.
    """
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    from app.core.dependencies import get_db

    # Override target dependencies checks
    app.dependency_overrides[get_db] = _override_get_db
    app.dependency_overrides[get_db_session] = _override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.clear()


@pytest.fixture(name="seeded_admin")
def seeded_admin_fixture(db_session: Session) -> User:
    """Seeds a test admin account into the session database.

    Args:
        db_session: Injected test database session.

    Returns:
        User: Created user record.
    """
    hashed_pw = get_password_hash("admin")
    admin = User(
        username="admin",
        email="admin@example.com",
        password_hash=hashed_pw,
        is_superuser=True,
        is_active=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin
