"""Communication models package.

Exports:
    CommunicationLog – audit log for messages sent through any channel.
"""

from .communication_log import CommunicationLog

__all__ = ["CommunicationLog"]
