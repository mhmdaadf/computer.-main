"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { api, unwrapApi } from "@/lib/api";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${apiOrigin}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : null;

  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/cart/add/", {
        product_id: product.id,
        quantity: 1,
      });
      return unwrapApi(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAdd = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    addMutation.mutate();
  };

  return (
    <article className="animate-rise rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
      <div className="mb-3 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-cyanpop/10 via-white to-amberpop/20">
        {imageSrc ? (
          <div className="relative h-full w-full">
            <Image src={imageSrc} alt={product.name} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
          </div>
        ) : null}
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-cyanpop">{product.category.name}</p>
      <h3 className="mt-1 font-display text-xl font-bold text-ink">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-ink/70">{product.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.compatibility_tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-ink/5 px-2 py-1 text-xs font-semibold text-ink/70">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-lg font-bold text-ink">${product.price}</span>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="rounded-lg border border-ink/20 px-3 py-1.5 text-sm font-semibold">
            Details
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            disabled={addMutation.isPending || product.stock === 0}
            className="rounded-lg bg-coral px-3 py-1.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            {product.stock === 0 ? "Out" : addMutation.isPending ? "Adding" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
