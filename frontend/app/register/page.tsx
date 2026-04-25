"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { toast } from "@/hooks/useToast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    full_name: "",
    phone: "",
    password: "",
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post("/auth/register/", form);
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Registration failed. Please check your input and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyanpop/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg fade-up">
        <div className="rounded-3xl border border-border bg-surface/80 p-8 sm:p-10 shadow-lg backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-black text-ink">Create an Account</h1>
            <p className="mt-2 text-sm text-muted">Join us to start building your dream setup.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.full_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-muted">Must be at least 8 characters long.</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3.5 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-70 btn-press gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-cyanpop hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
