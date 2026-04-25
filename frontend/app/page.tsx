"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
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

  const categoryIcons: Record<string, string> = {
    cpu: "🧠",
    gpu: "🎮",
    motherboard: "🎛️",
    memory: "⚡",
    storage: "💾",
    power: "🔌",
    case: "📦",
    cooling: "❄️",
  };

  return (
    <div className="space-y-20 md:space-y-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-ink text-surface shadow-2xl fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-cyanpop/20" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.2 }} />

        <div className="relative z-10 grid gap-12 px-6 py-16 md:grid-cols-2 md:px-16 md:py-24 lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyanpop/30 bg-cyanpop/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyanpop w-max">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyanpop opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyanpop"></span>
              </span>
              New RTX 50-Series Available
            </span>
            <h1 className="font-display text-5xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Build your <span className="bg-gradient-to-r from-cyanpop to-amberpop bg-clip-text text-transparent">dream rig</span> with zero bottlenecks.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground text-slate-300">
              Premium custom computer components with guaranteed compatibility. Stop guessing and start building the ultimate battle station.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/products" className="rounded-full bg-coral px-8 py-4 text-base font-bold text-white shadow-lg shadow-coral/30 hover:bg-coral/90 transition-all hover:-translate-y-1 btn-press">
                Shop Components
              </Link>
              <Link href="/products?category=gpu" className="rounded-full border border-slate-700 bg-slate-800/50 px-8 py-4 text-base font-bold text-white backdrop-blur hover:bg-slate-700 transition-all hover:-translate-y-1 btn-press">
                View GPUs
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Guaranteed Fit
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Fast Shipping
              </div>
            </div>
          </div>
          
          {/* Abstract Hero Art */}
          <div className="relative hidden md:block">
            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle rounded-full bg-cyanpop/20 blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle rounded-full bg-amberpop/20 blur-[80px]" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative h-full w-full flex items-center justify-center">
              <div className="relative h-80 w-64 rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-2xl backdrop-blur-xl rotate-[-6deg] translate-x-8 hover:rotate-0 transition-all duration-500 hover:z-20">
                <div className="h-40 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 mb-4"></div>
                <div className="h-4 w-3/4 rounded bg-slate-700 mb-2"></div>
                <div className="h-4 w-1/2 rounded bg-slate-700"></div>
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-amberpop flex items-center justify-center text-ink font-bold shadow-lg transform rotate-12">NEW</div>
              </div>
              <div className="relative h-72 w-56 rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-2xl backdrop-blur-xl rotate-[8deg] -translate-x-16 translate-y-12 hover:rotate-0 transition-all duration-500 hover:z-20">
                <div className="h-32 rounded-xl bg-gradient-to-br from-cyanpop/40 to-blue-900 mb-4"></div>
                <div className="h-4 w-2/3 rounded bg-slate-700 mb-2"></div>
                <div className="h-4 w-1/3 rounded bg-slate-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 fade-up stagger-1">
        {[
          { title: "Free Shipping", desc: "On orders over $500", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
          { title: "24/7 Support", desc: "Expert technical help", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
          { title: "Price Match", desc: "Best price guaranteed", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          { title: "Secure Checkout", desc: "256-bit encryption", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
        ].map((feature, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-2xl bg-surfaceMuted p-6 text-center shadow-sm border border-border transition-transform hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyanpop/10 text-cyanpop">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} /></svg>
            </div>
            <h3 className="font-display font-bold text-ink">{feature.title}</h3>
            <p className="mt-1 text-xs text-muted">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Latest Drops */}
      <section className="fade-up stagger-2">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-cyanpop font-bold">Featured</span>
            <h2 className="mt-2 font-display text-3xl font-black text-ink md:text-4xl">Latest Drops</h2>
          </div>
          <Link href="/products" className="hidden rounded-full border-2 border-border px-6 py-2.5 font-bold text-ink hover:border-ink hover:bg-ink/5 md:inline-block transition-colors">
            View All Components
          </Link>
        </div>
        
        {productsQuery.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productsQuery.data?.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
        
        <Link href="/products" className="mt-8 flex w-full justify-center rounded-xl border border-border bg-surfaceMuted py-3 font-bold text-ink hover:bg-border/50 md:hidden">
          View All Components
        </Link>
      </section>

      {/* Categories */}
      <section className="fade-up stagger-3">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">Shop by Category</h2>
          <p className="mt-3 text-muted">Find exactly what you need for your next build.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categoriesQuery.data?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-cyanpop/30 hover:shadow-md"
            >
              <span className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.slug.toLowerCase()] || "🖥️"}
              </span>
              <h3 className="font-display text-lg font-bold text-ink">{category.name}</h3>
              <p className="mt-1 text-xs text-muted group-hover:text-cyanpop transition-colors">Browse Products →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
