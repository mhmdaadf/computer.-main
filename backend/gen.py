from pathlib import Path
from django.conf import settings
from apps.products.models import Product

media_products = Path(settings.MEDIA_ROOT) / "products"
media_products.mkdir(parents=True, exist_ok=True)

created = 0
assigned = 0
for idx, product in enumerate(Product.objects.order_by("id"), start=1):
    slug = product.slug or f"product-{product.id}"
    filename = f"{slug}.svg"
    rel_path = f"products/{filename}"
    full_path = media_products / filename

    if not full_path.exists():
        colors = [("#0ea5e9", "#0284c7"), ("#ef4444", "#dc2626"), ("#10b981", "#059669"), ("#f59e0b", "#d97706")]
        c1, c2 = colors[(idx - 1) % len(colors)]
        name = (product.name or "Product").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        brand = (product.brand or "Brand").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#g)"/>
  <rect x="80" y="80" width="1040" height="1040" rx="36" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.25)"/>
  <text x="120" y="560" fill="white" font-family="Segoe UI, Arial" font-size="64" font-weight="700">{name}</text>
  <text x="120" y="640" fill="white" font-family="Segoe UI, Arial" font-size="36" opacity="0.92">{brand}</text>
</svg>"""
        full_path.write_text(svg, encoding="utf-8")
        created += 1

    if product.image.name != rel_path:
        product.image.name = rel_path
        product.save(update_fields=["image"])
    assigned += 1

print(f"PRODUCTS_WITH_IMAGES={assigned}")
print(f"SVG_CREATED={created}")
