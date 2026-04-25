"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { api, unwrapApi } from "@/lib/api";
import { Category, Paginated, Product } from "@/types";

const defaultFilters = {
  category: "",
  brand: "",
  compatibility_tag: "",
  min_price: "",
  max_price: "",
  search: "",
  in_stock: "",
  ordering: "-created_at",
};

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState(defaultFilters);

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
    placeholderData: (prev) => prev, // Keep previous data while fetching
  });

  const onChangeFilter = (field: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setPage(1);
    setFilters(defaultFilters);
  };

  const activeFilterEntries = Object.entries(filters).filter(
    ([k, v]) => v !== "" && k !== "ordering" && !(k === "ordering" && v === "-created_at")
  );

  return (
    <section className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
      <FilterSidebar 
        categories={categoriesQuery.data || []} 
        filters={filters} 
        onChange={onChangeFilter} 
        onClear={clearAllFilters}
      />
      
      <div className="flex flex-col min-h-[600px]">
        {/* Header & Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black text-ink">All Components</h1>
            <p className="mt-1 text-sm text-muted">
              {productsQuery.isLoading ? "Loading..." : `Showing ${productsQuery.data?.count || 0} products`}
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-surfaceMuted text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              aria-label="Grid view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-colors ${viewMode === "list" ? "bg-surfaceMuted text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              aria-label="List view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterEntries.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-1">Active:</span>
            {activeFilterEntries.map(([key, value]) => {
              let displayLabel = key;
              let displayValue = value;
              
              if (key === 'category') {
                displayValue = categoriesQuery.data?.find(c => c.slug === value)?.name || value;
              } else if (key === 'in_stock') {
                displayLabel = 'Availability';
                displayValue = value === 'true' ? 'In Stock' : 'Out of Stock';
              }
              
              return (
                <span key={key} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink shadow-sm fade-in-scale">
                  <span className="text-muted capitalize">{displayLabel.replace('_', ' ')}:</span> {displayValue}
                  <button 
                    onClick={() => onChangeFilter(key, "")}
                    className="ml-1 rounded-full p-0.5 hover:bg-surfaceMuted text-muted hover:text-ink transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              );
            })}
            <button onClick={clearAllFilters} className="text-xs font-semibold text-danger-600 hover:text-danger-700 underline ml-2">Clear all</button>
          </div>
        )}

        {/* Product Grid */}
        {productsQuery.isLoading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : productsQuery.data?.results.length === 0 ? (
          <div className="flex-1 rounded-2xl border border-dashed border-border bg-surface/50">
            <EmptyState 
              title="No products found"
              description="We couldn&apos;t find any components matching your current filters. Try adjusting your search criteria."
              actionLabel="Clear Filters"
              actionOnClick={clearAllFilters}
            />
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {productsQuery.data?.results.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {/* Pagination */}
        {productsQuery.data && productsQuery.data.count > 0 && (
          <div className="mt-12 flex items-center justify-center border-t border-border pt-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-surfaceMuted disabled:opacity-40 disabled:hover:bg-surface btn-press"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Previous
              </button>
              
              <div className="flex items-center justify-center rounded-xl bg-surfaceMuted px-4 py-2.5 text-sm font-bold text-ink border border-border">
                Page {page}
              </div>
              
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!productsQuery.data.next}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-surfaceMuted disabled:opacity-40 disabled:hover:bg-surface btn-press"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
