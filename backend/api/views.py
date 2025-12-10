# api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.pagination import PageNumberPagination
from rest_framework.settings import api_settings

from django.core.mail import send_mail
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.conf import settings
from .utils import upload_to_s3, delete_from_s3
from django.db import connection, models
import random
import uuid
from datetime import timedelta

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    ExhibitorRegistration,
    VisitorRegistration,
    Category,
    Event,
    GalleryImage,
    PasswordSetupToken,
    SystemSettings,
)
from .serializers import (
    ExhibitorRegistrationSerializer,
    VisitorRegistrationSerializer,
    CategorySerializer,
    EventSerializer,
    GalleryImageSerializer,
    SystemSettingsSerializer,
)
from .utils import CustomTokenObtainPairSerializer, create_tokens_for_user

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
User = get_user_model()

def _set_refresh_cookie(response: Response, refresh_token: str):
    """
    Correct cross-site cookie settings:
    - DEV (localhost on different ports): SameSite=None, Secure=False
    - PROD (real domain + HTTPS): SameSite=None, Secure=True
    """
    DEBUG = getattr(settings, "DEBUG", False)

    if DEBUG:
        # Localhost / different ports → must allow cross-site cookie
        secure = False
        samesite = "None"
    else:
        # Production HTTPS
        secure = True
        samesite = "None"

    max_age_conf = getattr(settings, "SIMPLE_JWT", {}).get(
        "REFRESH_TOKEN_LIFETIME",
        timedelta(days=1)
    )
    max_age = int(max_age_conf.total_seconds())

    response.set_cookie(
        "refresh",
        refresh_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=max_age,
        path="/",
        # domain=".indoglobaltradefair.com"
    )

def _clear_refresh_cookie(response: Response):
    response.delete_cookie("refresh", path="/",
                           #domain=".indoglobaltradefair.com"
                           )

def _user_payload(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": "admin" if user.is_superuser else getattr(user, "role", None),
        "name": user.get_full_name() or user.username,
    }

# -----------------------------------------------------------------------------
# Health & SYSTEM STATUS CHECK
# -----------------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    # DB check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
        db_status = "ok"
    except Exception as e:
        return Response({
            "status": "error",
            "db": str(e),
            "under_maintenance": True,  # Force safe mode
            "date_of_online": None
        }, status=500)

    settings_obj = SystemSettings.get_settings()

    # Apply your rule: date only matters when under maintenance is true
    return Response({
        "status": "ok",
        "db": db_status,
        "under_maintenance": settings_obj.under_maintenance,
        "date_of_online": settings_obj.date_of_online if settings_obj.under_maintenance else None,
    })

