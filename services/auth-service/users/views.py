from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import RegisterSerializer
from authentication.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated


class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = RegisterSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = RegisterSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({"message": "User deleted"})