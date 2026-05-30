from rest_framework import serializers
from .models import Project, Task
from django.utils import timezone


class ProjectSerializer(serializers.ModelSerializer):
    org_name = serializers.CharField(source='org.name', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
            'org',
            'org_name'
        ]


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    class Meta:
        model = Task
        fields = [
            "id", "project", "assignee", "created_by",
            "title", "description", "priority", "status",
            "due_date", "created_at", "updated_at", "assignee_name", "project_name", "created_by_name"
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

        def validate_due_date(self, value):
            if value and value < timezone.now():
                raise serializers.ValidationError("due_date must be a future date.")

        def validate_status(self, value):
            # Only runs on update (instance exists)
            if self.instance and not self.instance.can_transition_to(value):
                raise serializers.ValidationError(
                    f"Invalid transition: {self.instance.status} → {value}"
                )
            return value


class TaskStatusSerializer(serializers.ModelSerializer):
    """Used only for PATCH status transitions."""

    class Meta:
        model = Task
        fields = ["status"]

    def validate_status(self, value):
        if not self.instance.can_transition_to(value):
            raise serializers.ValidationError(
                f"Invalid transition: {self.instance.status} → {value}"
            )
        return value
