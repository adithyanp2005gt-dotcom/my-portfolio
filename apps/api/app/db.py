"""Central Database registry and metadata aggregator module.

This module imports all persistence database models to register their schemas
onto SQLModel.metadata, allowing Alembic migration engine to detect table changes.
"""

from sqlmodel import SQLModel

# Import all models to guarantee registration on metadata object
from app.domains.auth.models import User
from app.domains.projects.models import Project, Category, Tag, ProjectTag
from app.domains.settings.models import SystemSetting
from app.domains.messages.models import ContactMessage
from app.domains.skills.models import Skill
from app.domains.education.models import Education
from app.domains.media.models import Media

# Expose metadata reference for Alembic's env.py config
metadata = SQLModel.metadata
