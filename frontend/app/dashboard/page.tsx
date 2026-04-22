"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ProtectedRoute from "@/components/ProtectedRoute";
import { api, unwrapApi } from "@/lib/api";
import { Address, AuthUser, Order, Paginated } from "@/types";

function toArrayResponse<T>(payload: T[] | Paginated<T>) {
  return Array.isArray(payload) ? payload : payload.results;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [addressError, setAddressError] = useState("");
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/auth/profile/");
      return unwrapApi<AuthUser>(response.data);
    },
  });

  const addressQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get("/auth/addresses/");
      const data = unwrapApi<Address[] | Paginated<Address>>(response.data);
      return toArrayResponse(data);
    },
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/");
      return unwrapApi<Paginated<Order>>(response.data).results;
    },
  });

  const addressCreateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/addresses/", addressForm);
      return unwrapApi<Address>(response.data);
    },
    onSuccess: () => {
      setAddressError("");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressForm({
        label: "Home",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
    },
    onError: () => {
      setAddressError("Failed to save address. Please verify the fields and try again.");
    },
  });

  const onAddressSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAddressError("");
    addressCreateMutation.mutate();
  };

  return (
    <ProtectedRoute>
      <section className="space-y-6">
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
          <h1 className="font-display text-3xl font-black">Dashboard</h1>
          <p className="mt-2 text-ink/70">{profileQuery.data?.email}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl font-black">Address Book</h2>
            <form onSubmit={onAddressSubmit} className="mt-4 grid gap-2">
              <input placeholder="Label" value={addressForm.label} onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" />
              <input placeholder="Line 1" value={addressForm.line1} onChange={(e) => setAddressForm((p) => ({ ...p, line1: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" required />
              <input placeholder="Line 2" value={addressForm.line2} onChange={(e) => setAddressForm((p) => ({ ...p, line2: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" />
              <input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" required />
              <input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" required />
              <input placeholder="Postal Code" value={addressForm.postal_code} onChange={(e) => setAddressForm((p) => ({ ...p, postal_code: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" required />
              <input placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} className="rounded-lg border border-ink/20 px-3 py-2" required />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm((p) => ({ ...p, is_default: e.target.checked }))} />
                Set as default
              </label>
              <button type="submit" className="rounded-lg bg-coral px-3 py-2 font-bold text-white disabled:opacity-60" disabled={addressCreateMutation.isPending}>
                Save Address
              </button>
              {addressError && <p className="text-sm font-semibold text-red-600">{addressError}</p>}
            </form>
            <div className="mt-4 space-y-2">
              {addressQuery.data?.map((address) => (
                <article key={address.id} className="rounded-lg border border-ink/10 p-3">
                  <p className="font-semibold">{address.label} {address.is_default ? "(Default)" : ""}</p>
                  <p className="text-sm text-ink/70">{address.line1}, {address.city}, {address.country}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl font-black">Order History</h2>
            <div className="mt-4 space-y-3">
              {ordersQuery.data?.map((order) => (
                <article key={order.id} className="rounded-lg border border-ink/10 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold">Order #{order.id}</p>
                    <span className="rounded-full bg-ink/5 px-2 py-1 text-xs font-semibold">{order.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="mt-1 font-mono text-lg font-bold">${order.total_price}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </ProtectedRoute>
  );
}
