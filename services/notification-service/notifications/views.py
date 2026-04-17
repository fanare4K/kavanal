from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .models import Notification
import json

class JWTAuthMixin:
    """مixin للتحقق من JWT"""
    def authenticate(self, request):
        auth = JWTAuthentication()
        try:
            user_auth = auth.authenticate(request)
            if user_auth is not None:
                return user_auth[0].id
        except (InvalidToken, AuthenticationFailed, AttributeError):
            pass
        return None

@method_decorator(csrf_exempt, name='dispatch')
class MyNotificationsView(JWTAuthMixin, View):
    def get(self, request):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        notifications = Notification.objects.filter(user_id=user_id).values(
            'id', 'content', 'status', 'event_type', 'created_at', 'read_at'
        )
        return JsonResponse({
            "notifications": list(notifications),
            "count": notifications.count()
        })

@method_decorator(csrf_exempt, name='dispatch')
class UnreadNotificationsView(JWTAuthMixin, View):
    def get(self, request):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        notifications = Notification.objects.filter(user_id=user_id, status='unread').values(
            'id', 'content', 'event_type', 'created_at'
        )
        return JsonResponse({
            "unread_count": notifications.count(),
            "notifications": list(notifications)
        })

@method_decorator(csrf_exempt, name='dispatch')
class MarkAsReadView(JWTAuthMixin, View):
    def put(self, request, notification_id):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.status = 'read'
            notification.read_at = timezone.now()
            notification.save()
            return JsonResponse({"message": "✅ Notification marquée comme lue"})
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notification non trouvée"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class DeleteNotificationView(JWTAuthMixin, View):
    def delete(self, request, notification_id):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.delete()
            return JsonResponse({"message": "🗑️ Notification supprimée"})
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notification non trouvée"}, status=404)
        

class HealthCheckView(View):
    def get(self, request):
        return JsonResponse({"status": "healthy", "service": "notification-service"})