from rest_framework import serializers

from organization.models import Organization


class OrganizationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

