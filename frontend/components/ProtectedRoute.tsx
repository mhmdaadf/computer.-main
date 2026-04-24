"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { isAuthenticated } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    setReady(true);

    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return <div className="p-6 text-center">Redirecting...</div>;
  }

  return <>{children}</>;
}
