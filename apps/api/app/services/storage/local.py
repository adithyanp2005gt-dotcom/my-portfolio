"""Local filesystem Storage Service implementation module.

This module writes uploaded files to local directories, converts heavy images
to optimized WebP files, generates thumbnails, and parses image parameters (e.g. RGB averages).
"""

import os
import uuid
import mimetypes
import hashlib
from datetime import datetime
from io import BytesIO
from typing import Any, Dict
from PIL import Image

from app.config.settings import settings
from app.core.validators import is_valid_image_mime, is_safe_filename
from app.services.storage.base import StorageService


class LocalStorageService(StorageService):
    """Local storage provider writing static assets to disk folders."""

    def __init__(self) -> None:
        self.base_path = settings.LOCAL_STORAGE_PATH

    def _sanitize_filename(self, filename: str) -> str:
        """Sanitizes filename strings, replacing invalid characters with underscores.

        Args:
            filename: The original filename string.

        Returns:
            str: Sanitized filename string.
        """
        name, ext = os.path.splitext(filename)
        # Keep alphanumeric, dot, hyphens, and underscores
        clean_name = "".join(c if c.isalnum() or c in (".", "-", "_") else "_" for c in name)
        # Default fallback for empty base names
        if not clean_name:
            clean_name = "asset_" + uuid.uuid4().hex[:8]
        return f"{clean_name}{ext.lower()}"

    def _get_dominant_color(self, img: Image.Image) -> str:
        """Extracts the dominant color of an image by downscaling it to 1x1.

        Args:
            img: Pillow Image object.

        Returns:
            str: Hexadecimal color code (e.g. #ffffff).
        """
        try:
            # Downscale to 1x1 to average the pixels
            single_pixel = img.convert("RGB").resize((1, 1))
            r, g, b = single_pixel.getpixel((0, 0))
            return f"#{r:02x}{g:02x}{b:02x}"
        except Exception:
            return "#000000"

    def save_file(self, file_bytes: bytes, filename: str, folder: str) -> Dict[str, Any]:
        """Validates, converts, and saves a file locally to disk.

        Args:
            file_bytes: Binary bytes content of the file.
            filename: The original filename string.
            folder: Base directory category (e.g. images, documents).

        Returns:
            Dict[str, Any]: Mapped file details and metadata.
        """
        # Validate filename safety
        if not is_safe_filename(filename):
            filename = f"file_{uuid.uuid4().hex[:8]}{os.path.splitext(filename)[1]}"

        sanitized_name = self._sanitize_filename(filename)
        sha256_hash = hashlib.sha256(file_bytes).hexdigest()

        # Check and resolve MIME type
        mime_type, _ = mimetypes.guess_type(sanitized_name)
        if not mime_type:
            mime_type = "application/octet-stream"

        # Determine dated directories
        now = datetime.now()
        year = now.strftime("%Y")
        month = now.strftime("%m")

        # Segregate target directories by MIME ranges
        sub_folder = "documents"
        is_image = is_valid_image_mime(mime_type)
        if is_image:
            sub_folder = "images"

        target_dir = os.path.join(self.base_path, year, month, sub_folder)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)

        # Append UUID to prevent name collisions
        name_part, ext_part = os.path.splitext(sanitized_name)
        unique_name = f"{name_part}_{uuid.uuid4().hex[:8]}"

        # Initialize image metadata variables
        width, height, aspect_ratio, dominant_color = None, None, None, None
        thumbnail_name, thumbnail_path = None, None

        if is_image:
            # Process and optimize images
            try:
                img = Image.open(BytesIO(file_bytes))
                width, height = img.size
                aspect_ratio = round(width / height, 4) if height > 0 else 1.0
                dominant_color = self._get_dominant_color(img)

                # Force optimization/WebP conversion if enabled or file is heavy
                if settings.ENABLE_MEDIA_OPTIMIZATION:
                    unique_name = f"{unique_name}.webp"
                    mime_type = "image/webp"
                    final_path = os.path.join(target_dir, unique_name)
                    
                    # Save optimized original image as WebP
                    img.save(final_path, "WEBP", quality=settings.IMAGE_QUALITY)
                else:
                    unique_name = f"{unique_name}{ext_part}"
                    final_path = os.path.join(target_dir, unique_name)
                    with open(final_path, "wb") as f:
                        f.write(file_bytes)

                # Generate 512x512 thumbnail
                thumb_size = (settings.THUMBNAIL_WIDTH, settings.THUMBNAIL_HEIGHT)
                thumb_img = img.copy()
                thumb_img.thumbnail(thumb_size)
                
                thumbnail_name = f"{os.path.splitext(unique_name)[0]}_thumb.webp"
                thumbnail_path = os.path.join(target_dir, thumbnail_name)
                thumb_img.save(thumbnail_path, "WEBP", quality=80)
                
                # Normalize thumbnail path
                thumbnail_path = f"/{thumbnail_path.replace(os.sep, '/')}"

            except Exception as e:
                # Fallback to saving raw bytes if Pillow fails
                unique_name = f"{unique_name}{ext_part}"
                final_path = os.path.join(target_dir, unique_name)
                with open(final_path, "wb") as f:
                    f.write(file_bytes)
        else:
            # Save document files raw
            unique_name = f"{unique_name}{ext_part}"
            final_path = os.path.join(target_dir, unique_name)
            with open(final_path, "wb") as f:
                f.write(file_bytes)

        # Normalize relative file path for URL routing
        web_path = f"/{final_path.replace(os.sep, '/')}"
        file_size = os.path.getsize(final_path)

        return {
            "filename": unique_name,
            "original_name": filename,
            "mime_type": mime_type,
            "size": file_size,
            "filepath": web_path,
            "sha256": sha256_hash,
            "width": width,
            "height": height,
            "aspect_ratio": aspect_ratio,
            "dominant_color": dominant_color,
            "thumbnail_path": thumbnail_path,
            "folder": folder
        }

    def delete_file(self, filepath: str) -> bool:
        """Deletes a file and its corresponding thumbnail from the local disk.

        Args:
            filepath: Relative web path of the file (e.g. /uploads/2026/07/images/file.webp).

        Returns:
            bool: True if deleted successfully, False if file doesn't exist.
        """
        # Strip leading slash to match disk paths
        local_path = filepath.lstrip("/")
        deleted = False

        if os.path.exists(local_path):
            try:
                os.remove(local_path)
                deleted = True
            except OSError:
                pass

        # Try to delete associated thumbnail if it's an image
        thumb_name, ext = os.path.splitext(local_path)
        thumb_path = f"{thumb_name}_thumb.webp"
        if os.path.exists(thumb_path):
            try:
                os.remove(thumb_path)
            except OSError:
                pass

        return deleted
