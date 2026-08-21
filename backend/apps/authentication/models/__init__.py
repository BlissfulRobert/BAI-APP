# authentication/models/__init__.py
# -----------------------------------------------------------------------
# Public API for the authentication models package.
#
# Re-exports:
#   Invitation  – User invitation with token-based acceptance flow.
# -----------------------------------------------------------------------

from .invitation import Invitation

__all__ = ["Invitation"]