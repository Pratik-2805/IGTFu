import boto3
from uuid import uuid4
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


# ======================================================
# JWT CUSTOM SERIALIZER (inject user info into tokens)
# ======================================================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_id"] = user.id
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = "admin" if user.is_superuser else getattr(user, "role", None)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        return {
            "refresh": data.get("refresh"),
            "access": data.get("access"),
            # Include explicit user object so frontend doesn't have to decode token
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": "admin" if user.is_superuser else getattr(user, "role", None),
                "name": user.get_full_name() or user.username,
            },
        }

# ======================================================
# JWT TOKEN CREATION UTILITY
# ======================================================
def create_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# ======================================================
# S3 UPLOAD HELPER (public-read)
# ======================================================
def upload_to_s3(file_obj, folder="categories"):
    """
    Uploads file to S3 and returns CloudFront URL if configured.
    """
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    file_ext = file_obj.name.split(".")[-1]
    unique_name = f"{uuid4()}.{file_ext}"
    file_key = f"{folder}/{unique_name}"

    s3.upload_fileobj(
        Fileobj=file_obj,
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=file_key,
        ExtraArgs={"ContentType": file_obj.content_type}
    )

    # 🔥 Use CloudFront URL if configured
    cdn = getattr(settings, "CLOUDFRONT_URL", "").rstrip("/")
    if cdn:
        return f"{cdn}/{file_key}"

    # fallback to S3
    bucket = settings.AWS_STORAGE_BUCKET_NAME
    region = settings.AWS_S3_REGION_NAME
    return f"https://{bucket}.s3.{region}.amazonaws.com/{file_key}"


def delete_from_s3(file_url):
    """
    Deletes a file from S3 using its full URL.
    """
    if not file_url:
        return

    # Example: https://bucket.s3.us-east-2.amazonaws.com/categories/uuid.jpg
    try:
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        region = settings.AWS_S3_REGION_NAME

        prefix = f"https://{bucket_name}.s3.{region}.amazonaws.com/"
        if file_url.startswith(prefix):
            key = file_url.replace(prefix, "")
        else:
            # fallback
            key = file_url.split(".amazonaws.com/")[-1]

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=region,
        )

        s3.delete_object(Bucket=bucket_name, Key=key)

    except Exception as e:
        print("Error deleting from S3:", e)
