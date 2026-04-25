"use client";

import { useToast } from "@/hooks/useToast";

export default function ToastGlobal() {
  const { toasts, toast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] max-w-sm rounded-xl p-4 shadow-hover animate-toast-in ${
            t.type === "success"
              ? "bg-success-50 border border-success-100 text-success-700"
              : t.type === "error"
              ? "bg-danger-50 border border-danger-100 text-danger-700"
              : "bg-surface border border-border text-ink"
          }`}
        >
          <div className="flex items-center gap-3">
            {t.type === "success" && (
              <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t.type === "error" && (
              <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {t.type === "info" && (
              <svg className="w-5 h-5 text-cyanpop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-semibold">{t.message}</p>
          </div>
          <button
            onClick={() => toast.remove(t.id)}
            className="text-muted hover:text-ink transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
