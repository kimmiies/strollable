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
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.display_name },
      },
    });
    if (authError) {
      setError(authError.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/explore"), 1500);
  }

  if (success) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-2xl">
        <p className="text-green-700 font-medium">You&apos;re in!</p>
        <p className="text-sm text-green-600 mt-1">Taking you to the map…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Your name
        </label>
        <input
          {...register("display_name")}
          type="text"
          autoComplete="name"
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white text-[var(--foreground)] text-sm",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
            errors.display_name ? "border-red-400" : "border-[var(--border)]"
          )}
          placeholder="Maya"
        />
        {errors.display_name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.display_name.message}
          </p>
        )}
      </div>

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
          autoComplete="new-password"
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
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
