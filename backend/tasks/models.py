import uuid

from django.db import models
from django.contrib.auth.models import User
from organization.models import Organization


# Create your models here.
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Priority(models.TextChoices):
        HIGH = "HIGH"
        MEDIUM = "MEDIUM"
        LOW = "LOW"

    class Status(models.TextChoices):
        TODO = "TODO"
        IN_PROGRESS = "IN_PROGRESS"
        IN_REVIEW = "IN_REVIEW"
        DONE = "DONE"
        BLOCKED = "BLOCKED"

    VALID_TRANSITIONS = {
        "TODO": ["IN_PROGRESS", "BLOCKED"],
        "IN_PROGRESS": ["IN_REVIEW", "BLOCKED"],
        "IN_REVIEW": ["DONE", "BLOCKED"],
        "DONE": [],
        "BLOCKED": [],
    }

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    assignee = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_tasks")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["assignee", "status"]),  # Redis cache key alignment
            models.Index(fields=["status"]),
            models.Index(fields=["due_date"]),
            models.Index(fields=["project", "priority"]),
        ]

    def __str__(self):
        return self.title

    def can_transition_to(self, new_status):
        return new_status in self.VALID_TRANSITIONS.get(self.status, [])
