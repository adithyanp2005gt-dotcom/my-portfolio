"""Alembic migration runtime environment script.

Configures database connection urls dynamically from active system settings,
providing metadata references for autogenerate tables schema sync.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import settings and registered models metadata
from app.config.settings import settings
from app.db import metadata

# Alembic configuration object referencing ini files settings
config = context.config

# Bind settings logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Override database connection target dynamically using Settings URLs
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Expose metadata mapping registry to enable autogenerate capabilities
target_metadata = metadata


def run_migrations_offline() -> None:
    """Runs migrations in 'offline' mode.

    Configures context with database URLs, outputting SQL statements directly.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Runs migrations in 'online' mode.

    Creates connection engines and executes transactional migration scripts on target databases.
    """
    configuration = config.get_section(config.config_ini_section)
    if not configuration:
        configuration = {}
        
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
