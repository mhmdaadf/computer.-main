"use client";

import React, { FormEvent, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute";
import { api, unwrapApi } from "@/lib/api";
import { Address, AuthUser, Order, Paginated } from "@/types";
import { formatCurrency } from "@/lib/product-ui";
import { toArrayResponse } from "@/lib/utils";
import { toast } from "@/hooks/useToast";



export default function DashboardPage() {
  const queryClient = useQueryClient();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://127.0.0.1:8000/admin/";
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "settings">("overview");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  
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
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfileForm({
        username: profileQuery.data.username || "",
        full_name: profileQuery.data.full_name || "",
        phone: profileQuery.data.phone || "",
      });
    }
  }, [profileQuery.data]);

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
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
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
      toast.success(editingAddressId ? "Address updated" : "Address added");
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
      setActiveTab("addresses");
    },
    onError: () => {
      toast.error("Failed to save address. Please verify fields.");
    },
  });

  const addressDeleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/auth/addresses/${id}/`);
      return id;
    },
    onSuccess: () => {
      toast.success("Address deleted");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to delete address.");
    },
  });

  const onProfileSubmit = (event: FormEvent) => {
    event.preventDefault();
    profileUpdateMutation.mutate();
  };

  const onAddressSubmit = (event: FormEvent) => {
    event.preventDefault();
    addressCreateMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-surfaceMuted text-ink border-border';
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl fade-up">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black text-ink">My Dashboard</h1>
            <p className="mt-2 text-muted">Welcome back, {profileQuery.data?.full_name || profileQuery.data?.username || 'User'}</p>
          </div>
          {profileQuery.data?.is_staff && (
            <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amberpop px-4 py-2.5 font-bold text-ink shadow-sm transition-transform hover:-translate-y-0.5">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Admin Panel
            </a>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex overflow-x-auto border-b border-border hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
            { id: "orders", label: "Order History", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
            { id: "addresses", label: "Saved Addresses", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "settings", label: "Profile Settings", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as "overview" | "orders" | "addresses" | "settings");
                setEditingAddressId(null);
              }}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "border-cyanpop text-cyanpop"
                  : "border-transparent text-muted hover:border-border hover:text-ink"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyanpop/10 text-cyanpop mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-muted">Total Orders</p>
                  <p className="mt-1 font-display text-3xl font-black text-ink">{ordersQuery.data?.length || 0}</p>
                </div>
                
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-muted">Total Spent</p>
                  <p className="mt-1 font-mono text-3xl font-black text-ink">
                    {formatCurrency(ordersQuery.data?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amberpop/10 text-amberpop mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-muted">Saved Addresses</p>
                  <p className="mt-1 font-display text-3xl font-black text-ink">{addressQuery.data?.length || 0}</p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-muted">Account Status</p>
                  <p className="mt-1 font-display text-3xl font-black text-ink">Active</p>
                </div>
              </div>

              {/* Recent Orders Summary */}
              <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-ink">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-sm font-semibold text-cyanpop hover:underline">View All</button>
                </div>
                
                {ordersQuery.data && ordersQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {ordersQuery.data.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4 hover:bg-surfaceMuted transition-colors">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-ink">Order #{order.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-mono text-lg font-bold text-ink">{formatCurrency(order.total_price)}</p>
                          <p className="text-xs text-muted">{order.items?.length || 0} items</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border py-12 text-center">
                    <p className="text-muted">No orders found.</p>
                    <Link href="/products" className="mt-4 inline-block rounded-lg bg-surfaceMuted px-4 py-2 font-semibold text-ink border border-border hover:bg-surface">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-border">
                <h2 className="font-display text-2xl font-bold text-ink">Order History</h2>
                <p className="mt-1 text-muted">View and track all your past orders.</p>
              </div>
              
              {ordersQuery.isLoading ? (
                <div className="p-8 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-surfaceMuted animate-pulse rounded-xl" />)}
                </div>
              ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surfaceMuted text-muted font-semibold">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ordersQuery.data.map((order) => (
                        <React.Fragment key={order.id}>
                        <tr className="hover:bg-surfaceMuted/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-ink">#{order.id}</td>
                          <td className="px-6 py-4 text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-ink">{formatCurrency(order.total_price)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              className="text-cyanpop font-semibold hover:underline"
                            >
                              {expandedOrderId === order.id ? "Hide" : "View Details"}
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 bg-surfaceMuted/50">
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-4 text-sm text-muted mb-3">
                                  <span><strong className="text-ink">Payment:</strong> {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Credit Card'}</span>
                                  {order.shipping_full_text && <span><strong className="text-ink">Ships to:</strong> {order.shipping_full_text}</span>}
                                </div>
                                <div className="rounded-lg border border-border overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead className="bg-surface">
                                      <tr>
                                        <th className="text-left px-4 py-2 font-semibold text-muted">Product</th>
                                        <th className="text-left px-4 py-2 font-semibold text-muted">Qty</th>
                                        <th className="text-left px-4 py-2 font-semibold text-muted">Unit Price</th>
                                        <th className="text-right px-4 py-2 font-semibold text-muted">Line Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {order.items.map((item) => (
                                        <tr key={item.id}>
                                          <td className="px-4 py-2 text-ink font-medium">{item.product_name}</td>
                                          <td className="px-4 py-2 text-muted">{item.quantity}</td>
                                          <td className="px-4 py-2 font-mono text-muted">{formatCurrency(item.unit_price)}</td>
                                          <td className="px-4 py-2 font-mono text-ink text-right">{formatCurrency(item.line_total)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surfaceMuted text-muted mb-4">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">No orders yet</h3>
                  <p className="mt-2 text-muted">When you place an order, it will appear here.</p>
                  <Link href="/products" className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 font-bold text-white btn-press">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display text-2xl font-bold text-ink mb-6">Saved Addresses</h2>
                
                {addressQuery.isLoading ? (
                  <div className="space-y-4">
                    {[1,2].map(i => <div key={i} className="h-32 bg-surfaceMuted animate-pulse rounded-2xl" />)}
                  </div>
                ) : addressQuery.data && addressQuery.data.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {addressQuery.data.map((address) => (
                      <article key={address.id} className="relative rounded-2xl border border-border bg-surface p-6 shadow-sm hover:border-cyanpop/30 transition-colors">
                        {address.is_default && (
                          <span className="absolute top-4 right-4 rounded-full bg-cyanpop/10 px-2.5 py-0.5 text-xs font-bold text-cyanpop">
                            Default
                          </span>
                        )}
                        <h3 className="font-bold text-ink text-lg">{address.label}</h3>
                        <div className="mt-3 space-y-1 text-sm text-muted">
                          <p>{address.line1}</p>
                          {address.line2 && <p>{address.line2}</p>}
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingAddressId(address.id);
                              setAddressForm({
                                label: address.label,
                                line1: address.line1,
                                line2: address.line2 || "",
                                city: address.city,
                                state: address.state,
                                postal_code: address.postal_code,
                                country: address.country,
                                is_default: address.is_default,
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="rounded-lg border border-border bg-surfaceMuted px-4 py-2 text-sm font-semibold text-ink hover:bg-border/50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this address?")) {
                                addressDeleteMutation.mutate(address.id);
                              }
                            }}
                            disabled={addressDeleteMutation.isPending}
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                    <p className="text-muted mb-4">No saved addresses found.</p>
                    <button 
                      onClick={() => setEditingAddressId(null)}
                      className="rounded-lg bg-surfaceMuted px-4 py-2 font-semibold text-ink border border-border"
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-24 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-ink mb-6">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h2>
                  <form onSubmit={onAddressSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-ink">Label (e.g. Home, Office)</label>
                        <input value={addressForm.label} onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-ink">Address Line 1</label>
                        <input value={addressForm.line1} onChange={(e) => setAddressForm((p) => ({ ...p, line1: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-ink">Address Line 2 (Optional)</label>
                        <input value={addressForm.line2} onChange={(e) => setAddressForm((p) => ({ ...p, line2: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">City</label>
                        <input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">State / Province</label>
                        <input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">Postal Code</label>
                        <input value={addressForm.postal_code} onChange={(e) => setAddressForm((p) => ({ ...p, postal_code: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">Country</label>
                        <input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} className="w-full rounded-lg border border-border bg-surfaceMuted px-3 py-2 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20" required />
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2 text-sm mt-4 cursor-pointer">
                      <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm((p) => ({ ...p, is_default: e.target.checked }))} className="h-4 w-4 rounded border-border text-cyanpop focus:ring-cyanpop" />
                      Set as default shipping address
                    </label>
                    
                    <div className="pt-4 flex gap-3">
                      <button type="submit" className="flex-1 rounded-xl bg-ink px-4 py-3 font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 btn-press" disabled={addressCreateMutation.isPending}>
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </button>
                      {editingAddressId && (
                        <button
                          type="button"
                          className="rounded-xl border border-border bg-surface px-4 py-3 font-bold text-ink transition-colors hover:bg-surfaceMuted"
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({
                              label: "Home", line1: "", line2: "", city: "", state: "", postal_code: "", country: "", is_default: false,
                            });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-3xl space-y-8">
              <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-ink mb-6">Profile Information</h2>
                <form onSubmit={onProfileSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-ink">Email Address</label>
                      <input 
                        value={profileQuery.data?.email || ""} 
                        disabled 
                        className="w-full rounded-xl border border-border bg-surfaceMuted/50 px-4 py-3 text-sm text-muted cursor-not-allowed" 
                      />
                      <p className="mt-1 text-xs text-muted">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-ink">Username</label>
                      <input
                        value={profileForm.username}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-ink">Full Name</label>
                      <input
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-ink">Phone Number</label>
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyanpop px-8 py-3 font-bold text-white shadow-lg shadow-cyanpop/20 transition-all hover:-translate-y-0.5 hover:shadow-cyanpop/40 disabled:opacity-60 btn-press"
                      disabled={profileUpdateMutation.isPending}
                    >
                      {profileUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </section>

              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
                <p className="text-sm text-red-700 mb-6">Permanently delete your account and all associated data.</p>
                <button className="rounded-xl border border-red-300 bg-white px-6 py-3 font-bold text-red-700 transition-colors hover:bg-red-100">
                  Delete Account
                </button>
              </section>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
