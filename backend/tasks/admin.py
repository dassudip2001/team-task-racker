from django.contrib import admin

from tasks.models import Task, Project


# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    pass


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name","description"]
