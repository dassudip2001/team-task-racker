from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Organization
from .serializers import OrganizationSerializers


# Create your views here.

class OrganizationFindUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        organization = get_object_or_404(Organization, pk=pk)
        organizationSerializer = OrganizationSerializers(organization)
        return Response(
            organizationSerializer.data,
            status.HTTP_200_OK
        )

    def put(self, request, pk):
        org = get_object_or_404(Organization, pk=pk)
        serializer = OrganizationSerializers(org, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        organization = get_object_or_404(Organization, pk=pk)
        organization.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetOrganization(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization = Organization.objects.all()
        organizationSerializer = OrganizationSerializers(organization, many=True)
        return Response(
            organizationSerializer.data,
            status.HTTP_200_OK
        )

    def post(self, request):
        serializer = OrganizationSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
