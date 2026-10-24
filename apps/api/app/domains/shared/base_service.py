"""Generic Base Service class implementation module.

This module houses BaseService, coordinating validations, business logic,
and event publishing across specific vertical slices.
"""

import logging
from app.core.events import Event, event_bus
from app.core.uow import UnitOfWork


class BaseService:
    """Base service class wrapping transactional units of work and event buses."""

    def __init__(self, uow: UnitOfWork) -> None:
        """Initializes the base service.

        Args:
            uow: Injected Unit of Work transaction manager context.
        """
        self.uow = uow
        self.logger = logging.getLogger(f"api.{self.__class__.__name__}")

    async def publish_event(self, event: Event) -> None:
        """Publishes an event to the global system asynchronous Event Bus.

        Args:
            event: Event payload instance to dispatch.
        """
        self.logger.debug(f"Dispatching system event: {event.__class__.__name__}")
        await event_bus.publish(event)
