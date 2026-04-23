"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import { api, unwrapApi } from "@/lib/api";
import { Category, Paginated, Product } from "@/types";

export default function HomePage() {
  const productsQuery = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await api.get("/products/?ordering=-created_at");
      return unwrapApi<Paginated<Product>>(response.data).results.slice(0, 4);
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories/");
      return unwrapApi<Category[]>(response.data);
    },
  });

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-card md:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-cyanpop">Custom Computer Parts Store</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-black tracking-tight text-ink md:text-6xl">
          Build faster rigs with parts that actually fit.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink/70 md:text-lg">
          Browse CPU, GPU, RAM, motherboard and storage with compatibility-aware tags and a full checkout flow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-coral px-5 py-3 font-bold text-white">
            Shop Components
          </Link>
          <Link href="/dashboard" className="rounded-full border border-ink/20 px-5 py-3 font-bold text-ink">
            My Dashboard
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-ink">Latest Drops</h2>
          <Link href="/products" className="font-semibold text-cyanpop">
            View All
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {productsQuery.data?.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-ink">Categories</h2>
          <Link href="/products" className="font-semibold text-cyanpop">
            Browse Catalog
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categoriesQuery.data?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-cyanpop">Category</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink">{category.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink/70">{category.description || "Browse products in this category."}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
