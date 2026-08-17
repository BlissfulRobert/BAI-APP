"""
URL configuration for BAI-APP-1 project.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # API routes
    path("api/users/", include("users.urls")),
    path("api/auth/", include("authentication.urls")),
]
