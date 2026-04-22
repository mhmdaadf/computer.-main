"use client";

import { useEffect, useState } from "react";

import { getAuthUser, isAuthenticated } from "@/lib/auth";
import { AuthUser } from "@/types";

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getAuthUser());
    setReady(true);
  }, []);

  return { ready, authenticated, user };
}
