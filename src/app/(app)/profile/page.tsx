"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import BadgeCard from "@/components/profile/BadgeCard";
import { useUser } from "@/hooks/useUser";
import { BADGE_DEFINITIONS } from "@/types";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { profile, loading } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    if (isDemoMode) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[var(--background)]">
        <TopBar title="Profile" />
        <div className="px-4 pt-6 space-y-4">
          <div className="h-20 bg-white rounded-2xl border border-[var(--border)] animate-pulse" />
          <div className="h-40 bg-white rounded-2xl border border-[var(--border)] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-full bg-[var(--background)]">
        <TopBar title="Profile" />
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
          <p className="text-4xl">👤</p>
          <h2 className="font-semibold text-[var(--foreground)]">
            Sign in to see your profile
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-2xl bg-[var(--primary)] text-white font-medium text-sm"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const flags = profile.badge_flags;
  const counts = profile.contribution_counts;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <TopBar title="Profile" />
      <div className="flex-1 overflow-y-auto pb-nav">
        {/* User info */}
        <div className="bg-white border-b border-[var(--border)] px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[var(--primary)]">
                {profile.display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-lg text-[var(--foreground)] truncate">
                {profile.display_name}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] truncate">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="text-center flex-1">
              <p className="font-bold text-xl text-[var(--foreground)]">
                {counts.reports}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Reports</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-bold text-xl text-[var(--foreground)]">
                {counts.verifications}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Verified</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-bold text-xl text-[var(--foreground)]">
                {counts.scouts}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Scouted</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-4 py-5">
          <h3 className="font-semibold text-base text-[var(--foreground)] mb-4">
            Badges
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {BADGE_DEFINITIONS.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={flags[badge.id] ?? false}
              />
            ))}
          </div>
        </div>

        {/* Sign out */}
        {!isDemoMode && (
          <div className="px-4 pb-6">
            <button
              onClick={handleSignOut}
              className={cn(
                "w-full py-3 rounded-2xl text-sm font-medium",
                "border border-[var(--border)] text-[var(--muted-foreground)]",
                "hover:bg-[var(--muted)] transition-colors"
              )}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
