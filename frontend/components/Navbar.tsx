"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearAuth } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, user } = useAuth();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://127.0.0.1:8000/admin/";

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink md:text-2xl">
          Circuit Cartel
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-ink text-cream" : "bg-white text-ink hover:bg-amberpop/20"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {ready && authenticated && (
            <Link href="/dashboard" className="rounded-full bg-cyanpop px-3 py-1.5 text-sm font-semibold text-white">
              Dashboard
            </Link>
          )}
          {ready && authenticated && (
            <a
              href={adminUrl}
              target="_self"
              className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-sm font-semibold text-ink"
              title={user?.is_staff ? "Open Django Admin Dashboard" : "Admin dashboard (staff only)"}
            >
              Admin Dashboard
            </a>
          )}
          {ready && !authenticated && (
            <Link href="/login" className="rounded-full bg-coral px-3 py-1.5 text-sm font-semibold text-white">
              Login
            </Link>
          )}
          {ready && authenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-sm font-semibold text-ink"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
