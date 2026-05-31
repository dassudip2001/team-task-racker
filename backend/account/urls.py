from django.contrib import admin
from django.urls import path

from account.views import RegisterView, GetUserProfileView, LogoutView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", GetUserProfileView.as_view(), name="get-user-profile"),
    path("logout/", LogoutView.as_view(), name="logout")

]
