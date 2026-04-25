"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

import ProtectedRoute from "@/components/ProtectedRoute";
import { api, unwrapApi } from "@/lib/api";
import { Address, Cart, Paginated } from "@/types";
import { formatCurrency, resolveProductImage } from "@/lib/product-ui";
import { toast } from "@/hooks/useToast";

function toArrayResponse<T>(payload: T[] | Paginated<T>) {
  return Array.isArray(payload) ? payload : payload.results;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  
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
      const addresses = toArrayResponse(data);
      if (addresses.length > 0 && !addressId) {
        setAddressId(String(addresses[0].id));
      }
      return addresses;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = { address_id: Number(addressId), payment_method: paymentMethod };
      const response = await api.post("/orders/checkout/", payload);
      return unwrapApi(response.data);
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Unable to place order. Some items might be out of stock.");
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!addressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    checkoutMutation.mutate();
  };

  const taxAmount = Number(cartQuery.data?.total_price || 0) * 0.08;
  const finalTotal = Number(cartQuery.data?.total_price || 0) + taxAmount;

  if (cartQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse p-4">
        <div className="h-8 w-48 rounded bg-surfaceMuted mb-8" />
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 h-96 rounded-2xl bg-surfaceMuted" />
          <div className="lg:col-span-2 h-96 rounded-2xl bg-surfaceMuted" />
        </div>
      </div>
    );
  }

  if (!cartQuery.data?.items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-ink/5 p-6 text-ink/40">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Your cart is empty</h2>
        <p className="mt-2 text-muted">Add some items to your cart before checking out.</p>
        <button onClick={() => router.push("/products")} className="mt-6 rounded-full bg-ink px-6 py-2.5 font-bold text-white btn-press">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl fade-up">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-black text-ink">Checkout</h1>
          <p className="mt-2 text-muted">Complete your order details below.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 xl:gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-3 space-y-8">
            <form id="checkout-form" onSubmit={onSubmit} className="space-y-8">
              
              {/* Shipping Section */}
              <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyanpop text-sm font-bold text-white">1</div>
                  <h2 className="font-display text-2xl font-bold text-ink">Shipping Address</h2>
                </div>
                
                {addressesQuery.isLoading ? (
                  <div className="h-32 animate-pulse rounded-xl bg-surfaceMuted"></div>
                ) : addressesQuery.data?.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center">
                    <p className="text-muted mb-4">You don&apos;t have any shipping addresses saved.</p>
                    <button type="button" onClick={() => router.push('/dashboard')} className="rounded-lg border border-border px-4 py-2 font-semibold hover:bg-surfaceMuted transition-colors">
                      Add Address in Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addressesQuery.data?.map((address) => (
                      <label 
                        key={address.id} 
                        className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                          addressId === String(address.id) 
                            ? 'border-cyanpop bg-cyanpop/5 shadow-sm ring-1 ring-cyanpop' 
                            : 'border-border bg-surface hover:border-ink/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={addressId === String(address.id)}
                          onChange={(e) => setAddressId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink">{address.label}</span>
                            {addressId === String(address.id) && (
                              <svg className="h-5 w-5 text-cyanpop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-muted block truncate">{address.line1}</span>
                          <span className="text-sm text-muted">{address.city}, {address.postal_code}</span>
                          <span className="text-sm text-muted">{address.country}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Payment Section */}
              <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyanpop text-sm font-bold text-white">2</div>
                  <h2 className="font-display text-2xl font-bold text-ink">Payment Method</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label 
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                      paymentMethod === "COD" 
                        ? 'border-cyanpop bg-cyanpop/5 shadow-sm ring-1 ring-cyanpop' 
                        : 'border-border bg-surface hover:border-ink/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surfaceMuted text-ink">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-ink">Cash on Delivery</span>
                        <span className="text-xs text-muted">Pay when you receive it</span>
                      </div>
                    </div>
                  </label>

                  <label 
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                      paymentMethod === "CARD" 
                        ? 'border-cyanpop bg-cyanpop/5 shadow-sm ring-1 ring-cyanpop' 
                        : 'border-border bg-surface hover:border-ink/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surfaceMuted text-ink">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-ink">Credit Card</span>
                        <span className="text-xs text-muted">Secured via Stripe</span>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

            </form>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-ink mb-6">Order Summary</h3>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartQuery.data?.items.map((item) => {
                  const imageSrc = resolveProductImage(item.product.image);
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surfaceMuted border border-border">
                        {imageSrc ? (
                          <Image src={imageSrc} alt={item.product.name} fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <span className="text-sm font-semibold text-ink line-clamp-1">{item.product.name}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted">Qty: {item.quantity}</span>
                          <span className="font-mono text-sm font-bold text-ink">{formatCurrency(item.subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="my-6 border-t border-border" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-ink">{formatCurrency(cartQuery.data?.total_price || 0)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Taxes (8%)</span>
                  <span className="font-mono text-ink">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="my-6 border-t border-border" />

              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-ink">Total</span>
                <span className="font-mono text-3xl font-black text-ink">{formatCurrency(finalTotal)}</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={checkoutMutation.isPending || !addressId}
                className="w-full rounded-xl bg-coral px-6 py-4 font-bold text-white shadow-lg shadow-coral/20 transition-all hover:-translate-y-0.5 hover:bg-coral/90 hover:shadow-coral/40 disabled:pointer-events-none disabled:opacity-50 btn-press flex items-center justify-center gap-2"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order Now
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
