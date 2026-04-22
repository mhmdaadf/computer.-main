from rest_framework import permissions, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product

from .models import CartItem
from .serializers import AddCartItemSerializer, CartSerializer, UpdateCartItemSerializer
from .services import get_active_cart_with_items, get_or_create_active_cart


class CurrentCartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_active_cart_with_items(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_active_cart(request.user)
        product = Product.objects.filter(id=serializer.validated_data["product_id"], is_active=True).first()
        if not product:
            raise NotFound("Product not found.")

        quantity = serializer.validated_data["quantity"]
        cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": 0})
        target_qty = cart_item.quantity + quantity
        if target_qty > product.stock:
            raise ValidationError({"quantity": ["Requested quantity exceeds available stock."]})

        cart_item.quantity = target_qty
        cart_item.save(update_fields=["quantity"])
        return Response(CartSerializer(get_active_cart_with_items(request.user)).data, status=status.HTTP_200_OK)


class UpdateCartItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_active_cart(request.user)
        item = CartItem.objects.filter(id=item_id, cart=cart).select_related("product").first()
        if not item:
            raise NotFound("Cart item not found.")

        quantity = serializer.validated_data["quantity"]
        if quantity > item.product.stock:
            raise ValidationError({"quantity": ["Requested quantity exceeds available stock."]})

        item.quantity = quantity
        item.save(update_fields=["quantity"])
        return Response(CartSerializer(get_active_cart_with_items(request.user)).data)


class RemoveCartItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_or_create_active_cart(request.user)
        item = CartItem.objects.filter(id=item_id, cart=cart).first()
        if not item:
            raise NotFound("Cart item not found.")

        item.delete()
        return Response(CartSerializer(get_active_cart_with_items(request.user)).data)
