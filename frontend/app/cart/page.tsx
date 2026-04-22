"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApi } from "@/lib/api";
import { Cart } from "@/types";

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
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await api.delete(`/cart/items/${itemId}/remove/`);
      return unwrapApi<Cart>(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const cart = cartQuery.data;

  return (
    <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-black">Your Cart</h1>
      {!cart?.items.length && <p className="mt-4 text-ink/70">Your cart is empty.</p>}

      <div className="mt-6 space-y-4">
        {cart?.items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-ink/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">{item.product.name}</h2>
                <p className="text-sm text-ink/65">{item.product.brand}</p>
              </div>
              <p className="font-mono text-lg font-bold">${item.subtotal}</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="w-24 rounded-lg border border-ink/20 px-3 py-2"
                onBlur={(e) => updateMutation.mutate({ itemId: item.id, quantity: Number(e.target.value) || 1 })}
              />
              <button
                type="button"
                onClick={() => removeMutation.mutate(item.id)}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      {cart?.items.length ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-4 text-cream">
          <p className="font-display text-2xl font-bold">Total: ${cart.total_price}</p>
          <Link href="/checkout" className="rounded-full bg-coral px-5 py-2 font-bold text-white">
            Continue to Checkout
          </Link>
        </div>
      ) : null}
    </section>
  );
}
