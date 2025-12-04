# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    health_check,
    update_system_settings,

    # Auth
    LoginView,
    refresh_access_from_cookie,
    logout_view,
    me_view,
    request_password_reset,

    # Admin creation
    create_admin_user,

    # Team management
    create_team_user,
    list_team_users,
    delete_team_user,

    # OTP + password setup
    send_otp,
    verify_otp,
    create_password,

    # CRUD ViewSets
    ExhibitorRegistrationViewSet,
    VisitorRegistrationViewSet,
    CategoryViewSet,
    EventViewSet,
    GalleryImageViewSet,
)

# -----------------------------------------------------------------------------
# DRF Router for CRUD endpoints
# -----------------------------------------------------------------------------
router = DefaultRouter()
router.register(r'exhibitor-registrations', ExhibitorRegistrationViewSet, basename='exhibitor')
router.register(r'visitor-registrations', VisitorRegistrationViewSet, basename='visitor')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'events', EventViewSet, basename='events')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')

# -----------------------------------------------------------------------------
# URL patterns
# -----------------------------------------------------------------------------
urlpatterns = [

    # -----------------------------------
    # Health
    # -----------------------------------
    path('', health_check, name='health'),
    path("system/update/", update_system_settings),
    # -----------------------------------
    # Authentication (Hybrid Method)
    # -----------------------------------
    path('api/login/', LoginView.as_view(), name='login'),
    
    # Refresh access token using HttpOnly cookie
    path('api/token/refresh-cookie/', refresh_access_from_cookie, name='refresh_cookie'),

    # Logout (clear refresh cookie)
    path('api/logout/', logout_view, name='logout'),

    # Fetch logged-in user info (requires access token)
    path('api/me/', me_view, name='me'),

    path("api/password/reset/", request_password_reset),

    # -----------------------------------
    # Admin creation (first time only)
    # -----------------------------------
    path('api/create-admin/', create_admin_user, name='create_admin'),

    # -----------------------------------
    # Team management
    # -----------------------------------
    path('api/team/create/', create_team_user, name='team_create'),
    path('api/team/list/', list_team_users, name='team_list'),
    path('api/team/delete/<int:user_id>/', delete_team_user, name='team_delete'),

    # -----------------------------------
    # OTP + Password Setup
    # -----------------------------------
    path('api/password/send-otp/', send_otp, name='send_otp'),
    path('api/password/verify-otp/', verify_otp, name='verify_otp'),
    path('api/password/create/', create_password, name='create_password'),

    # -----------------------------------
    # CRUD Router
    # -----------------------------------
    path('api/', include(router.urls)),
]
