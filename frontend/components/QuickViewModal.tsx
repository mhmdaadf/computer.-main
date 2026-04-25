"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency, resolveProductImage, stockTone } from "@/lib/product-ui";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  isAdding: boolean;
}

export default function QuickViewModal({ product, isOpen, onClose, onAdd, isAdding }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !product) return null;

  const imageSrc = resolveProductImage(product.image);
  const stockInfo = stockTone(product.stock);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-surface shadow-2xl animate-fade-in-scale flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-surface/80 p-2 text-muted backdrop-blur hover:bg-surface hover:text-ink"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-64 w-full bg-gradient-to-br from-cyanpop/10 to-amberpop/10 md:h-auto md:w-1/2 flex-shrink-0">
          {imageSrc ? (
            <Image 
              src={imageSrc} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover" 
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No Image</div>
          )}
        </div>

        <div className="flex flex-col p-6 md:p-8 overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-cyanpop">{product.category.name}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{product.name}</h2>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {product.compatibility_tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md bg-surfaceMuted px-2 py-1 text-xs font-medium text-muted border border-border">
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>
          
          <div className="mt-auto pt-8">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-3xl font-bold text-ink">{formatCurrency(product.price)}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${stockInfo.classes}`}>
                {stockInfo.label}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onAdd(product)}
                disabled={product.stock === 0 || isAdding}
                className="flex-1 rounded-xl bg-coral px-6 py-3.5 font-bold text-white transition-colors hover:bg-coral/90 disabled:cursor-not-allowed disabled:bg-muted btn-press flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="flex items-center justify-center rounded-xl border-2 border-border px-6 py-3.5 font-bold text-ink transition-colors hover:border-ink hover:bg-ink/5"
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
