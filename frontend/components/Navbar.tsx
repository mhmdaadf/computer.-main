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
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-ink/95 backdrop-blur-xl shadow-lg shadow-black/20" 
          : "bg-ink"
      }`}
    >
      {/* Subtle gradient accent line at the very top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyanpop via-amberpop to-coral" />

      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-white md:text-2xl flex items-center gap-2 group">
          <span className="bg-gradient-to-br from-cyanpop to-amberpop bg-clip-text text-transparent transition-all group-hover:from-amberpop group-hover:to-cyanpop">Circuit</span>
          <span className="text-white/90">Cartel</span>
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
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    active 
                      ? "text-cyanpop bg-cyanpop/10" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-cyanpop shadow-[0_0_8px_rgba(8,145,178,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="h-6 w-px bg-slate-700"></div>

          <div className="flex items-center gap-3">
            <Link 
              href="/cart" 
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                pathname === "/cart" 
                  ? "bg-cyanpop/15 text-cyanpop" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white shadow-lg shadow-coral/40 ring-2 ring-ink">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {ready && authenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <Link 
                  href="/dashboard" 
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyanpop to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyanpop/30 ring-2 ring-ink transition-all hover:scale-110 hover:shadow-cyanpop/50"
                  title="Dashboard"
                >
                  {getInitials(user?.full_name || user?.username || "")}
                </Link>
              </div>
            ) : ready && !authenticated ? (
              <Link href="/login" className="rounded-full bg-gradient-to-r from-cyanpop to-cyan-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyanpop/25 hover:shadow-cyanpop/40 transition-all hover:-translate-y-0.5 btn-press">
                Sign In
              </Link>
            ) : null}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative text-slate-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white shadow-lg shadow-coral/40">
                {itemCount}
              </span>
            )}
          </Link>
          <button 
            type="button" 
            className="text-slate-300 hover:text-white transition-colors"
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
        <div className="md:hidden border-t border-slate-800 bg-ink/98 backdrop-blur-xl px-4 py-6 shadow-2xl animate-slide-down">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                    active 
                      ? "bg-cyanpop/10 text-cyanpop border border-cyanpop/20" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="my-3 border-t border-slate-800"></div>
            
            {ready && authenticated ? (
              <>
                <div className="px-4 py-3 flex items-center gap-3 rounded-xl bg-slate-800/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyanpop to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyanpop/20">
                    {getInitials(user?.full_name || user?.username || "")}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.username}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="block px-4 py-3 text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                  Dashboard
                </Link>
                {user?.is_staff && (
                  <a href={adminUrl} className="block px-4 py-3 text-base font-semibold text-amberpop hover:bg-amberpop/10 rounded-xl transition-all">
                    Admin Panel
                  </a>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/login" className="w-full rounded-xl bg-gradient-to-r from-cyanpop to-cyan-700 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyanpop/20">
                  Sign In
                </Link>
                <Link href="/register" className="w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white hover:border-slate-600 transition-all">
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
