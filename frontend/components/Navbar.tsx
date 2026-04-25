"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { clearAuth } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, user } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://127.0.0.1:8000/admin/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-surface/80 backdrop-blur-md shadow-sm border-b border-border" 
          : "bg-surface border-b border-transparent"
      }`}
    >
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink md:text-2xl flex items-center gap-2">
          <span className="bg-gradient-to-br from-cyanpop to-amberpop bg-clip-text text-transparent">Circuit</span>Cartel
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-cyanpop" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyanpop" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center gap-3">
            <Link 
              href="/cart" 
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                pathname === "/cart" ? "bg-cyanpop/10 text-cyanpop" : "text-ink hover:bg-surfaceMuted"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white shadow-sm ring-2 ring-surface">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {ready && authenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <Link 
                  href="/dashboard" 
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyanpop to-blue-600 text-sm font-bold text-white shadow-sm ring-2 ring-surface transition-transform hover:scale-105"
                  title="Dashboard"
                >
                  {getInitials(user?.full_name || user?.username || "")}
                </Link>
              </div>
            ) : ready && !authenticated ? (
              <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ink/90 transition-colors btn-press">
                Sign In
              </Link>
            ) : null}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative text-ink">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button 
            type="button" 
            className="text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-6 shadow-lg animate-slide-down">
          <nav className="flex flex-col gap-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                    active ? "bg-cyanpop/10 text-cyanpop" : "text-ink hover:bg-surfaceMuted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="my-2 border-t border-border"></div>
            
            {ready && authenticated ? (
              <>
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyanpop text-sm font-bold text-white">
                    {getInitials(user?.full_name || user?.username || "")}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{user?.username}</p>
                    <p className="text-sm text-muted">{user?.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="block px-3 py-2 text-base font-semibold text-ink hover:bg-surfaceMuted rounded-lg">
                  Dashboard
                </Link>
                {user?.is_staff && (
                  <a href={adminUrl} className="block px-3 py-2 text-base font-semibold text-amberpop hover:bg-amberpop/10 rounded-lg">
                    Admin Panel
                  </a>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-danger-600 hover:bg-danger-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="w-full rounded-lg bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
                  Sign In
                </Link>
                <Link href="/register" className="w-full rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold text-ink">
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
