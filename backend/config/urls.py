from django.contrib import admin
from django.urls import include, path

from apps.health.views import HealthView
from authentication.views import LoginView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Custom login response; must be before dj_rest_auth.urls.
    path("api/auth/login/", LoginView.as_view(), name="rest_login"),

    # dj-rest-auth (login, logout, user, password, etc.)
    path("api/auth/", include("dj_rest_auth.urls")),

     # Your auth app (compliance accounts + invitations)
    path("api/auth/", include("authentication.urls")),

    # Your API
    path("api/users/", include("users.urls")),
    path("api/auth/accounts/", include("authentication.urls")),

    # Health
    path("healthz", HealthView.as_view(), name="healthz"),
]