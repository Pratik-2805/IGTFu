from rest_framework import serializers
from .models import (
    ExhibitorRegistration,
    VisitorRegistration,
    Category,
    Event,
    GalleryImage,
    User,
    SystemSettings,
)

# =====================================================
# EXHIBITOR SERIALIZER (Matches NEW Model)
# =====================================================
class ExhibitorRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExhibitorRegistration
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    # field validation
    def validate_email_address(self, value):
        if not value:
            raise serializers.ValidationError("Email address is required")
        return value.lower()

    def validate_contact_number(self, value):
        if not value:
            raise serializers.ValidationError("Contact number is required")

        cleaned = "".join(filter(str.isdigit, value))
        if len(cleaned) < 10:
            raise serializers.ValidationError("Contact number must be at least 10 digits")

        return value


# =====================================================
# VISITOR SERIALIZER (Matches NEW Model)
# =====================================================
class VisitorRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = VisitorRegistration
        fields = [
            "id",
            "event_location",
            "first_name",
            "last_name",
            "company_name",
            "email_address",
            "phone_number",
            "industry_interest",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_email_address(self, value):
        if not value:
            raise serializers.ValidationError("Email address is required")
        return value.lower()

    def validate_phone_number(self, value):
        if not value:
            raise serializers.ValidationError("Phone number is required")

        cleaned = "".join(filter(str.isdigit, value))
        if len(cleaned) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")

        return value


# =====================================================
# CATEGORY SERIALIZER
# =====================================================
class CategorySerializer(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Category
        fields = "__all__"


# =====================================================
# EVENT SERIALIZER
# =====================================================
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


# =====================================================
# GALLERY SERIALIZER
# =====================================================
class GalleryImageSerializer(serializers.ModelSerializer):
    # Accept a string (we will pass S3 URL)
    image = serializers.CharField()

    class Meta:
        model = GalleryImage
        fields = "__all__"

    def validate_image(self, value):
        # Accept only S3 URL after upload
        if not value.startswith("http"):
            raise serializers.ValidationError("Image must be a valid URL.")
        return value

# =====================================================
# USER SERIALIZER
# =====================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
            "is_password_set",
            "date_joined",
        ]
        read_only_fields = [
            "id",
            "is_active",
            "is_password_set",
            "date_joined",
        ]


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = ["under_maintenance", "date_of_online"]
