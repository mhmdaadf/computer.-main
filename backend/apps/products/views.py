from django.db import connection
from django_filters import rest_framework as filters
from rest_framework import generics, permissions

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="category__slug", lookup_expr="iexact")
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    brand = filters.CharFilter(field_name="brand", lookup_expr="icontains")
    compatibility_tag = filters.CharFilter(method="filter_compatibility_tag")

    class Meta:
        model = Product
        fields = ["category", "min_price", "max_price", "brand", "compatibility_tag"]

    def filter_compatibility_tag(self, queryset, name, value):
        if connection.vendor == "postgresql":
            return queryset.filter(compatibility_tags__contains=[value])
        return queryset.filter(compatibility_tags__icontains=value)


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related("category")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "brand"]
    ordering_fields = ["price", "created_at", "stock"]


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related("category")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
