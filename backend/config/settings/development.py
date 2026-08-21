"""
Development settings for BAI-APP-1 project.

Extends base.py with local development configurations (DEBUG=True,
permissive CORS settings, and local database settings).
"""
from .base import *

DEBUG = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]