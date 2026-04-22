from django.urls import path

from .views import AddToCartAPIView, CurrentCartAPIView, RemoveCartItemAPIView, UpdateCartItemAPIView

urlpatterns = [
    path("", CurrentCartAPIView.as_view(), name="cart-current"),
    path("add/", AddToCartAPIView.as_view(), name="cart-add"),
    path("items/<int:item_id>/", UpdateCartItemAPIView.as_view(), name="cart-item-update"),
    path("items/<int:item_id>/remove/", RemoveCartItemAPIView.as_view(), name="cart-item-remove"),
]
