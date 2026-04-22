"use client";

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
  };
  onChange: (field: string, value: string) => void;
}

export default function FilterSidebar({ categories, filters, onChange }: Props) {
  return (
    <aside className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
      <h2 className="font-display text-xl font-bold text-ink">Filter Parts</h2>
      <div className="mt-4 space-y-3">
        <input
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search parts"
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
        />
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={filters.brand}
          onChange={(e) => onChange("brand", e.target.value)}
          placeholder="Brand"
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
        />
        <input
          value={filters.compatibility_tag}
          onChange={(e) => onChange("compatibility_tag", e.target.value)}
          placeholder="Compatibility tag"
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={filters.min_price}
            onChange={(e) => onChange("min_price", e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-ink/20 px-3 py-2"
          />
          <input
            value={filters.max_price}
            onChange={(e) => onChange("max_price", e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-ink/20 px-3 py-2"
          />
        </div>
      </div>
    </aside>
  );
}
