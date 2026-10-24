"""Initial database seeding module.

Checks for accounts existence and seeds the initial administrator credentials
on the first boot of the application.
"""

import sys
import logging
from sqlmodel import Session, select, func
from app.config.security import get_password_hash
from app.domains.auth.models import User

logger = logging.getLogger("api")


def seed_initial_admin(db: Session) -> None:
    """Verifies user counts and seeds a default administrator.

    Args:
        db: SQLModel Session connection.
    """
    try:
        # Check total active users count
        statement = select(func.count(User.id))
        user_count = db.exec(statement).one() or 0

        if user_count == 0:
            logger.warning(
                "======================================================================\n"
                "[SECURITY WARNING]: No accounts exist in the database. Seeding default admin...\n"
                "  - Username: admin\n"
                "  - Password: admin\n"
                "PLEASE ROTATE THE DEFAULT PASSWORD IMMEDIATELY UPON LOGGING IN.\n"
                "======================================================================"
            )
            
            # Print to stdout directly to guarantee visibility in terminal
            print(
                "\n!!! [SECURITY WARNING] !!!\n"
                "Default administrator user created!\n"
                "Username: admin\n"
                "Password: admin\n"
                "Rotate this password immediately in production environments.\n",
                file=sys.stderr
            )

            # Generate password hash using Argon2
            hashed_pw = get_password_hash("admin")
            
            admin_user = User(
                username="admin",
                email="admin@example.com",
                password_hash=hashed_pw,
                is_active=True,
                is_superuser=True
            )
            
            db.add(admin_user)
            db.commit()
            logger.info("Default administrator account successfully seeded.")
        else:
            logger.info("Database verification: user accounts exist. Seeding skipped.")

    except Exception:
        logger.exception("Failed to execute initial database seeding script.")
