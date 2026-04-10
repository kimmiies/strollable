import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "sage" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "default" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)] border-transparent",
  sage:
    "bg-[var(--sage)] text-white hover:bg-[var(--sage-deep)] border-transparent",
  secondary:
    "bg-transparent text-[var(--ink)] border-[rgba(26,31,27,0.18)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]",
  ghost:
    "bg-[var(--mist)] text-[var(--ink-soft)] border-transparent hover:bg-[var(--sage-light)] hover:text-[var(--sage-deep)]",
  danger:
    "bg-[var(--terra-light)] text-[var(--terracotta)] border-transparent hover:opacity-80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:      "min-h-[36px] px-4 py-1.5 text-[13px]",
  default: "min-h-[var(--touch-min)] px-5 py-2.5 text-sm",
  lg:      "min-h-[var(--touch-fab)] px-6 py-3 text-base",
  icon:    "w-[var(--touch-min)] h-[var(--touch-min)] p-0 rounded-full",
};

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2 font-medium",
          "border transition-all select-none cursor-pointer",
          "focus-visible:outline-none",
          // Pill shape (all variants)
          size === "icon" ? "rounded-full" : "rounded-[var(--r-pill)]",
          // Variant + size
          variantStyles[variant],
          sizeStyles[size],
          // Disabled
          disabled && "opacity-40 pointer-events-none",
          className
        )}
        style={
          {
            "--tw-shadow": "none",
            boxShadow: "none",
          } as React.CSSProperties
        }
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "var(--focus-ring)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
