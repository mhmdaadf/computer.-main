import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

import { clearAuth, getAccessToken, getRefreshToken, setAccessToken } from "@/lib/auth";
import { ApiEnvelope } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  request: RetryConfig;
}

export const api = axios.create({
  baseURL: API_BASE,
});

function withAuthorizationHeader(config: RetryConfig, token: string) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  } else if (!(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }
  config.headers.set("Authorization", `Bearer ${token}`);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    withAuthorizationHeader(config as RetryConfig, token);
  }
  return config;
});

let isRefreshing = false;
let waitingQueue: QueueItem[] = [];

function resolveWaitingQueue(token: string) {
  waitingQueue.forEach(({ resolve, request }) => {
    withAuthorizationHeader(request, token);
    resolve(api(request));
  });
  waitingQueue = [];
}

function rejectWaitingQueue(error: unknown) {
  waitingQueue.forEach(({ reject }) => reject(error));
  waitingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as RetryConfig;
    const status = error.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push({ resolve, reject, request: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post<ApiEnvelope<{ access: string }>>(`${API_BASE}/auth/refresh/`, {
        refresh,
      });
      const newAccess = refreshResponse.data.data.access;
      setAccessToken(newAccess);

      resolveWaitingQueue(newAccess);
      withAuthorizationHeader(originalRequest, newAccess);
      return api(originalRequest);
    } catch (refreshError) {
      rejectWaitingQueue(refreshError);
      clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export function unwrapApi<T>(payload: ApiEnvelope<T>) {
  return payload.data;
}
