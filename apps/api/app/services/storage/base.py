"""Storage Service abstraction interface module.

This module houses the abstract BaseStorageService class defining the standard
methods required to save, inspect, and delete media files.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class StorageService(ABC):
    """Abstract interface defining standard operations for storage backends."""

    @abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, folder: str) -> Dict[str, Any]:
        """Saves a file, returning standard metadata details.

        Args:
            file_bytes: Binary bytes content of the file.
            filename: The original name of the uploaded file.
            folder: Partition directory category name (e.g. images, documents).

        Returns:
            Dict[str, Any]: Metadata cataloging filename, path, size, MIME type, hashes, etc.
        """
        pass

    @abstractmethod
    def delete_file(self, filepath: str) -> bool:
        """Deletes a file from the active storage backend.

        Args:
            filepath: Relative web path or unique identifier of the file.

        Returns:
            bool: True if deletion succeeds, False if the file does not exist or fails to purge.
        """
        pass
