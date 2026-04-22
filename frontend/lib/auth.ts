import { AuthUser } from "@/types";

const ACCESS_KEY = "pcs_access";
const REFRESH_KEY = "pcs_refresh";
const USER_KEY = "pcs_user";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function setAuth(access: string, refresh: string, user: AuthUser) {
  if (!canUseStorage()) return;
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (!canUseStorage()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  if (!canUseStorage()) return "";
  return localStorage.getItem(ACCESS_KEY) || "";
}

export function getRefreshToken() {
  if (!canUseStorage()) return "";
  return localStorage.getItem(REFRESH_KEY) || "";
}

export function setAccessToken(access: string) {
  if (!canUseStorage()) return;
  localStorage.setItem(ACCESS_KEY, access);
}

export function getAuthUser(): AuthUser | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
