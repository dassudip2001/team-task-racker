from django.db.models import Model, Count, Avg, ExpressionWrapper, F, DurationField
from django.utils import timezone

from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from account.serializers import SignUpSerializer
from organization.models import UserProfile
from organization.serializers import ProfileSerializers
from tasks.models import Task


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserProfileView(APIView):
    def get(self, request):
        profile = get_object_or_404(
            UserProfile,
            user=request.user
        )

        serializer = ProfileSerializers(profile)

        return Response(
            {
                "success": True,
                "user": serializer.data
            }
        )


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception:
            return Response({"error": "Invalid token"}, status=400)
        return Response({"message": "Logged out"})


class GetAllUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profiles = UserProfile.objects.filter(
            org=request.user.profile.org
        ).select_related(
            "user",
            "org"
        )
        serializer = ProfileSerializers(profiles, many=True)
        return Response(serializer.data)


class TaskAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        org = request.user.profile.org
        now = timezone.now()

        overdue_per_user = (
            Task.objects.filter(
                project__org=org,
                due_date__lt=now,
            ).exclude(status__in=["DONE", "BLOCKED"])
            .values("assignee__id", "assignee__username", "assignee__email")
            .annotate(overdue_count=Count("id"))
            .order_by("-overdue_count")
        )
        avg_completion = (
            Task.objects.filter(
                project__org=org,
                status="DONE",
                assignee__isnull=False,
            )
            .values("assignee__id", "assignee__username")
            .annotate(
                avg_completion_seconds=Avg(
                    ExpressionWrapper(
                        F("updated_at") - F("created_at"),
                        output_field=DurationField()
                    )
                )
            )
        )
        avg_completion_data = [
            {
                "assignee_id": str(row["assignee__id"]),
                "username": row["assignee__username"],
                "avg_completion_seconds": (
                    row["avg_completion_seconds"].total_seconds()
                    if row["avg_completion_seconds"] else None
                ),
            }
            for row in avg_completion
        ]
        overdue_map = {
            str(row["assignee__id"]): row["overdue_count"]
            for row in overdue_per_user
        }

        return Response({
            "overdue_per_user": [
                {
                    "assignee_id": str(row["assignee__id"]),
                    "username": row["assignee__username"],
                    "email": row["assignee__email"],
                    "overdue_count": row["overdue_count"],
                }
                for row in overdue_per_user
            ],
            "avg_completion_time": avg_completion_data,
        })
