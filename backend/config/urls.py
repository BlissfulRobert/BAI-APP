"""
URL configuration for BAI-APP-1 project.
"""

from django.contrib import admin
from django.urls import include, path
from apps.health.views import HealthView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API routes
    path("api/users/", include("apps.users.urls")),
    path("api/auth/", include("apps.authentication.urls")),

    # check endpoints health
    path("healthz", HealthView.as_view(), name="healthz")
]
