from .models import Cart


def get_or_create_active_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user, is_active=True)
    return cart


def get_active_cart_with_items(user):
    cart = get_or_create_active_cart(user)
    return Cart.objects.prefetch_related("items__product__category").get(pk=cart.pk)
