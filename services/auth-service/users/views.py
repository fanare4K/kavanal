from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import User
from .serializers import RegisterSerializer, PublicUserSerializer
from authentication.permissions import IsAdminUser


class UserListView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]

    def get(self, request):
        users = User.objects.all()
        serializer = PublicUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserDetailView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]  # ✅ FIXED

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = PublicUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        # ✅ SECURITY: user can edit himself OR admin
        if request.user != user and not request.user.is_staff:
            return Response({"error": "Not allowed"}, status=403)

        serializer = RegisterSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        # ✅ Only admin can delete
        if not request.user.is_staff:
            return Response({"error": "Only admin can delete users"}, status=403)

        user.delete()
        return Response({"message": "User deleted"})