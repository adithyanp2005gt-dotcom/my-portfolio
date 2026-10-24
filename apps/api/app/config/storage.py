"""Storage initialization settings module for the CMS backend.

This module sets up paths for storing media files on disk and makes sure
that the required folders (images and documents) are initialized.
"""

import os
from app.config.settings import settings


def initialize_storage_directories() -> None:
    """Creates the local directories required for file storage if they do not exist."""
    base_dir = settings.LOCAL_STORAGE_PATH

    # Core uploads sub-directories for segregation
    directories = [
        base_dir,
        os.path.join(base_dir, "images"),
        os.path.join(base_dir, "documents"),
    ]

    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
