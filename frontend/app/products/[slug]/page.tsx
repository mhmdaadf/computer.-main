"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { api, unwrapApi } from "@/lib/api";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["product", params.slug],
    queryFn: async () => {
      const response = await api.get(`/products/${params.slug}/`);
      return unwrapApi<Product>(response.data);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/cart/add/", {
        product_id: productQuery.data?.id,
        quantity: 1,
      });
      return unwrapApi(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const product = productQuery.data;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const imageSrc = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${apiOrigin}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : null;

  if (productQuery.isLoading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (productQuery.isError || !product) {
    return <div className="p-6">Product not found or unavailable.</div>;
  }

  return (
    <section className="grid gap-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-card md:grid-cols-2">
      <div className="relative h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-cyanpop/15 to-amberpop/20">
        {imageSrc ? (
          <Image src={imageSrc} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : null}
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyanpop">{product.category.name}</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink">{product.name}</h1>
        <p className="mt-4 text-ink/75">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.compatibility_tags.map((tag) => (
            <span key={tag} className="rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold text-ink/75">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <span className="font-mono text-3xl font-bold text-ink">${product.price}</span>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated()) {
              router.push("/login");
              return;
            }
            addMutation.mutate();
          }}
          disabled={product.stock === 0 || addMutation.isPending}
          className="mt-6 rounded-xl bg-coral px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          {addMutation.isPending ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </section>
  );
}
