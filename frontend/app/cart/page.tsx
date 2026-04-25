"use client";

import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApi } from "@/lib/api";
import { Cart } from "@/types";
import { formatCurrency, resolveProductImage } from "@/lib/product-ui";
import { toast } from "@/hooks/useToast";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get("/cart/");
      return unwrapApi<Cart>(response.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await api.patch(`/cart/items/${itemId}/`, { quantity });
      return unwrapApi<Cart>(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Failed to update quantity.")
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await api.delete(`/cart/items/${itemId}/remove/`);
      return unwrapApi<Cart>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: () => toast.error("Failed to remove item.")
  });

  const cart = cartQuery.data;

  if (cartQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-10 w-48 rounded bg-surfaceMuted mb-8" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-surfaceMuted" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-surfaceMuted" />
        </div>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="mx-auto max-w-3xl flex flex-col items-center justify-center py-16">
        <EmptyState 
          title="Your cart is empty"
          description="Looks like you haven&apos;t added any components to your rig yet. Start shopping to build your ultimate machine."
          actionLabel="Browse Components"
          actionOnClick={() => window.location.href = '/products'}
        />
      </div>
    );
  }

  const taxAmount = Number(cart.total_price) * 0.08; // Example 8% tax
  const finalTotal = Number(cart.total_price) + taxAmount;

  return (
    <div className="mx-auto max-w-6xl fade-up">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl font-black text-ink">Shopping Cart</h1>
          <p className="mt-2 text-muted">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button 
          className="text-sm font-semibold text-danger-600 hover:text-danger-700 underline"
          onClick={() => {
            if (confirm("Are you sure you want to clear your cart?")) {
              Promise.all(cart.items.map(item => removeMutation.mutateAsync(item.id)))
                .then(() => toast.success("Cart cleared"));
            }
          }}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const imageSrc = resolveProductImage(item.product.image);
            const isUpdating = updateMutation.isPending && updateMutation.variables?.itemId === item.id;
            const isRemoving = removeMutation.isPending && removeMutation.variables === item.id;
            
            return (
              <article 
                key={item.id} 
                className={`flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-opacity ${isRemoving ? 'opacity-50' : 'opacity-100'}`}
              >
                {/* Item Image */}
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-surfaceMuted border border-border">
                  {imageSrc ? (
                    <Image 
                      src={imageSrc} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">No Img</div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyanpop">{item.product.category.name}</p>
                      <Link href={`/products/${item.product.slug}`} className="hover:text-cyanpop transition-colors">
                        <h2 className="font-display text-lg font-bold text-ink line-clamp-2 leading-tight">{item.product.name}</h2>
                      </Link>
                      <p className="mt-1 text-sm text-muted">{item.product.brand}</p>
                    </div>
                    <p className="font-mono text-lg font-bold text-ink whitespace-nowrap">{formatCurrency(item.subtotal)}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border bg-surfaceMuted p-1">
                      <button
                        type="button"
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="flex h-8 w-8 items-center justify-center rounded text-ink hover:bg-surface transition-colors disabled:opacity-50"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                      </button>
                      <div className="flex w-10 items-center justify-center text-sm font-bold">
                        {isUpdating ? <span className="h-4 w-4 border-2 border-cyanpop border-t-transparent rounded-full animate-spin" /> : item.quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        disabled={item.quantity >= item.product.stock || isUpdating}
                        className="flex h-8 w-8 items-center justify-center rounded text-ink hover:bg-surface transition-colors disabled:opacity-50"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={isRemoving}
                      className="text-sm font-semibold text-danger-600 hover:text-danger-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-ink mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-mono text-ink">{formatCurrency(cart.total_price)}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-ink">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              
              <div className="my-4 border-t border-border" />
              
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-ink">Total</span>
                <span className="font-mono text-2xl font-bold text-ink">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-coral px-6 py-4 font-bold text-white shadow-lg shadow-coral/20 transition-all hover:-translate-y-0.5 hover:bg-coral/90 hover:shadow-coral/40 btn-press gap-2"
            >
              Proceed to Checkout
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
