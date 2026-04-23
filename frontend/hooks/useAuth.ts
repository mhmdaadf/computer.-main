"use client";

import { useEffect, useState } from "react";

import { getAuthEventName, getAuthUser, isAuthenticated } from "@/lib/auth";
import { AuthUser } from "@/types";

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncAuthState = () => {
      setAuthenticated(isAuthenticated());
      setUser(getAuthUser());
    };

    syncAuthState();
    setReady(true);

    const authEventName = getAuthEventName();
    window.addEventListener(authEventName, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(authEventName, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  return { ready, authenticated, user };
}
