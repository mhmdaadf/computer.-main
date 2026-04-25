"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api, unwrapApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { AuthUser } from "@/types";
import { toast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login/", { email, password });
      const data = unwrapApi<{ access: string; refresh: string; user: AuthUser }>(response.data);
      setAuth(data.access, data.refresh, data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-cyanpop/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-amberpop/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md fade-up">
        <div className="rounded-3xl border border-border bg-surface/80 p-8 sm:p-10 shadow-lg backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-black text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-muted">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                required
              />
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-semibold text-ink">Password</label>
                <a href="#" className="text-xs font-semibold text-cyanpop hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3.5 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-70 btn-press gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-cyanpop hover:underline transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
