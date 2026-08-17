# authentication/views.py
# -----------------------------------------------------------------------
# Define your authentication-related API views here.
#
# Examples:
#   - LoginView             – POST /api/auth/login/
#   - LogoutView            – POST /api/auth/logout/
#   - RegisterView          – POST /api/auth/register/
#   - PasswordResetView     – POST /api/auth/password-reset/
#   - TokenRefreshView      – POST /api/auth/token/refresh/
#
# Use DRF generics or viewsets:
#   from rest_framework import generics, viewsets
# -----------------------------------------------------------------------

from rest_framework.decorators import api_view  # noqa: F401
from rest_framework.response import Response  # noqa: F401
