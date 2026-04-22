"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { isAuthenticated } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  if (!isAuthenticated()) {
    return <div className="p-6 text-center">Redirecting...</div>;
  }

  return <>{children}</>;
}
