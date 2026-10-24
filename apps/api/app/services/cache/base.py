"""Cache Service abstraction interface module.

This module houses the abstract BaseCacheService class defining the standard
methods required to store, fetch, invalidate, and clear cache entries.
"""

from abc import ABC, abstractmethod
from typing import Any, Optional


class CacheService(ABC):
    """Abstract interface defining standard operations for cache backends."""

    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        """Fetches a value from cache by its key descriptor.

        Args:
            key: The unique query key string.

        Returns:
            Optional[Any]: Cached value content if hit and not expired, None otherwise.
        """
        pass

    @abstractmethod
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Saves a value in cache with a designated TTL.

        Args:
            key: The unique query key string.
            value: The data payload to cache.
            ttl: Time To Live in seconds. If None, uses settings.CACHE_DEFAULT_TTL.
        """
        pass

    @abstractmethod
    def delete(self, key: str) -> None:
        """Deletes a cached value by its key.

        Args:
            key: The unique query key string.
        """
        pass

    @abstractmethod
    def clear(self) -> None:
        """Purges all entries from the active cache storage."""
        pass
