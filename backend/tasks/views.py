from django.core.cache import cache
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsManagerOrAdmin, IsAdminManagerOrAssignee
from .serializer import ProjectSerializer, TaskSerializer, TaskStatusSerializer

from tasks.models import Project, Task


def userBelongsToOrganization(request):
    try:
        profile = request.user.profile
    except Exception:
        return Response(
            {
                "success": False,
                "error": {
                    "code": "PROFILE_NOT_FOUND",
                    "message": "User profile not found."
                }
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if profile.org is None:
        return Response(
            {
                "success": False,
                "error": {
                    "code": "ORGANIZATION_NOT_FOUND",
                    "message": "User is not assigned to an organization."
                }
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    return None

def error_response(http_status, code, message):
    return Response(
        {"status": http_status, "code": code, "message": message},
        status=http_status
    )


class FindUpdateDelete(APIView):
    def get_permissions(self):
        if self.request.method == "PUT" or self.request.method == "DELETE":
            return [IsAuthenticated(), IsManagerOrAdmin()]
        return [IsAuthenticated()]

    def get(self, request, id):
        error = userBelongsToOrganization(request)
        if error:
            return error
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return error_response(
                status.HTTP_404_NOT_FOUND,
                "PROJECT_NOT_FOUND",
                "Project not found."
            )

        projectSerializer = ProjectSerializer(project)
        return Response(projectSerializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        error = userBelongsToOrganization(request)
        if error:
            return error
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return error_response(
                status.HTTP_404_NOT_FOUND,
                "PROJECT_NOT_FOUND",
                "Project not found."
            )
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            project = Project.objects.get(id=id)
            project.delete()
            return Response({"message": "Project deleted successfully"})

        except Project.DoesNotExist:
            return error_response(
                status.HTTP_404_NOT_FOUND,
                "PROJECT_NOT_FOUND",
                "Project not found."
            )


class ListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsManagerOrAdmin()]
        return [IsAuthenticated()]

    def get(self, request):
        error = userBelongsToOrganization(request)
        if error:
            return error

        projects = Project.objects.filter(org=request.user.profile.org)
        projectSerializer = ProjectSerializer(projects, many=True)
        return Response(projectSerializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            error = userBelongsToOrganization(request)
            if error:
                return error
            serializer.save(org=request.user.profile.org)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


CACHE_TTL = 60 * 5  # 5 minutes


def assignee_cache_key(user_id):
    return f"tasks:assignee:{user_id}"


# Tasks
class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        assignee_id = request.query_params.get("assignee")

        # Serve from cache if filtering by a single assignee
        if assignee_id:
            cache_key = assignee_cache_key(assignee_id)
            cached = cache.get(cache_key)
            if cached is not None:
                return Response(cached)

        tasks = Task.objects.filter(
            project__org=request.user.profile.org
        ).select_related("assignee", "project")

        # ── Filters ──
        status_filter = request.query_params.get("status")
        priority_filter = request.query_params.get("priority")

        if status_filter:
            tasks = tasks.filter(status=status_filter)
        if priority_filter:
            tasks = tasks.filter(priority=priority_filter)
        if assignee_id:
            tasks = tasks.filter(assignee_id=assignee_id)

        # ── Pagination ──
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 20))
        start = (page - 1) * limit
        total = tasks.count()
        tasks_page = tasks[start: start + limit]

        data = TaskSerializer(tasks_page, many=True).data

        response_data = {
            "page": page,
            "limit": limit,
            "total": total,
            "results": data,
        }

        # Write to cache only for assignee-filtered queries
        if assignee_id:
            cache.set(assignee_cache_key(assignee_id), response_data, CACHE_TTL)

        return Response(response_data)

    def post(self, request):
        role = request.user.profile.role
        if role == "MEMBER":
            return error_response(403, "PERMISSION_DENIED", "Members cannot create tasks.")
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save(created_by=request.user)

            if task.assignee:
                cache.delete(assignee_cache_key(task.assignee.id))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminManagerOrAssignee]

    def get_object(self, pk, request):
        task = get_object_or_404(
            Task,
            pk=pk,
            project__org=request.user.profile.org
        )
        self.check_object_permissions(request, task)
        return task

    def get(self, request, pk):
        task = self.get_object(pk, request)
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        task = self.get_object(pk, request)
        old_assignee = task.assignee

        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            updated = serializer.save()
            # Invalidate both old and new assignee caches
            if old_assignee:
                cache.delete(assignee_cache_key(old_assignee.id))
            if updated.assignee:
                cache.delete(assignee_cache_key(updated.assignee.id))
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request)
        role = request.user.profile.role
        if role == "MEMBER":
            return error_response(403, "PERMISSION_DENIED", "Members cannot delete tasks.")
        assign = task.assignee
        task.delete()
        if assign:
            cache.delete(assignee_cache_key(assign.id))
        return Response({"message": "Task deleted successfully"})


class TaskStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        task = get_object_or_404(
            Task, pk=pk, project__org=request.user.profile.org
        )
        role = request.user.profile.role

        if role == "MEMBER" and task.assignee != request.user:
            return error_response(403, "PERMISSION_DENIED", "Only the assignee can update this task's status.")

        serializer = TaskStatusSerializer(task, data=request.data)
        if serializer.is_valid():
            updated = serializer.save()
            if updated.assignee:
                cache.delete(assignee_cache_key(updated.assignee.id))
            return Response(TaskSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
