"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, InputLabel, InputHint } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setAuthError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/callback`,
    });
    if (error) { setAuthError(error.message); return; }
    setSentEmail(data.email);
    setSent(true);
  }

  return (
    <div>
      {/* Lock icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--mist)", color: "var(--sage-deep)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="font-display text-[26px] font-light tracking-[-0.025em] text-[var(--ink)] mb-1.5">
        Forgot your password?
      </h1>
      <p className="text-sm text-[var(--ink-faint)] mb-7 leading-relaxed">
        Enter your email and we&apos;ll send a reset link. No stroller left behind.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hello@example.com"
            error={!!errors.email}
            icon={<Mail className="w-4 h-4" />}
            {...register("email")}
          />
          {errors.email && <InputHint error>{errors.email.message}</InputHint>}
        </div>

        {authError && (
          <p className="text-sm text-[var(--error)] bg-[var(--error-light)] px-4 py-3 rounded-[var(--r-md)]">
            {authError}
          </p>
        )}

        <Button
          type="submit"
          variant="sage"
          size="default"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      {/* Inline confirmation — shown after submit, no redirect */}
      {sent && (
        <div
          className="mt-5 px-4 py-4 rounded-[var(--r-md)] text-center"
          style={{
            background: "var(--mist)",
            border: "1px solid rgba(122,158,126,.2)",
          }}
        >
          <div className="text-2xl mb-2">📬</div>
          <p className="text-sm font-medium text-[var(--sage-deep)] mb-1">
            Check your inbox
          </p>
          <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
            We sent a link to <span className="font-medium">{sentEmail}</span>.
            Expires in 15 minutes.
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="text-[13px] text-[var(--ink-faint)] text-center mt-5">
        <Link
          href="/login"
          className="text-[var(--sage-deep)] underline hover:text-[var(--sage)]"
        >
          ← Back to log in
        </Link>
      </p>
    </div>
  );
}
