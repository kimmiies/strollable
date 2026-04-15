"use client";

import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

export default function EmptyState({
  Icon,
  title,
  body,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center text-center rounded-[var(--r-lg)] bg-[var(--warm-white)] shadow-[var(--shadow-card)] px-6 py-10 ${className}`}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--mist)" }}
      >
        <Icon
          className="w-6 h-6 text-[var(--ink-soft)]"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="font-display text-[20px] font-normal tracking-[-0.02em] text-[var(--ink)] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[var(--ink-faint)] max-w-[260px] leading-relaxed mb-5">
        {body}
      </p>
      <button
        onClick={onAction}
        className="px-5 h-11 rounded-[var(--r-pill)] bg-[var(--sage-deep)] text-white text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
