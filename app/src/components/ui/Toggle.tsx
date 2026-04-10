import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  id?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel,
}: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "var(--focus-ring)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
      className={cn(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full",
        "transition-colors outline-none border-0",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      style={{
        width: 48,
        height: 28,
        background: checked ? "var(--sage)" : "rgba(26,31,27,.15)",
        transitionProperty: "background-color",
        transitionDuration: "var(--dur-base)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {/* Thumb */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(26,31,27,.2)",
          transitionProperty: "left",
          transitionDuration: "var(--dur-base)",
          transitionTimingFunction: "var(--ease-spring)",
        }}
      />
    </button>
  );
}

export { Toggle };
export type { ToggleProps };
