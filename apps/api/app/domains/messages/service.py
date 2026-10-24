"""Contact message inbox business transactions service.

This module houses MessageService, executing status transitions (read/starred/archived)
and publishing submission notification events.
"""

import uuid
from typing import Optional, Any
from app.core.events import MessageReceived
from app.core.exceptions import NotFoundException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.messages.models import ContactMessage
from app.domains.messages.repository import MessageRepository


class MessageService(BaseService):
    """Service governing contact form inbox transactions."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.repo = MessageRepository(self.uow.session)

    async def receive_message(self, payload: Any) -> ContactMessage:
        """Saves a contact message and publishes the receipt event.

        Args:
            payload: MessageCreate payload.

        Returns:
            ContactMessage: The saved ContactMessage model.
        """
        message = ContactMessage(
            sender_name=payload.sender_name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message
        )
        created = self.repo.create(message)
        
        # Publish event
        await self.publish_event(
            MessageReceived(str(created.id), created.sender_name, created.email)
        )
        return created

    async def mark_read(self, message_id: uuid.UUID) -> ContactMessage:
        """Sets a message is_read status to True.

        Args:
            message_id: Unique message UUID.

        Returns:
            ContactMessage: Updated message.
        """
        message = self.repo.get_by_id(message_id)
        if not message:
            raise NotFoundException("Message", str(message_id))

        message.is_read = True
        return self.repo.update(message)

    async def mark_unread(self, message_id: uuid.UUID) -> ContactMessage:
        """Sets a message is_read status to False.

        Args:
            message_id: Unique message UUID.

        Returns:
            ContactMessage: Updated message.
        """
        message = self.repo.get_by_id(message_id)
        if not message:
            raise NotFoundException("Message", str(message_id))

        message.is_read = False
        return self.repo.update(message)

    async def toggle_star(self, message_id: uuid.UUID) -> ContactMessage:
        """Toggles a message starred state flag.

        Args:
            message_id: Unique message UUID.

        Returns:
            ContactMessage: Updated message.
        """
        message = self.repo.get_by_id(message_id)
        if not message:
            raise NotFoundException("Message", str(message_id))

        message.is_starred = not message.is_starred
        return self.repo.update(message)

    async def archive_message(self, message_id: uuid.UUID) -> ContactMessage:
        """Sets a message is_archived status to True.

        Args:
            message_id: Unique message UUID.

        Returns:
            ContactMessage: Updated message.
        """
        message = self.repo.get_by_id(message_id)
        if not message:
            raise NotFoundException("Message", str(message_id))

        message.is_archived = True
        return self.repo.update(message)

    async def delete_message(self, message_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> None:
        """Soft deletes a message record.

        Args:
            message_id: Unique message UUID.
            user_id: Optional user UUID tracking deletion.
        """
        if not self.repo.exists(message_id):
            raise NotFoundException("Message", str(message_id))
        self.repo.soft_delete(message_id, user_id)
