"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/explore");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white text-[var(--foreground)] text-sm",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
            errors.email ? "border-red-400" : "border-[var(--border)]"
          )}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          autoComplete="current-password"
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white text-[var(--foreground)] text-sm",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
            errors.password ? "border-red-400" : "border-[var(--border)]"
          )}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 rounded-xl font-semibold text-sm text-white",
          "bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        No account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
