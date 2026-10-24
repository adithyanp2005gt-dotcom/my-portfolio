"""OpenAPI metadata configuration for the Adithyan Platform CMS API.

This module stores definitions, descriptions, contacts, and license details
displayed in the interactive documentation interface (/docs).
"""

from typing import Any, Dict, List

# Main Application documentation metadata
TITLE: str = "Adithyan Platform API"
VERSION: str = "1.0.0"
DESCRIPTION: str = (
    "Production-grade backend system powering the Adithyan Personal Portfolio website "
    "and CMS administrative dashboard console."
)

CONTACT: Dict[str, str] = {
    "name": "Adithyan Support",
    "email": "adithyan.dev@example.com"
}

LICENSE_INFO: Dict[str, str] = {
    "name": "MIT",
    "url": "https://opensource.org/licenses/MIT"
}

# Swagger tags organization metadata
TAGS_METADATA: List[Dict[str, Any]] = [
    {
        "name": "Authentication",
        "description": "Gateway credentials verification, token refreshes, and session purges."
    },
    {
        "name": "Dashboard",
        "description": "CMS system telemetry, aggregates metrics, and logs summaries."
    },
    {
        "name": "Selected Case Studies",
        "description": "Selected case studies cataloging hardware and software specifications."
    },
    {
        "name": "Skills Registry",
        "description": "Domain expertise category lists and skills."
    },
    {
        "name": "Academic Records",
        "description": "Timeline entries detailing education history, certificates, and coursework."
    },
    {
        "name": "Static Asset Library",
        "description": "Upload and optimize media files, WebP conversion, and thumbnail generation."
    },
    {
        "name": "Contact Messages",
        "description": "Contact message inbox, read, archive, and deletion controls."
    },
    {
        "name": "Operational Status",
        "description": "System diagnostics, database latency metrics, and filesystem uptime checks."
    }
]
