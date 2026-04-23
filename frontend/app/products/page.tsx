"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { api, unwrapApi } from "@/lib/api";
import { Category, Paginated, Product } from "@/types";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    compatibility_tag: "",
    min_price: "",
    max_price: "",
    search: "",
    in_stock: "",
    ordering: "-created_at",
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories/");
      return unwrapApi<Category[]>(response.data);
    },
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value);
    });
    return params.toString();
  }, [filters, page]);

  const productsQuery = useQuery({
    queryKey: ["products", queryString],
    queryFn: async () => {
      const response = await api.get(`/products/?${queryString}`);
      return unwrapApi<Paginated<Product>>(response.data);
    },
  });

  const onChangeFilter = (field: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <FilterSidebar categories={categoriesQuery.data || []} filters={filters} onChange={onChangeFilter} />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-3xl font-black">Products</h1>
          <p className="text-sm text-ink/60">{productsQuery.data?.count || 0} items</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {productsQuery.data?.results.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-ink/20 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-semibold">Page {page}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!productsQuery.data?.next}
            className="rounded-lg border border-ink/20 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
