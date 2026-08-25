# authentication/urls.py
# -----------------------------------------------------------------------
# Wire up your authentication-related API endpoints here.
#
# Example:
#   urlpatterns = [
#       path("login/", views.LoginView.as_view(), name="auth-login"),
#       path("logout/", views.LogoutView.as_view(), name="auth-logout"),
#       path("register/", views.RegisterView.as_view(), name="auth-register"),
#   ]
# -----------------------------------------------------------------------

from django.urls import path
from authentication.views import ComplianceAccountCreateView, SendInviteView ,InvitationValidateView, InvitationAcceptView, InvitationResendView, InvitationRevokeView

urlpatterns = [
    path(
        "compliance/",
        ComplianceAccountCreateView.as_view(),
        name="auth-account-compliance-create",
    ),

    # Send Invite (Compliance-only)
    path(
        "invitations/send/",
        SendInviteView.as_view(),
        name="send-invite"
    ),

    # Invitation flow (public)
    path(
        "invitations/validate/",
         InvitationValidateView.as_view(),
         name="invitation-validate"
    ),
    path(
        "invitations/accept/",
        InvitationAcceptView.as_view(), name="invitation-accept"
    ),

    # Invitation management (Compliance-only - will work on later)
    path("invitations/<uuid:pk>/resend/",
          InvitationResendView.as_view(),
          name="invitation-resend"
    ),
    path("invitations/<uuid:pk>/revoke/",
          InvitationRevokeView.as_view(),
          name="invitation-revoke"
    )
]