# -----------------------------------------------------------------------------
# Login (TokenObtainPair) - override to set refresh cookie and return access + user
# -----------------------------------------------------------------------------
class LoginView(TokenObtainPairView):
    """
    Uses CustomTokenObtainPairSerializer which injects user_id, username,
    email, role into token and response. We override post to set refresh cookie.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        # Our CustomTokenObtainPairSerializer.validate returns:
        # {"refresh": "...", "access": "...", "user": {...}}
        refresh = validated.get("refresh")
        access = validated.get("access")
        user_obj = validated.get("user")

        resp = Response({
            "access": access,
            "user": user_obj,
        }, status=status.HTTP_200_OK)

        if refresh:
            _set_refresh_cookie(resp, refresh)

        return resp

# -----------------------------------------------------------------------------
# Create admin (one-time)
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_user(request):
    """Creates default admin once (if not exists)."""
    if User.objects.filter(username='admin').exists():
        return Response({'message': 'Admin user already exists'})

    # Create using create_superuser to ensure proper flags
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123',
        role='admin'
    )
    return Response({'message': 'Admin user created'})

# -----------------------------------------------------------------------------
# Team management (admin-only)
# -----------------------------------------------------------------------------


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_password_reset(request):
    """
    Authenticated users request a password reset.
    This creates a token and sends the user a reset link:
    frontend.com/reset-password?token=XYZ
    """
    user = request.user

    # Remove old tokens
    PasswordSetupToken.objects.filter(user=user).delete()

    # Create new token
    token_obj = PasswordSetupToken.objects.create(user=user)

    # Build reset link
    frontend = settings.FRONTEND_URL.rstrip("/")
    reset_link = f"{frontend}/reset-password?token={token_obj.token}"

    # Send email
    send_mail(
        "Reset Your Password",
        f"Hello {user.get_full_name() or user.username},\n"
        f"Use this link to reset your password:\n{reset_link}\n\n"
        "This link expires in 24 hours.",
        "no-reply@yourapp.com",
        [user.email]
    )

    return Response({"message": "Password reset link sent"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_team_user(request):
    """Admin-only: Create team member & send password setup email."""
    # require admin role
    if not getattr(request.user, "role", None) == "admin" and not request.user.is_superuser:
        return Response({"detail": "Only admin can create team members"}, status=403)

    name = request.data.get("name")
    email = request.data.get("email")
    role = request.data.get("role")

    if not (name and email and role):
        return Response({"detail": "Name, email & role required"}, status=400)

    if role not in ["manager", "sales"]:
        return Response({"detail": "Invalid role"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "User already exists"}, status=400)

    # Create inactive user with temporary username; they will set real username during password setup
    temp_username = f"pending_{uuid.uuid4().hex[:8]}"
    user = User.objects.create(
        username=temp_username,
        email=email,
        first_name=name,
        role=role,
        is_active=False,
        is_password_set=False
    )
    user.save()

    # Create token linked to user
    token_obj = PasswordSetupToken.objects.create(user=user)

    # Link to frontend
    frontend = settings.FRONTEND_URL.rstrip("/")
    setup_link = f"{frontend}/create-password?token={token_obj.token}"

    # Send email
    send_mail(
        "Set Your Password",
        f"Hello {name},\nUse this link to set your password:\n{setup_link}\nThis link expires in 24 hours.",
        "no-reply@yourapp.com",
        [email]
    )

    return Response({
        "message": "Team member created, invitation sent",
        "email": email,
        "role": role
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_team_users(request):
    """List all non-admin team users (managers & sales)."""
    if not getattr(request.user, "role", None) == "admin" and not request.user.is_superuser:
        return Response({"detail": "Only admin can view team"}, status=403)

    users = User.objects.filter(role__in=["manager", "sales"]).order_by("-date_joined")
    data = [{
        "id": u.id,
        "name": u.get_full_name() or u.username,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "status": "active" if u.is_password_set else "inactive"
    } for u in users]

    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_team_user(request, user_id):
    if not getattr(request.user, "role", None) == "admin" and not request.user.is_superuser:
        return Response({"detail": "Access denied"}, status=403)

    try:
        user = User.objects.get(id=user_id, role__in=["manager", "sales"])
        user.delete()
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)

    return Response({"message": "Team member removed"})

# -----------------------------------------------------------------------------
# OTP flow
# -----------------------------------------------------------------------------
OTP_STORE = {}

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")
    token = request.data.get("token")

    if not (email and token):
        return Response({"detail": "Email & token required"}, status=400)

    try:
        token_obj = PasswordSetupToken.objects.get(token=token)
    except PasswordSetupToken.DoesNotExist:
        return Response({"detail": "Invalid or expired link"}, status=400)

    # token linked to user; verify email matches
    if token_obj.user.email != email:
        return Response({"detail": "Email does not match invitation"}, status=403)

    # Generate OTP
    otp = random.randint(100000, 999999)
    OTP_STORE[email] = {
        "otp": otp,
        "created_at": timezone.now()
    }

    send_mail(
        "Your OTP Code",
        f"Your OTP is {otp}. It expires in 5 minutes.",
        "no-reply@yourapp.com",
        [email]
    )

    return Response({"message": "OTP sent"})

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"detail": "Email & OTP required"}, status=400)

    entry = OTP_STORE.get(email)

    if not entry:
        return Response({"detail": "OTP not found"}, status=400)

    # Check expiry
    if timezone.now() > entry["created_at"] + timedelta(minutes=5):
        OTP_STORE.pop(email, None)
        return Response({"detail": "OTP expired"}, status=400)

    if entry["otp"] != int(otp):
        return Response({"detail": "Invalid OTP"}, status=400)

    return Response({"message": "OTP verified"})

# -----------------------------------------------------------------------------
# Password creation (invite flow) - set password & auto-login (cookie refresh)
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def create_password(request):
    """
    Expected body:
    {
      "email": "...",
      "otp": "123456",
      "password": "newpass",
      "token": "invite-token",
      "username": "desired_username"
    }
    """
    email = request.data.get("email")
    otp = request.data.get("otp")
    password = request.data.get("password")
    token = request.data.get("token")
    username = request.data.get("username")

    if not (email and otp and password and token and username):
        return Response({"detail": "Missing required fields (email, otp, password, token, username)"}, status=400)

    # OTP VALIDATION
    entry = OTP_STORE.get(email)
    if not entry:
        return Response({"detail": "OTP not found"}, status=400)

    if timezone.now() > entry["created_at"] + timedelta(minutes=5):
        OTP_STORE.pop(email, None)
        return Response({"detail": "OTP expired"}, status=400)

    if entry["otp"] != int(otp):
        return Response({"detail": "Invalid OTP"}, status=400)

    # TOKEN VALIDATION (1 DAY)
    try:
        token_obj = PasswordSetupToken.objects.get(token=token)
    except PasswordSetupToken.DoesNotExist:
        return Response({"detail": "Invalid link"}, status=400)

    # token_obj.user is the FK to User
    if token_obj.user.email != email:
        return Response({"detail": "Email mismatch"}, status=403)

    if not token_obj.is_valid():
        return Response({"detail": "Link expired"}, status=400)

    # SET PASSWORD + USERNAME
    user = token_obj.user

    # Check username uniqueness across users (exclude current user)
    if User.objects.filter(username=username).exclude(id=user.id).exists():
        return Response({"detail": "Username already taken"}, status=400)

    user.username = username
    user.set_password(password)
    user.mark_password_set()
    user.save()

    # Cleanup
    OTP_STORE.pop(email, None)
    token_obj.delete()

    # Create tokens and set refresh cookie (so frontend gets access & user only)
    tokens = create_tokens_for_user(user)
    access = tokens["access"]
    refresh = tokens["refresh"]

    resp = Response({
        "message": "Password created successfully",
        "access": access,
        "user": _user_payload(user),
    }, status=status.HTTP_200_OK)

    _set_refresh_cookie(resp, refresh)
    return resp

# -----------------------------------------------------------------------------
# Universal login (username/password) - set cookie + return access+user
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def universal_login(request):
    """
    Single login endpoint that accepts:
    { "username": "...", "password": "..." }
    Uses Django authenticate() which works with the unified User model.
    """
    username = request.data.get("username")
    password = request.data.get("password")

    if not (username and password):
        return Response({"detail": "Username & password required"}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Invalid username or password"}, status=400)

    tokens = create_tokens_for_user(user)
    access = tokens["access"]
    refresh = tokens["refresh"]

    resp = Response({
        "access": access,
        "user": _user_payload(user),
    }, status=status.HTTP_200_OK)

    _set_refresh_cookie(resp, refresh)
    return resp

# -----------------------------------------------------------------------------
# Legacy team_login (email/username) - sets cookie + returns access+user
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def team_login(request):
    """
    Legacy: supports either:
    - { "email": "...", "password": "..." }
    - { "username": "...", "password": "..." }
    """
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    if not password or (not email and not username):
        return Response({"detail": "Email/username & password required"}, status=400)

    try:
        if email:
            user = User.objects.get(email=email)
        else:
            user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=400)

    # ensure password set
    if not user.is_password_set:
        return Response({"detail": "Password not set"}, status=400)

    # check password
    if not user.check_password(password):
        return Response({"detail": "Invalid credentials"}, status=400)

    tokens = create_tokens_for_user(user)
    access = tokens["access"]
    refresh = tokens["refresh"]

    resp = Response({
        "access": access,
        "user": _user_payload(user),
    }, status=status.HTTP_200_OK)

    _set_refresh_cookie(resp, refresh)
    return resp

# -----------------------------------------------------------------------------
# Refresh access token using refresh cookie
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_access_from_cookie(request):
    """
    Reads refresh token from HttpOnly cookie 'refresh' and returns a fresh access token.
    Frontend must call with credentials: 'include'.
    """
    refresh_token = request.COOKIES.get("refresh")
    if not refresh_token:
        return Response({"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)
    except Exception:
        return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({"access": access}, status=status.HTTP_200_OK)

# -----------------------------------------------------------------------------
# Logout - clear refresh cookie
# -----------------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    resp = Response({"message": "logged out"}, status=status.HTTP_200_OK)
    _clear_refresh_cookie(resp)
    return resp

# -----------------------------------------------------------------------------
# Optional: /api/me/ to get server-side user info (requires Authorization with access)
# -----------------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    """
    Returns authenticated user based on:
    1. Authorization: Bearer <access>  (preferred)
    2. Or refresh cookie fallback
    """
    user = request.user

    # If access token is valid → user is authenticated
    if user and user.is_authenticated:
        return Response(_user_payload(user))

    # Otherwise → try refresh cookie fallback
    refresh_token = request.COOKIES.get("refresh")
    if not refresh_token:
        return Response({"detail": "Unauthorized"}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.payload.get("user_id")
        user = User.objects.get(id=user_id)
        return Response(_user_payload(user))
    except Exception:
        return Response({"detail": "Invalid refresh token"}, status=401)


# -----------------------------------------------------------------------------
# CRUD viewsets (unchanged behaviour except permission classes kept)
# -----------------------------------------------------------------------------
class ExhibitorRegistrationViewSet(viewsets.ModelViewSet):
    queryset = ExhibitorRegistration.objects.all().order_by('-created_at')
    serializer_class = ExhibitorRegistrationSerializer
    permission_classes = [AllowAny]


class VisitorRegistrationViewSet(viewsets.ModelViewSet):
    queryset = VisitorRegistration.objects.all().order_by('-created_at')
    serializer_class = VisitorRegistrationSerializer
    permission_classes = [AllowAny]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]

    http_method_names = ['get', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        file_obj = request.FILES.get("image")
        if file_obj:
            url = upload_to_s3(file_obj, folder="categories")
            data["image"] = url

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def perform_destroy(self, instance):
        if instance.image:
            delete_from_s3(instance.image)
        instance.delete()


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_date')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


# ==============================================================
# SYSTEM STATUS TOGGLE AND DATE OF ONLINE UPDATE BY ADMIN
# ==============================================================


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_system_settings(request):
    """
    Admin-only endpoint to update maintenance mode and online date.
    Request body:
    {
        "under_maintenance": true/false,
        "date_of_online": "2025-02-14T12:00:00Z"
    }
    """
    # Only admin/superuser allowed
    user = request.user
    if not (user.is_superuser or getattr(user, "role", None) == "admin"):
        return Response({"detail": "Only admin can update settings"}, status=403)

    settings_obj = SystemSettings.get_settings()
    serializer = SystemSettingsSerializer(settings_obj, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "System settings updated",
            "settings": serializer.data
        })

    return Response(serializer.errors, status=400)

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        # PUBLIC GET allowed
        if request.method == "GET":
            return True

        # UPLOAD/EDIT/DELETE → only admin/manager
        user = request.user
        return (
            user.is_authenticated
            and (user.role in ["admin", "manager"] or user.is_superuser)
        )
        
        
        
class GalleryPagination(PageNumberPagination):
    page_size = 12
    max_page_size = 50
    page_query_param = "p"   # IMPORTANT FIX



class GalleryImageViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAdminOrManager]
    queryset = GalleryImage.objects.all().order_by("page", "section", "display_order", "id")
    pagination_class = GalleryPagination

    http_method_names = ["get", "post", "delete", "head", "options"]

    # FILTERING
    def get_queryset(self):
        qs = GalleryImage.objects.all()
        page = self.request.query_params.get("page")
        section = self.request.query_params.get("section")

        if page:
            qs = qs.filter(page=page)

        if section:
            qs = qs.filter(section=section)

        return qs.order_by("display_order", "id")

    # CREATE 
    def create(self, request, *args, **kwargs):
        page = request.data.get("page")
        section = request.data.get("section")
        image_file = request.FILES.get("image")

        if not page or not section:
            return Response({"error": "page and section are required"}, status=400)

        if not image_file:
            return Response({"error": "Image file is required"}, status=400)

        existing = GalleryImage.objects.filter(page=page, section=section)

        # RULES
        if page == "about" and section == "banner":
            if existing.exists():
                return Response({"error": "Banner allows only 1 image."}, status=400)

        if page == "about" and section in ["why_exhibit", "why_choose_igtf"]:
            if existing.count() >= 10:
                return Response({"error": "Max 10 images allowed."}, status=400)

        if page == "gallery" and section == "main":
            if existing.count() >= 5:
                return Response({"error": "Gallery main allows max 5 images."}, status=400)

        # S3 Upload
        image_url = upload_to_s3(image_file, "gallery")

        # ORDER
        max_order = existing.aggregate(max=models.Max("display_order"))["max"] or 0

        data = {
            "page": page,
            "section": section,
            "image": image_url,
            "display_order": max_order + 1,
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(self.serializer_class(instance).data, status=201)

    # DELETE
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.image:
            delete_from_s3(instance.image)

        instance.delete()

        return Response({"message": "Deleted successfully."}, status=200)

