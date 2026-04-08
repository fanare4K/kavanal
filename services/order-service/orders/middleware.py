import requests
from django.http import JsonResponse
from .services import verify_user

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Authorization header missing"}, status=401)

        token = auth_header.split(" ")[1]
        user_data = verify_user(token)
        if not user_data:
            return JsonResponse({"error": "Invalid token"}, status=401)

        request.user = user_data
        return self.get_response(request)