"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    full_name: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/auth/register/", form);
      router.push("/login");
    } catch {
      setError("Registration failed. Please check your input.");
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-black">Create Account</h1>
      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="rounded-lg border border-ink/20 px-3 py-2"
          required
        />
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          className="rounded-lg border border-ink/20 px-3 py-2"
          required
        />
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
          className="rounded-lg border border-ink/20 px-3 py-2"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          className="rounded-lg border border-ink/20 px-3 py-2"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="rounded-lg border border-ink/20 px-3 py-2"
          required
        />
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" className="rounded-lg bg-coral py-2 font-bold text-white">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-ink/70">
        Already have an account? <Link href="/login" className="font-semibold text-cyanpop">Sign in</Link>
      </p>
    </section>
  );
}
