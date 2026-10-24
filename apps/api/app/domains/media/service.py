"""Media asset business transaction service.

This module houses MediaService, implementing duplicate checking, filesystem writes
via LocalStorageService, image optimizations, and events publishing.
"""

import uuid
import hashlib
from typing import Optional
from app.core.events import MediaUploaded, MediaDeleted
from app.core.exceptions import NotFoundException
from app.core.uow import UnitOfWork
from app.domains.shared.base_service import BaseService
from app.domains.media.models import Media
from app.domains.media.repository import MediaRepository
from app.services.storage.local import LocalStorageService


class MediaService(BaseService):
    """Service governing static asset uploads, processing, and deletions."""

    def __init__(self, uow: UnitOfWork) -> None:
        super().__init__(uow)
        self.repo = MediaRepository(self.uow.session)
        # Instantiate local storage provider
        self.storage = LocalStorageService()

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        folder: str,
        alt_text: Optional[str] = None,
        caption: Optional[str] = None,
        creator_id: Optional[uuid.UUID] = None
    ) -> Media:
        """Runs duplication checking, processes images to WebP, and saves files.

        Args:
            file_bytes: Binary bytes content of the file.
            filename: The original name of the uploaded file.
            folder: Partition category folder name.
            alt_text: Optional accessibility alternative text.
            caption: Optional image description text.
            creator_id: Optional user UUID tracking uploads.

        Returns:
            Media: Created or matched Media database record.
        """
        # Calculate SHA256 to verify unique content
        sha256_hash = hashlib.sha256(file_bytes).hexdigest()
        
        # Check duplicate catalog registry
        existing = self.repo.get_by_sha256(sha256_hash)
        if existing:
            self.logger.info(f"Duplicate file upload detected via checksum: {sha256_hash}")
            return existing

        # Execute physical storage write and conversions
        metadata = self.storage.save_file(file_bytes, filename, folder)

        media = Media(
            filename=metadata["filename"],
            original_name=metadata["original_name"],
            mime_type=metadata["mime_type"],
            size=metadata["size"],
            width=metadata["width"],
            height=metadata["height"],
            aspect_ratio=metadata["aspect_ratio"],
            dominant_color=metadata["dominant_color"],
            folder=metadata["folder"],
            alt_text=alt_text,
            caption=caption,
            sha256=sha256_hash,
            thumbnail_path=metadata["thumbnail_path"],
            filepath=metadata["filepath"],
            created_by=creator_id
        )

        created_media = self.repo.create(media)

        # Notify event listeners
        await self.publish_event(
            MediaUploaded(str(created_media.id), created_media.filename, created_media.folder)
        )
        return created_media

    async def delete_media(self, media_id: uuid.UUID, user_id: Optional[uuid.UUID] = None) -> None:
        """Removes physical files from local disk and soft-deletes database registry.

        Args:
            media_id: Target media record UUID.
            user_id: Optional user UUID tracking deletions.

        Raises:
            NotFoundException: If media log is missing.
        """
        media = self.repo.get_by_id(media_id)
        if not media:
            raise NotFoundException("Media", str(media_id))

        # Purge physical original and thumbnail files from local disk path
        self.storage.delete_file(media.filepath)

        # Soft delete database logging
        self.repo.soft_delete(media_id, user_id)

        # Notify event listeners
        await self.publish_event(MediaDeleted(str(media_id), media.filename))
