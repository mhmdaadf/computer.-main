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
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://127.0.0.1:8000/admin/";
  const [profileError, setProfileError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [profileForm, setProfileForm] = useState({
    username: "",
    full_name: "",
    phone: "",
  });
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
    onSuccess: (profile) => {
      setProfileForm({
        username: profile.username || "",
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
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

  const profileUpdateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch("/auth/profile/", profileForm);
      return unwrapApi<AuthUser>(response.data);
    },
    onSuccess: () => {
      setProfileError("");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      setProfileError("Failed to update profile. Please verify your details and try again.");
    },
  });

  const addressCreateMutation = useMutation({
    mutationFn: async () => {
      const response = editingAddressId
        ? await api.patch(`/auth/addresses/${editingAddressId}/`, addressForm)
        : await api.post("/auth/addresses/", addressForm);
      return unwrapApi<Address>(response.data);
    },
    onSuccess: () => {
      setAddressError("");
      setEditingAddressId(null);
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

  const addressDeleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/auth/addresses/${id}/`);
      return id;
    },
    onSuccess: () => {
      setAddressError("");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      setAddressError("Failed to delete address. Please try again.");
    },
  });

  const onProfileSubmit = (event: FormEvent) => {
    event.preventDefault();
    setProfileError("");
    profileUpdateMutation.mutate();
  };

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
          <div className="mt-4 rounded-xl border border-ink/10 bg-ink/5 p-3">
            <p className="text-sm font-semibold text-ink">Admin Dashboard</p>
            <p className="mt-1 text-sm text-ink/70">
              URL: <span className="font-mono">{adminUrl}</span>
            </p>
            <a href={adminUrl} target="_self" className="mt-2 inline-block rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-cream">
              Open Admin Dashboard
            </a>
          </div>
          <form onSubmit={onProfileSubmit} className="mt-4 grid gap-2 md:grid-cols-3">
            <input
              placeholder="Username"
              value={profileForm.username}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
              className="rounded-lg border border-ink/20 px-3 py-2"
              required
            />
            <input
              placeholder="Full Name"
              value={profileForm.full_name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
              className="rounded-lg border border-ink/20 px-3 py-2"
            />
            <input
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="rounded-lg border border-ink/20 px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyanpop px-3 py-2 font-bold text-white md:col-span-3"
              disabled={profileUpdateMutation.isPending}
            >
              Save Profile
            </button>
          </form>
          {profileError && <p className="mt-2 text-sm font-semibold text-red-600">{profileError}</p>}
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
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
              {editingAddressId && (
                <button
                  type="button"
                  className="rounded-lg border border-ink/20 px-3 py-2 font-bold text-ink"
                  onClick={() => {
                    setEditingAddressId(null);
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
                  }}
                >
                  Cancel Edit
                </button>
              )}
              {addressError && <p className="text-sm font-semibold text-red-600">{addressError}</p>}
            </form>
            <div className="mt-4 space-y-2">
              {addressQuery.data?.map((address) => (
                <article key={address.id} className="rounded-lg border border-ink/10 p-3">
                  <p className="font-semibold">{address.label} {address.is_default ? "(Default)" : ""}</p>
                  <p className="text-sm text-ink/70">{address.line1}, {address.city}, {address.country}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-ink/20 px-2 py-1 text-xs font-semibold text-ink"
                      onClick={() => {
                        setEditingAddressId(address.id);
                        setAddressForm({
                          label: address.label,
                          line1: address.line1,
                          line2: address.line2,
                          city: address.city,
                          state: address.state,
                          postal_code: address.postal_code,
                          country: address.country,
                          is_default: address.is_default,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700"
                      onClick={() => addressDeleteMutation.mutate(address.id)}
                      disabled={addressDeleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
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
