import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-ink/5 p-6 text-ink/40">
        {icon || (
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="mb-2 font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-coral/90 btn-press">
          {actionLabel}
        </Link>
      )}
      
      {actionLabel && actionOnClick && (
        <button onClick={actionOnClick} className="rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-coral/90 btn-press">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
