import secrets
from typing import Final

#  OWASP recommends 128-bit minimum for session IDs.
SECURE_TOKEN_BYTE_LENGTH: Final = 128 // 8


def build_token() -> str:
    return secrets.token_urlsafe(SECURE_TOKEN_BYTE_LENGTH)
