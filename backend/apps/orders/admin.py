from django.contrib import admin
from django.db.models import DecimalField, ExpressionWrapper, F, Sum

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "unit_price", "quantity")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "total_price", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email",)
    inlines = [OrderItemInline]

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        stats = Order.objects.aggregate(total_sales=Sum("total_price"))
        line_total_expr = ExpressionWrapper(F("unit_price") * F("quantity"), output_field=DecimalField(max_digits=14, decimal_places=2))
        top_products = (
            OrderItem.objects.values("product_name")
            .annotate(total_sold=Sum("quantity"), revenue=Sum(line_total_expr))
            .order_by("-total_sold", "product_name")[:5]
        )
        extra_context["total_sales"] = stats.get("total_sales") or 0
        extra_context["orders_count"] = Order.objects.count()
        extra_context["top_products"] = top_products
        return super().changelist_view(request, extra_context=extra_context)
