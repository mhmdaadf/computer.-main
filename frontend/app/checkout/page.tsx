"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { api, unwrapApi } from "@/lib/api";
import { Address, Cart, Paginated } from "@/types";

function toArrayResponse<T>(payload: T[] | Paginated<T>) {
  return Array.isArray(payload) ? payload : payload.results;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get("/cart/");
      return unwrapApi<Cart>(response.data);
    },
  });

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get("/auth/addresses/");
      const data = unwrapApi<Address[] | Paginated<Address>>(response.data);
      return toArrayResponse(data);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = { address_id: Number(addressId), payment_method: paymentMethod };
      const response = await api.post("/orders/checkout/", payload);
      return unwrapApi(response.data);
    },
    onSuccess: () => {
      setError("");
      router.push("/dashboard");
    },
    onError: () => {
      setError("Unable to place order. Please review your cart and try again.");
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!addressId) {
      setError("Please select a shipping address.");
      return;
    }
    checkoutMutation.mutate();
  };

  return (
    <ProtectedRoute>
      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-black">Checkout</h1>
        <p className="mt-2 text-ink/70">Complete your order with stock-safe checkout processing.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Shipping Address</span>
            <select
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              className="w-full rounded-lg border border-ink/20 px-3 py-2"
            >
              <option value="">Select an address</option>
              {addressesQuery.data?.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label} - {address.line1}, {address.city}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border border-ink/20 px-3 py-2"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Card</option>
            </select>
          </label>

          <div className="rounded-2xl border border-ink/10 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">Order Summary</p>
            <div className="mt-3 space-y-2">
              {cartQuery.data?.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink/75">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-ink">${item.subtotal}</span>
                </div>
              ))}
              {!cartQuery.data?.items.length && <p className="text-sm text-ink/60">Your cart is empty.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-ink p-4 text-cream">
            <p className="text-sm uppercase tracking-wide">Order Total</p>
            <p className="font-mono text-3xl font-bold">${cartQuery.data?.total_price || "0.00"}</p>
          </div>

          <button type="submit" className="rounded-xl bg-coral px-5 py-3 font-bold text-white" disabled={checkoutMutation.isPending}>
            {checkoutMutation.isPending ? "Placing order..." : "Place Order"}
          </button>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        </form>
      </section>
    </ProtectedRoute>
  );
}
