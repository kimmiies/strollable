import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

// ─── InputLabel ───────────────────────────────────────────────────────────────

interface InputLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
}

function InputLabel({ className, children, required, ...props }: InputLabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "block text-sm font-medium text-[var(--ink-soft)] mb-1.5 select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[var(--terracotta)]" aria-hidden="true">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

// ─── InputHint ────────────────────────────────────────────────────────────────

interface InputHintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}

function InputHint({ className, error, children, ...props }: InputHintProps) {
  return (
    <p
      className={cn(
        "mt-1.5 text-xs",
        error ? "text-[var(--error)]" : "text-[var(--ink-faint)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 flex items-center text-[var(--ink-faint)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base
            "w-full rounded-[var(--r-md)] text-sm text-[var(--ink)]",
            "border transition-all duration-[var(--dur-base)]",
            "placeholder:text-[var(--ink-faint)]",
            "focus:outline-none",
            // Icon padding
            icon ? "pl-10 pr-4 py-2.5" : "px-4 py-2.5",
            // Default state
            !error && !disabled &&
              "bg-[var(--warm-white)] border-[rgba(122,158,126,0.2)]",
            // Focus state (applied via CSS — no JS needed)
            !error &&
              "focus:border-[var(--sage)]",
            // Error state
            error &&
              "bg-[var(--error-light)] border-[var(--error)] focus:border-[var(--error)]",
            // Disabled
            disabled &&
              "bg-[var(--mist)] border-[rgba(26,31,27,0.08)] opacity-50 cursor-not-allowed",
            className
          )}
          style={
            {
              // Focus ring applied inline so it reads the CSS var at runtime
            } as React.CSSProperties
          }
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.boxShadow = error
                ? "0 0 0 3px rgba(192,57,43,.2)"
                : "var(--focus-ring)";
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, InputLabel, InputHint };
export type { InputProps, InputLabelProps, InputHintProps };
