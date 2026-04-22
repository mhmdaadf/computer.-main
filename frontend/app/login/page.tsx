"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api, unwrapApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { AuthUser } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login/", { email, password });
      const data = unwrapApi<{ access: string; refresh: string; user: AuthUser }>(response.data);
      setAuth(data.access, data.refresh, data.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Invalid credentials.");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-black">Sign In</h1>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ink/20 px-3 py-2"
          required
        />
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-coral py-2 font-bold text-white">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-ink/70">
        No account? <Link href="/register" className="font-semibold text-cyanpop">Create one</Link>
      </p>
    </section>
  );
}
