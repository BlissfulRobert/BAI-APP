"""Health check views for liveness and readiness probes."""

from django.http import JsonResponse
from django.views import View


class HealthView(View):
    """
    Basic liveness check: is Django responding?
    """
    def get(self, request):
        """Return a JSON response indicating the service is healthy."""
        return JsonResponse({"status": "ok", "service": "BAI-APP"}, status=200)