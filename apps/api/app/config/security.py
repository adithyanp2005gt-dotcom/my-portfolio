"""Security cryptography configuration module for the CMS backend.

This module initializes password hashing schemas using passlib and Argon2,
and controls JWT token creation, expiration rules, and claims extraction.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config.settings import settings

# Initialize password hashing using the Argon2 algorithm context
pwd_context = CryptContext(schemes=[settings.PASSWORD_HASH_SCHEME], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against its Argon2 hashed equivalent.

    Args:
        plain_password: The unhashed password string.
        hashed_password: The hashed password string from the database.

    Returns:
        bool: True if passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generates an Argon2 hash of a plain text password.

    Args:
        password: The plain text password string.

    Returns:
        str: Hashed password string.
    """
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a JWT Access Token.

    Args:
        subject: The subject claim (usually user ID).
        expires_delta: Optional override for default expiration limits.

    Returns:
        str: Encoded JWT string.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    claims = {
        "exp": expire,
        "sub": str(subject),
        "type": "access"
    }
    encoded_jwt = jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a JWT Refresh Token used to obtain fresh access tokens.

    Args:
        subject: The subject claim (usually user ID).
        expires_delta: Optional override for default expiration limits.

    Returns:
        str: Encoded JWT string.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    claims = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh"
    }
    encoded_jwt = jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a JWT token.

    Args:
        token: The encoded JWT token string.

    Returns:
        Optional[Dict[str, Any]]: Decoded payload claims dictionary, or None if validation fails.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
