from rest_framework import serializers
from django.contrib.auth.models import User
from organization.models import Organization, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class OrganizationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'



class ProfileSerializers(serializers.ModelSerializer):
    org=OrganizationSerializers(read_only=True)
    user=UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = '__all__'
