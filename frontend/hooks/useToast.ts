import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global state for toasts
let listeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

export const toast = {
  add: (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };
    toasts = [...toasts, newToast];
    listeners.forEach((listener) => listener(toasts));

    setTimeout(() => {
      toast.remove(id);
    }, 3000);
  },
  success: (message: string) => toast.add(message, "success"),
  error: (message: string) => toast.add(message, "error"),
  info: (message: string) => toast.add(message, "info"),
  remove: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  },
};

export function useToast() {
  const [state, setState] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return { toasts: state, toast };
}
