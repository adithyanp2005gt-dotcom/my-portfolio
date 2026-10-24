"""Local Memory caching Service implementation module.

This module stores cache entries inside thread-safe local dictionaries, comparing
access timestamps to automatically invalidate expired cached values.
"""

import time
from typing import Any, Dict, Optional
from app.config.settings import settings
from app.services.cache.base import CacheService


class MemoryCache(CacheService):
    """Simple in-memory caching provider using Python dictionaries and TTL timestamps."""

    def __init__(self) -> None:
        # Dictionary structure: {key: {"value": Any, "expires_at": float}}
        self._store: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Fetches a value from memory cache if not expired.

        Args:
            key: The unique query key string.

        Returns:
            Optional[Any]: Cached value content, or None if miss or expired.
        """
        entry = self._store.get(key)
        if not entry:
            return None

        # Invalidate entry if expires_at time has passed
        if time.time() > entry["expires_at"]:
            self.delete(key)
            return None

        return entry["value"]

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Saves a value in local memory cache with a TTL.

        Args:
            key: The unique query key string.
            value: The data payload to cache.
            ttl: Time To Live in seconds. Defaults to settings.CACHE_DEFAULT_TTL.
        """
        cache_ttl = ttl if ttl is not None else settings.CACHE_DEFAULT_TTL
        expires_at = time.time() + cache_ttl
        
        self._store[key] = {
            "value": value,
            "expires_at": expires_at
        }

    def delete(self, key: str) -> None:
        """Deletes a cached value by its key.

        Args:
            key: The unique query key string.
        """
        if key in self._store:
            del self._store[key]

    def clear(self) -> None:
        """Purges all active cache keys."""
        self._store.clear()
class MemoryCacheService(MemoryCache):
    """Alias for backwards compatibility mapping to MemoryCache."""
    pass
