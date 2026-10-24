"""Asynchronous Event Bus and portfolio events declarations module.

This module houses the central Event Bus class, defining portfolio-scoped
events and registering asynchronous background listeners.
"""

import asyncio
import logging
from typing import Any, Callable, Coroutine, Dict, List, Type


class Event:
    """Base class for all system-wide events."""
    pass


# Domain Event Definitions
class UserLoggedIn(Event):
    """Fired when a user session is validated successfully."""
    def __init__(self, user_id: str, username: str) -> None:
        self.user_id = user_id
        self.username = username


class UserLoggedOut(Event):
    """Fired when an active user session is terminated."""
    def __init__(self, user_id: str) -> None:
        self.user_id = user_id


class ProjectCreated(Event):
    """Fired when a new case study is registered."""
    def __init__(self, project_id: str, title: str) -> None:
        self.project_id = project_id
        self.title = title


class ProjectUpdated(Event):
    """Fired when project metadata changes."""
    def __init__(self, project_id: str, title: str) -> None:
        self.project_id = project_id
        self.title = title


class ProjectPublished(Event):
    """Fired when a project state is set to published."""
    def __init__(self, project_id: str) -> None:
        self.project_id = project_id


class ProjectArchived(Event):
    """Fired when a project state is set to archived."""
    def __init__(self, project_id: str) -> None:
        self.project_id = project_id


class ProjectDeleted(Event):
    """Fired when a project is soft-deleted."""
    def __init__(self, project_id: str) -> None:
        self.project_id = project_id


class MediaUploaded(Event):
    """Fired when a static asset is stored on disk."""
    def __init__(self, media_id: str, filename: str, folder: str) -> None:
        self.media_id = media_id
        self.filename = filename
        self.folder = folder


class MediaDeleted(Event):
    """Fired when a media asset log is soft-deleted and purged from disk."""
    def __init__(self, media_id: str, filename: str) -> None:
        self.media_id = media_id
        self.filename = filename


class SettingsUpdated(Event):
    """Fired when global platform settings parameters are modified."""
    def __init__(self, section: str) -> None:
        self.section = section


class MessageReceived(Event):
    """Fired when a contact message submission is received."""
    def __init__(self, message_id: str, sender_name: str, email: str) -> None:
        self.message_id = message_id
        self.sender_name = sender_name
        self.email = email


# Signature definition for async listener callables
ListenerType = Callable[[Any], Coroutine[Any, Any, None]]

logger = logging.getLogger("api")


class EventBus:
    """Asynchronous local event router linking event triggers to background handlers."""

    def __init__(self) -> None:
        self._listeners: Dict[Type[Event], List[ListenerType]] = {}

    def subscribe(self, event_type: Type[Event], listener: ListenerType) -> None:
        """Subscribes an asynchronous listener handler to an event type.

        Args:
            event_type: The Event subclass to monitor.
            listener: Async callback function.
        """
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(listener)

    async def publish(self, event: Event) -> None:
        """Publishes an event, executing all registered listeners concurrently.

        Args:
            event: The Event instance to dispatch.
        """
        event_type = type(event)
        listeners = self._listeners.get(event_type, [])
        if not listeners:
            return

        # Execute listeners in background tasks concurrently
        tasks = []
        for listener in listeners:
            tasks.append(self._safe_execute(listener, event))
        await asyncio.gather(*tasks)

    async def _safe_execute(self, listener: ListenerType, event: Event) -> None:
        """Executes a single listener callback, handling exceptions safely.

        Args:
            listener: The listener async callable.
            event: The Event payload.
        """
        try:
            await listener(event)
        except Exception:
            # Capture background errors in root api logs
            logger.exception(f"Background Event Listener Exception in: {listener.__name__}")


# Single global EventBus instance exported across service boundaries
event_bus = EventBus()
