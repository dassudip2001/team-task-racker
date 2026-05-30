from rest_framework.permissions import BasePermission


def get_role(user):
    try:
        return user.profile.role
    except AttributeError:
        return None


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) == "ADMIN"


class IsManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) in ("ADMIN", "MANAGER")


class IsAdminManagerOrAssignee(BasePermission):
    """For task detail — MEMBER can only touch their own tasks."""

    def has_object_permission(self, request, view, obj):
        role = get_role(request.user)
        if role in ("ADMIN", "MANAGER"):
            return True
        return obj.assignee == request.user
