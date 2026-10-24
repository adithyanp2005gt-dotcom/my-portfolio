"""Education domain package initialisation.

Exports database models, request schemas, repositories, and router modules.
"""

from app.domains.education.models import Education
from app.domains.education.schemas import EducationCreate, EducationResponse, EducationUpdate
from app.domains.education.repository import EducationRepository
from app.domains.education.service import EducationService
from app.domains.education.router import router
