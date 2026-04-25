"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { api, unwrapApi } from "@/lib/api";
import { Paginated, Product } from "@/types";
import { formatCurrency, resolveProductImage, ratingForProduct, reviewsForProduct, stockTone } from "@/lib/product-ui";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { toast } from "@/hooks/useToast";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const productQuery = useQuery({
    queryKey: ["product", params.slug],
    queryFn: async () => {
      const response = await api.get(`/products/${params.slug}/`);
      return unwrapApi<Product>(response.data);
    },
  });

  const product = productQuery.data;

  const relatedQuery = useQuery({
    queryKey: ["related-products", product?.category.slug],
    queryFn: async () => {
      const response = await api.get(`/products/?category=${product?.category.slug}&ordering=-created_at`);
      return unwrapApi<Paginated<Product>>(response.data).results.filter(p => p.id !== product?.id).slice(0, 4);
    },
    enabled: !!product,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/cart/add/", {
        product_id: product?.id,
        quantity: quantity,
      });
      return unwrapApi(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Added ${quantity} ${product?.name} to cart`);
    },
    onError: () => {
      toast.error("Failed to add to cart. Please try again.");
    }
  });

  if (productQuery.isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-6 w-48 rounded bg-surfaceMuted" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-surfaceMuted" />
          <div className="space-y-6 pt-4">
            <div className="h-4 w-24 rounded bg-surfaceMuted" />
            <div className="h-10 w-3/4 rounded bg-surfaceMuted" />
            <div className="h-6 w-32 rounded bg-surfaceMuted" />
            <div className="h-24 rounded bg-surfaceMuted" />
            <div className="h-12 w-1/3 rounded bg-surfaceMuted" />
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-ink/5 p-6 text-ink/40">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Product Not Found</h2>
        <p className="mt-2 text-muted">The component you&apos;re looking for might have been removed or is unavailable.</p>
        <Link href="/products" className="mt-6 rounded-full bg-ink px-6 py-2.5 font-bold text-white btn-press">
          Back to Products
        </Link>
      </div>
    );
  }

  const imageSrc = resolveProductImage(product.image);
  const rating = ratingForProduct(product);
  const reviews = reviewsForProduct(product);
  const stockInfo = stockTone(product.stock);

  return (
    <div className="space-y-12 fade-up">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </li>
          <li>
            <Link href="/products" className="hover:text-ink transition-colors">Products</Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </li>
          <li>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink transition-colors">
              {product.category.name}
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </li>
          <li className="font-medium text-ink truncate max-w-[200px] sm:max-w-none">{product.name}</li>
        </ol>
      </nav>

      {/* Main Product Area */}
      <section className="grid gap-10 lg:grid-cols-2 xl:gap-16">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-surfaceMuted border border-border">
            {imageSrc ? (
              <Image 
                src={imageSrc} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-cover transition-transform duration-500 hover:scale-105" 
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">No Image Available</div>
            )}
            
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyanpop shadow-sm">
                {product.category.name}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Low Stock
                </span>
              )}
            </div>
            
            <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 text-muted backdrop-blur shadow-sm transition-all hover:bg-coral hover:text-white hover:scale-110">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col py-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-widest text-muted">{product.brand}</span>
          </div>
          
          <h1 className="font-display text-4xl font-black text-ink sm:text-5xl leading-[1.1] text-balance">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <RatingStars value={rating} size="md" />
              <a href="#reviews" onClick={() => setActiveTab("reviews")} className="text-sm font-semibold text-cyanpop hover:underline">
                {reviews} Reviews
              </a>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${stockInfo.classes}`}>
              {stockInfo.label}
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.compatibility_tags.map((tag) => (
              <span key={tag} className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted shadow-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="my-8 h-px w-full bg-border"></div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-ink">{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center rounded-xl border border-border bg-surface p-1 shadow-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-lg text-ink hover:bg-surfaceMuted transition-colors disabled:opacity-50"
                disabled={quantity <= 1 || product.stock === 0}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <div className="flex h-12 w-12 items-center justify-center font-mono text-lg font-bold">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-lg text-ink hover:bg-surfaceMuted transition-colors disabled:opacity-50"
                disabled={quantity >= product.stock || product.stock === 0}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
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
              className="flex-1 rounded-xl bg-coral px-8 py-4 text-lg font-bold text-white shadow-lg shadow-coral/20 transition-all hover:-translate-y-0.5 hover:bg-coral/90 hover:shadow-coral/40 disabled:pointer-events-none disabled:opacity-50 btn-press flex items-center justify-center gap-3"
            >
              {addMutation.isPending ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" /></svg>
                  Adding to Cart...
                </>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
          
          <div className="mt-8 rounded-xl border border-border bg-surfaceMuted p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="font-semibold text-ink">Free Shipping & Returns</p>
                <p className="text-sm text-muted">Free standard shipping on orders over $100. Return within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="mt-16 pt-16 border-t border-border">
        <div className="flex border-b border-border">
          <button 
            className={`px-6 py-3 font-display font-bold text-lg transition-colors border-b-2 ${activeTab === 'description' ? 'border-cyanpop text-cyanpop' : 'border-transparent text-muted hover:text-ink'}`}
            onClick={() => setActiveTab('description')}
          >
            Overview
          </button>
          <button 
            className={`px-6 py-3 font-display font-bold text-lg transition-colors border-b-2 ${activeTab === 'specs' ? 'border-cyanpop text-cyanpop' : 'border-transparent text-muted hover:text-ink'}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button 
            id="reviews"
            className={`px-6 py-3 font-display font-bold text-lg transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-cyanpop text-cyanpop' : 'border-transparent text-muted hover:text-ink'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews})
          </button>
        </div>
        
        <div className="py-8 animate-fade-in">
          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-none text-muted">
              <p>{product.description}</p>
              <p>Built for the modern rig, this {product.category.name.toLowerCase()} offers exceptional performance without compromising on reliability. The {product.name} is rigorously tested for compatibility and stability.</p>
            </div>
          )}
          
          {activeTab === 'specs' && (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="bg-surfaceMuted"><th className="px-4 py-3 font-medium text-ink w-1/3">Brand</th><td className="px-4 py-3 text-muted">{product.brand}</td></tr>
                  <tr className="bg-surface"><th className="px-4 py-3 font-medium text-ink">Category</th><td className="px-4 py-3 text-muted">{product.category.name}</td></tr>
                  <tr className="bg-surfaceMuted"><th className="px-4 py-3 font-medium text-ink">Added On</th><td className="px-4 py-3 text-muted">{new Date(product.created_at).toLocaleDateString()}</td></tr>
                  <tr className="bg-surface"><th className="px-4 py-3 font-medium text-ink">Compatibility</th><td className="px-4 py-3 text-muted">{product.compatibility_tags.join(", ")}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-surfaceMuted p-6 px-10 text-center">
                  <span className="font-display text-5xl font-black text-ink">{rating}</span>
                  <RatingStars value={rating} size="md" />
                  <span className="mt-2 text-sm text-muted">Based on {reviews} reviews</span>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-12 text-muted">{star} stars</span>
                      <div className="h-2.5 flex-1 rounded-full bg-surfaceMuted overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${star === Math.round(rating) ? 60 : star > rating ? 5 : 20}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-muted italic">Customer reviews feature is coming soon to this demo.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedQuery.data && relatedQuery.data.length > 0 && (
        <section className="mt-16 pt-16 border-t border-border">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-3xl font-black text-ink">You Might Also Like</h2>
            <Link href={`/products?category=${product.category.slug}`} className="text-sm font-semibold text-cyanpop hover:underline">
              View More {product.category.name}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedQuery.data.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
