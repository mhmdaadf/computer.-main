
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function resolveProductImage(image: string | null) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}

export function formatCurrency(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function stockTone(stock: number) {
  if (stock === 0) return { label: "Out of stock", classes: "bg-red-50 text-red-700 border-red-200" };
  if (stock <= 5) return { label: `Only ${stock} left`, classes: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: `${stock} in stock`, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}
