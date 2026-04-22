"use client";

import { FormEvent, useState } from "react";

import { api } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await api.post("/contact/", form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Unable to send your message right now. Please try again.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-6 shadow-card">
      <h1 className="font-display text-3xl font-black">Contact Support</h1>
      <p className="mt-2 text-ink/70">Need help with compatibility or shipping? Send us a message.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="w-full rounded-lg border border-ink/20 px-3 py-2" required />
        <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" placeholder="Email" className="w-full rounded-lg border border-ink/20 px-3 py-2" required />
        <input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="w-full rounded-lg border border-ink/20 px-3 py-2" required />
        <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Message" className="h-32 w-full rounded-lg border border-ink/20 px-3 py-2" required />
        <button type="submit" className="rounded-lg bg-coral px-5 py-2 font-bold text-white">Send Message</button>
      </form>
      {success && <p className="mt-3 text-sm font-semibold text-emerald-600">Message sent successfully.</p>}
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </section>
  );
}
