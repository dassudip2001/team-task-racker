from rest_framework import serializers
from django.contrib.auth.models import User


class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=225)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=225, write_only=True)

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        username = validated_data['username']

        if username == "" or email == "" or password == "":
            raise serializers.ValidationError("All fields are required")

        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Email or username already exists")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return user
