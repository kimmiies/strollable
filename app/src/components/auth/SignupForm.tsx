"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input, InputLabel, InputHint } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

// ─── Google SVG ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignupForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setAuthError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { display_name: data.display_name } },
    });
    if (error) { setAuthError(error.message); return; }
    setSuccess(true);
    setTimeout(() => router.push("/explore"), 1500);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/callback` },
    });
    setGoogleLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--mist)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage-deep)" strokeWidth="1.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display text-lg font-light text-[var(--ink)] mb-1">You&apos;re in!</p>
        <p className="text-sm text-[var(--ink-faint)]">Taking you to the map…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <h1 className="font-display text-[26px] font-light tracking-[-0.025em] text-[var(--ink)] mb-1.5">
        Create account
      </h1>
      <p className="text-sm text-[var(--ink-faint)] mb-7 leading-relaxed">
        Join the community helping parents explore Toronto.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
        {/* Name */}
        <div>
          <InputLabel htmlFor="display_name">Your name</InputLabel>
          <Input
            id="display_name"
            type="text"
            autoComplete="name"
            placeholder="Sarah"
            error={!!errors.display_name}
            {...register("display_name")}
          />
          {errors.display_name && <InputHint error>{errors.display_name.message}</InputHint>}
        </div>

        {/* Email */}
        <div>
          <InputLabel htmlFor="email" required>Email</InputLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hello@example.com"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && <InputHint error>{errors.email.message}</InputHint>}
        </div>

        {/* Password */}
        <div>
          <InputLabel htmlFor="password" required>Password</InputLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ characters"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && <InputHint error>{errors.password.message}</InputHint>}
        </div>

        {/* Auth error */}
        {authError && (
          <p className="text-sm text-[var(--error)] bg-[var(--error-light)] px-4 py-3 rounded-[var(--r-md)]">
            {authError}
          </p>
        )}

        {/* CTA */}
        <Button
          type="submit"
          variant="sage"
          size="default"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      {/* "or" divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(122,158,126,.15)" }} />
        <span className="text-xs text-[var(--ink-faint)]">or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(122,158,126,.15)" }} />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-[var(--r-pill)] text-sm text-[var(--ink-soft)] bg-[var(--warm-white)] transition-colors hover:bg-[var(--mist)] disabled:opacity-50"
        style={{ border: "1.5px solid rgba(26,31,27,.12)" }}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Footer */}
      <p className="text-[13px] text-[var(--ink-faint)] text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--sage-deep)] underline hover:text-[var(--sage)]">
          Log in
        </Link>
      </p>
    </div>
  );
}
