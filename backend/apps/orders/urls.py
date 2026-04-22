from django.urls import path

from .views import CheckoutAPIView, UserOrderDetailAPIView, UserOrderListAPIView

urlpatterns = [
    path("checkout/", CheckoutAPIView.as_view(), name="order-checkout"),
    path("", UserOrderListAPIView.as_view(), name="order-list"),
    path("<int:pk>/", UserOrderDetailAPIView.as_view(), name="order-detail"),
]
