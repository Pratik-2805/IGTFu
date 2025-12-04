from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    ExhibitorRegistration,
    VisitorRegistration,
    Category,
    Event,
    GalleryImage,
    User,
    PasswordSetupToken,
)


# ===============================
# CUSTOM USER ADMIN (Unified User)
# ===============================
@admin.register(User)
class UserAdmin(BaseUserAdmin):

    # Columns in admin list view
    list_display = (
        "id",
        "get_full_name",
        "username",
        "email",
        "role",
        "is_active",
        "is_password_set",
        "date_joined",
        "last_login",
        "is_superuser",
    )

    list_filter = ("role", "is_active", "is_superuser", "is_password_set")

    search_fields = ("username", "email", "first_name", "last_name")

    ordering = ("id",)

    # Hide Django’s built-in staff flag since you don’t use it
    exclude = ("is_staff",)

    # computed full name
    def get_full_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or "(No Name)"
    get_full_name.short_description = "Name"

    # User edit form layout
    fieldsets = (
        ("Login Details", {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "email")}),
        ("Role & Access", {
            "fields": (
                "role",
                "is_active",
                "is_superuser",
                "is_password_set",
            )
        }),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    # User create form layout
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "role",
                "password1",
                "password2",
            ),
        }),
    )


# ===============================
# PASSWORD TOKEN
# ===============================
@admin.register(PasswordSetupToken)
class PasswordSetupTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "token", "created_at")
    search_fields = ("user__email", "token")
    readonly_fields = ("created_at",)


# ===============================
# EXHIBITOR REGISTRATION
# ===============================
@admin.register(ExhibitorRegistration)
class ExhibitorRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company_name",
        "contact_person_name",
        "email_address",
        "contact_number",
        "product_category",
        "status",
        "created_at",
    )
    readonly_fields = ("created_at",)
    list_filter = ("status",)
    search_fields = ("company_name", "contact_person_name", "email_address")


# ===============================
# VISITOR REGISTRATION
# ===============================
@admin.register(VisitorRegistration)
class VisitorRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "company_name",
        "email_address",
        "phone_number",
        "industry_interest",
        "created_at",
    )
    readonly_fields = ("created_at",)
    list_filter = ("industry_interest",)
    search_fields = ("first_name", "last_name", "email_address", "company_name")


# ===============================
# CATEGORY
# ===============================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    readonly_fields = ("created_at",)
    search_fields = ("name",)


# ===============================
# EVENT
# ===============================
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "location",
        "start_date",
        "end_date",
        "is_active",
        "created_at",
    )
    readonly_fields = ("created_at",)
    list_filter = ("is_active", "start_date")
    search_fields = ("title", "location")


# ===============================
# GALLERY IMAGE
# ===============================
@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("id", "page", "section", "display_order", "created_at")
    list_filter = ("page", "section")
    ordering = ("page", "section", "display_order")
