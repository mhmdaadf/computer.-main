"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { api, unwrapApi } from "@/lib/api";
import { Product } from "@/types";
import { formatCurrency, resolveProductImage, stockTone } from "@/lib/product-ui";
import QuickViewModal from "./QuickViewModal";
import { toast } from "@/hooks/useToast";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const imageSrc = resolveProductImage(product.image);
  const stockInfo = stockTone(product.stock);

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
      toast.success(`Added ${product.name} to cart`);
      setIsQuickViewOpen(false);
    },
    onError: () => {
      toast.error("Failed to add to cart. Please try again.");
    }
  });

  const handleAdd = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    addMutation.mutate();
  };

  return (
    <>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface soft-card">


        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surfaceMuted">
          {imageSrc ? (
            <Image 
              src={imageSrc} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No Image</div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="translate-y-4 rounded-full bg-surface px-6 py-2.5 font-semibold text-ink shadow-lg transition-all duration-300 hover:bg-cyanpop hover:text-white group-hover:translate-y-0 btn-press"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-cyanpop">{product.category.name}</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${stockInfo.classes}`}>
              {stockInfo.label}
            </span>
          </div>
          
          <Link href={`/products/${product.slug}`} className="group-hover:text-cyanpop transition-colors">
            <h3 className="font-display text-lg font-bold text-ink line-clamp-2 leading-tight">{product.name}</h3>
          </Link>
          


          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.compatibility_tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded border border-border bg-surfaceMuted px-1.5 py-0.5 text-[10px] font-medium text-muted">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-auto pt-5 flex items-end justify-between">
            <span className="font-mono text-xl font-bold text-ink">{formatCurrency(product.price)}</span>
            
            <button
              type="button"
              onClick={handleAdd}
              disabled={addMutation.isPending || product.stock === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white transition-all hover:bg-coral/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md btn-press"
              aria-label="Add to cart"
            >
              {addMutation.isPending ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </article>

      <QuickViewModal 
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAdd={() => handleAdd()}
        isAdding={addMutation.isPending}
      />
    </>
  );
}
