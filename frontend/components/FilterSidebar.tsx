"use client";

import { useState } from "react";
import { Category } from "@/types";

interface Props {
  categories: Category[];
  filters: {
    category: string;
    brand: string;
    compatibility_tag: string;
    min_price: string;
    max_price: string;
    search: string;
    in_stock: string;
    ordering: string;
  };
  onChange: (field: string, value: string) => void;
  onClear: () => void;
}

export default function FilterSidebar({ categories, filters, onChange, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v !== "" && k !== "ordering" && !(k === "ordering" && v === "-created_at")
  ).length;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl bg-surface p-4 shadow-sm border border-border"
        >
          <span className="font-display font-bold flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Parts
          </span>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyanpop text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <svg className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`rounded-2xl border border-border bg-surface p-5 shadow-sm lg:block ${isOpen ? "block" : "hidden"}`}>
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            <svg className="h-5 w-5 text-cyanpop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <button onClick={onClear} className="text-xs font-semibold text-danger-600 hover:text-danger-700 underline">
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={filters.search}
                onChange={(e) => onChange("search", e.target.value)}
                placeholder="Find components..."
                className="w-full rounded-lg border border-border bg-surfaceMuted pl-9 pr-3 py-2 text-sm focus:bg-surface"
              />
            </div>
          </div>

          <hr className="border-border" />

          {/* Sort */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Sort By</label>
            <select
              value={filters.ordering}
              onChange={(e) => onChange("ordering", e.target.value)}
              className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm font-medium focus:bg-surface"
            >
              <option value="-created_at">Newest Arrivals</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>

          <hr className="border-border" />

          {/* Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted mb-3 block">Category</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={() => onChange("category", "")}
                  className="h-4 w-4 text-cyanpop focus:ring-cyanpop border-border"
                />
                <span className={`text-sm font-medium ${filters.category === "" ? "text-ink" : "text-muted group-hover:text-ink"}`}>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 group cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug}
                    checked={filters.category === cat.slug}
                    onChange={() => onChange("category", cat.slug)}
                    className="h-4 w-4 text-cyanpop focus:ring-cyanpop border-border"
                  />
                  <span className={`text-sm font-medium ${filters.category === cat.slug ? "text-ink" : "text-muted group-hover:text-ink"}`}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted mb-3 block">Price Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => onChange("min_price", e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-border bg-surfaceMuted pl-7 pr-3 py-2 text-sm focus:bg-surface"
                />
              </div>
              <span className="text-muted">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => onChange("max_price", e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-border bg-surfaceMuted pl-7 pr-3 py-2 text-sm focus:bg-surface"
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Additional Filters */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Availability</label>
              <select
                value={filters.in_stock}
                onChange={(e) => onChange("in_stock", e.target.value)}
                className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm font-medium focus:bg-surface"
              >
                <option value="">Any Availability</option>
                <option value="true">In Stock Only</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Brand</label>
              <input
                value={filters.brand}
                onChange={(e) => onChange("brand", e.target.value)}
                placeholder="e.g. AMD, NVIDIA..."
                className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">Platform / Socket</label>
              <input
                value={filters.compatibility_tag}
                onChange={(e) => onChange("compatibility_tag", e.target.value)}
                placeholder="e.g. AM5, LGA1700..."
                className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface"
              />
            </div>
          </div>
          
          {/* Mobile Apply Button */}
          <div className="lg:hidden pt-4">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white btn-press"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
