import uuid
from django.contrib.auth.models import User

from django.db import models


# Create your models here.
class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name



class UserProfile(models.Model):
    class Role(models.TextChoices):
        ADMIN = "ADMIN"
        MANAGER = "MANAGER"
        MEMBER = "MEMBER"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    org = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.SET_NULL, related_name='members')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'org']),
        ]
    def __str__(self):
        return f"{self.user.username} - {self.org.name}"