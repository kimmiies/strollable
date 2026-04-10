"use client";

import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "warning" | "error" | "badge";

interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  duration?: number;
}

// ─── Module-level state (no extra deps) ──────────────────────────────────────

type Listener = (toasts: ToastData[]) => void;
let _toasts: ToastData[] = [];
const _listeners: Set<Listener> = new Set();

function _notify() {
  _listeners.forEach((l) => l([..._toasts]));
}

function _add(data: Omit<ToastData, "id">) {
  _toasts = [..._toasts, { ...data, id: `${Date.now()}-${Math.random()}` }];
  _notify();
}

function _remove(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id);
  _notify();
}

// ─── Public toast() API ───────────────────────────────────────────────────────

export const toast = {
  success: (title: string, opts?: Partial<Omit<ToastData, "id" | "variant" | "title">>) =>
    _add({ variant: "success", title, ...opts }),
  warning: (title: string, opts?: Partial<Omit<ToastData, "id" | "variant" | "title">>) =>
    _add({ variant: "warning", title, ...opts }),
  error: (title: string, opts?: Partial<Omit<ToastData, "id" | "variant" | "title">>) =>
    _add({ variant: "error", title, ...opts }),
  badge: (title: string, opts?: Partial<Omit<ToastData, "id" | "variant" | "title">>) =>
    _add({ variant: "badge", title, ...opts }),
};

// ─── Internal hook ────────────────────────────────────────────────────────────

function useToastState() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  React.useEffect(() => {
    setToasts([..._toasts]);
    _listeners.add(setToasts);
    return () => { _listeners.delete(setToasts); };
  }, []);
  return toasts;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, { container: string; title: string; description: string }> = {
  success: {
    container: "bg-[var(--ink)] border-transparent",
    title:     "text-white",
    description: "text-white/70",
  },
  warning: {
    container: "bg-[var(--butter-light)] border-[rgba(212,149,42,0.25)]",
    title:     "text-[var(--ink)]",
    description: "text-[var(--ink-soft)]",
  },
  error: {
    container: "bg-[var(--error-light)] border-[rgba(192,57,43,0.25)]",
    title:     "text-[var(--error)]",
    description: "text-[var(--ink-soft)]",
  },
  badge: {
    container: "bg-[var(--butter-light)] border-[rgba(212,149,42,0.25)]",
    title:     "text-[var(--ink)]",
    description: "text-[var(--ink-soft)]",
  },
};

// ─── ToastItem ────────────────────────────────────────────────────────────────

function ToastItem({ id, variant, title, description, icon, duration = 4000 }: ToastData) {
  const styles = variantStyles[variant];

  return (
    <RadixToast.Root
      duration={duration}
      onOpenChange={(open) => { if (!open) _remove(id); }}
      className={cn(
        "group relative flex items-start gap-3 p-4 pr-10 rounded-[var(--r-lg)] border",
        "shadow-[var(--shadow-float)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in-0",
        "data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out-0",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:animate-out",
        "transition-all duration-[var(--dur-base)] ease-[var(--ease-spring)]",
        styles.container
      )}
    >
      {/* Icon slot */}
      {icon && (
        <span className="flex-shrink-0 mt-0.5">{icon}</span>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0">
        <RadixToast.Title className={cn("text-sm font-semibold leading-snug", styles.title)}>
          {title}
        </RadixToast.Title>
        {description && (
          <RadixToast.Description className={cn("mt-0.5 text-xs leading-relaxed", styles.description)}>
            {description}
          </RadixToast.Description>
        )}
      </div>

      {/* Close */}
      <RadixToast.Close
        aria-label="Dismiss"
        className={cn(
          "absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full",
          "opacity-60 hover:opacity-100 transition-opacity",
          variant === "success" ? "text-white hover:bg-white/15" : "text-[var(--ink-soft)] hover:bg-[rgba(26,31,27,0.08)]"
        )}
      >
        <X className="w-3.5 h-3.5" />
      </RadixToast.Close>
    </RadixToast.Root>
  );
}

// ─── ToastProvider (wraps the app once) ──────────────────────────────────────

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toasts = useToastState();

  return (
    <RadixToast.Provider swipeDirection="right">
      {children}

      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}

      {/* Viewport: top-center on mobile, bottom-right on desktop */}
      <RadixToast.Viewport
        className={cn(
          "fixed z-[100] flex flex-col gap-2 p-4 max-w-[min(420px,calc(100vw-2rem))] w-full",
          // Mobile: top-center
          "top-4 left-1/2 -translate-x-1/2",
          // Desktop: bottom-right, no translate
          "lg:top-auto lg:bottom-6 lg:right-6 lg:left-auto lg:translate-x-0",
          "outline-none"
        )}
      />
    </RadixToast.Provider>
  );
}
