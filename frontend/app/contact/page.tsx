"use client";

import { FormEvent, useState } from "react";

import { api } from "@/lib/api";
import { toast } from "@/hooks/useToast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact/", form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Unable to send your message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl fade-up">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-sm">
        <h1 className="font-display text-3xl font-black text-ink">Contact Support</h1>
        <p className="mt-2 text-muted">Need help with compatibility or shipping? Send us a message.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="What is this about?"
              className="w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Describe your issue or question..."
              className="h-36 w-full rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-sm focus:bg-surface focus:ring-2 focus:ring-cyanpop/20 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-coral px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-coral/90 shadow-lg shadow-coral/20 disabled:opacity-60 btn-press flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
