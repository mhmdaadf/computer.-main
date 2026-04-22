from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.cart.models import CartItem
from apps.cart.services import get_or_create_active_cart
from apps.products.models import Product
from apps.users.models import Address

from .models import Order, OrderItem


@transaction.atomic
def checkout_cart(*, user, address_id=None):
    cart = get_or_create_active_cart(user)
    items = list(CartItem.objects.select_related("product").filter(cart=cart))
    if not items:
        raise ValidationError({"cart": ["Your cart is empty."]})

    address = None
    shipping_full_text = ""
    if address_id:
        address = Address.objects.filter(id=address_id, user=user).first()
        if not address:
            raise ValidationError({"address_id": ["Address not found."]})
        shipping_full_text = ", ".join(
            part
            for part in [
                address.line1,
                address.line2,
                address.city,
                address.state,
                address.postal_code,
                address.country,
            ]
            if part
        )

    product_ids = [item.product_id for item in items]
    locked_products = {
        product.id: product
        for product in Product.objects.select_for_update().filter(id__in=product_ids, is_active=True)
    }

    total = Decimal("0.00")
    order = Order.objects.create(
        user=user,
        cart=cart,
        address=address,
        shipping_full_text=shipping_full_text,
    )

    for item in items:
        product = locked_products.get(item.product_id)
        if not product:
            raise ValidationError({"product": [f"Product #{item.product_id} is no longer available."]})
        if item.quantity > product.stock:
            raise ValidationError({"stock": [f"Insufficient stock for {product.name}."]})

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            unit_price=product.price,
            quantity=item.quantity,
            compatibility_snapshot=product.compatibility_tags,
        )

        product.stock -= item.quantity
        product.save(update_fields=["stock"])
        total += product.price * item.quantity

    order.total_price = total
    order.save(update_fields=["total_price"])

    cart.is_active = False
    cart.save(update_fields=["is_active"])
    cart.items.all().delete()
    get_or_create_active_cart(user)

    return order
