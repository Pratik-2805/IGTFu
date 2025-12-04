import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from datetime import timedelta


# -----------------------
# TOKEN HELPER
# -----------------------
def generate_token():
    return uuid.uuid4().hex


# =====================================================
# UNIFIED USER MODEL (Admin + Manager + Sales)
# =====================================================
class User(AbstractUser):
    ROLE_ADMIN = "admin"
    ROLE_MANAGER = "manager"
    ROLE_SALES = "sales"

    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_MANAGER, "Manager"),
        (ROLE_SALES, "Sales"),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_SALES)
    is_password_set = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["email"]

    def save(self, *args, **kwargs):
        # 🔥 Auto-fix: ANY superuser always gets role="admin"
        if self.is_superuser:
            self.role = self.ROLE_ADMIN
        super().save(*args, **kwargs)

    def mark_password_set(self):
        self.is_password_set = True
        self.is_active = True
        self.save(update_fields=["is_password_set", "is_active"])

    def __str__(self):
        return f"{self.username} ({self.role})"


# =====================================================
# PASSWORD SETUP TOKEN
# =====================================================
class PasswordSetupToken(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="password_tokens")
    token = models.CharField(max_length=255, default=generate_token, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() - self.created_at < timedelta(days=1)

    def __str__(self):
        return f"{self.user.email} - {self.token}"


# =====================================================
# EXHIBITOR REGISTRATION
# =====================================================
class ExhibitorRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    event_location = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    contact_person_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    email_address = models.EmailField()
    contact_number = models.CharField(max_length=20)
    product_category = models.CharField(max_length=255)
    company_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} - {self.contact_person_name}"


# =====================================================
# VISITOR REGISTRATION
# =====================================================
class VisitorRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    event_location = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    email_address = models.EmailField()
    phone_number = models.CharField(max_length=20)
    industry_interest = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company_name}"


# =====================================================
# CATEGORY
# =====================================================
class Category(models.Model):
    name = models.CharField(max_length=200)
    image = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


# =====================================================
# EVENT
# =====================================================
class Event(models.Model):
    title = models.CharField(max_length=200)
    location = models.TextField()
    venue = models.CharField(max_length=200, default="")
    start_date = models.DateField()
    end_date = models.DateField()
    time_schedule = models.CharField(max_length=100, default="10:00 AM - 7:00 PM")
    exhibitors_count = models.CharField(max_length=50, default="400+")
    buyers_count = models.CharField(max_length=50, default="6000+")
    countries_count = models.CharField(max_length=50, default="40+")
    sectors_count = models.CharField(max_length=50, default="16")
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return self.title


# =====================================================
# GALLERY IMAGE
# =====================================================
class GalleryImage(models.Model):
    PAGE_CHOICES = [
        ("home", "Home"),
        ("about", "About"),
        ("gallery", "Gallery"),
    ]

    SECTION_CHOICES = [
        # Home
        ("hero", "Hero"),
        ("below_hero", "Below Hero"),

        # About
        ("banner", "Banner"),
        ("why_exhibit", "Why Exhibit"),
        ("why_choose_igtf", "Why Choose IGTF"),

        # Gallery
        ("main", "Gallery Main"),
        ("exhibition_moments", "Exhibition Moments"),
    ]

    page = models.CharField(max_length=50, choices=PAGE_CHOICES)
    section = models.CharField(max_length=50, choices=SECTION_CHOICES)

    image = models.URLField(max_length=500, null=True, blank=True)

    display_order = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["page", "section", "display_order", "id"]

    def __str__(self):
        return f"{self.page} - {self.section}"
 

# =====================================================
# SYSTEM STATUS AND DATE OF ONLINE
# =====================================================


class SystemSettings(models.Model):
    under_maintenance = models.BooleanField(default=False)
    date_of_online = models.DateTimeField(null=True, blank=True)

    # Always return the single instance
    @staticmethod
    def get_settings():
        obj, created = SystemSettings.objects.get_or_create(id=1)
        return obj

    def __str__(self):
        return "System Settings (Singleton)"
