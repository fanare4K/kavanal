from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from .services import verify_user, get_product
from .events.publisher import publish_event

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(" ")[1]

        # ✅ Verify user
        user_data = verify_user(token)
        if not user_data:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        # ✅ Add price to each item
        items = request.data.get("items", [])
        for item in items:
            product = get_product(item["product_id"])
            if not product:
                return Response({"error": f"Product {item['product_id']} not found"}, status=status.HTTP_400_BAD_REQUEST)
            item["price"] = product["price"]

        # ✅ Save order
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user_id=user_data["id"])  # attach real user_id

        order = serializer.data

        # ✅ Publish event
        publish_event("order_created", {
            "order_id": order["id"],
            "user_id": order["user_id"],
            "total_price": order["total_price"]
        })

        return Response(order)