from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from account.serializers import SignUpSerializer
from organization.models import UserProfile
from organization.serializers import ProfileSerializers


# Create your views here.

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
