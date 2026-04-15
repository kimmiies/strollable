"use client";

import { useRouter } from "next/navigation";
import { Check, Heart, Map as MapIcon, Award, Star } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { BADGE_DEFINITIONS, type BadgeType } from "@/types";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<BadgeType, typeof Star> = {
  founding_reporter: Star,
};

const BADGE_RINGS: Record<BadgeType, string> = {
  founding_reporter: "bg-[var(--sky-light)] text-[var(--sky)]",
};

type ActivityItem = {
  Icon: typeof Check;
  text: React.ReactNode;
  time: string;
};

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    Icon: Check,
    text: (
      <>
        Confirmed <strong className="font-medium text-[var(--ink)]">step-free entry</strong> at Broadview Espresso
      </>
    ),
    time: "2d",
  },
  {
    Icon: Heart,
    text: (
      <>
        Saved <strong className="font-medium text-[var(--ink)]">Sunday Brunch Co.</strong>
      </>
    ),
    time: "4d",
  },
  {
    Icon: MapIcon,
    text: (
      <>
        Scouted <strong className="font-medium text-[var(--ink)]">Parkette Café</strong> — not yet in app
      </>
    ),
    time: "1w",
  },
];

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
      <div className="flex flex-col h-full bg-[var(--cream)]">
        <div className="max-w-[1180px] mx-auto w-full px-4 lg:px-10 pt-6 space-y-4">
          <div className="h-20 rounded-[var(--r-lg)] bg-[var(--warm-white)] animate-pulse" />
          <div className="h-80 rounded-[var(--r-lg)] bg-[var(--warm-white)] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-full bg-[var(--cream)]">
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
          <h2 className="font-display text-2xl tracking-[-0.02em] text-[var(--ink)]">
            Sign in to see your profile
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="px-6 h-11 rounded-[var(--r-pill)] bg-[var(--sage-deep)] text-white text-sm font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const flags = profile.badge_flags;
  const contributions = 0;
  const badgesEarned = BADGE_DEFINITIONS.filter((b) => flags[b.id]).length;

  return (
    <div className="flex flex-col h-full bg-[var(--cream)]">
      <div className="flex-1 overflow-y-auto pb-nav">
        <div className="max-w-[1180px] mx-auto w-full px-4 lg:px-10 pt-6 pb-10">
          {/* Title */}
          <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] font-light tracking-[-0.025em] text-[var(--ink)] mb-8">
            Your <em className="italic">impact</em>
          </h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            {/* ── LEFT: dark ink sidebar card ───────────────────────── */}
            <aside className="rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-card)] bg-[var(--cream)]">
              {/* Header — dark ink with sage radial glow */}
              <div
                className="relative px-6 pt-8 pb-6 overflow-hidden"
                style={{ background: "var(--ink)" }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(122,158,126,.22) 0%, transparent 70%)",
                    top: -100,
                    right: -60,
                  }}
                />
                <div className="relative">
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-3 border-[3px] border-white/15 font-display text-[28px] font-light text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--sage-light), var(--sage))",
                    }}
                  >
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-display text-[22px] font-light text-white tracking-[-0.02em] leading-tight">
                    {profile.display_name}
                  </div>
                  <div className="text-[13px] text-white/40 mt-0.5">
                    @{profile.display_name.toLowerCase().replace(/\s+/g, "")} · joined March 2024
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-5 pt-5 border-t border-white/10">
                    <div>
                      <div className="font-display text-[22px] font-light text-white leading-none">
                        {contributions}
                      </div>
                      <div className="text-[11px] tracking-[0.05em] text-white/40 mt-1">
                        Contributions
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-[22px] font-light text-white leading-none">
                        {badgesEarned}
                      </div>
                      <div className="text-[11px] tracking-[0.05em] text-white/40 mt-1">
                        Badges
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="px-5 pt-5 pb-6 bg-[var(--warm-white)]">
                <div className="text-[11px] tracking-[0.08em] text-[var(--ink-faint)] uppercase mb-3">
                  Badges
                </div>
                <div className="flex gap-3 flex-wrap">
                  {BADGE_DEFINITIONS.map((badge) => {
                    const earned = flags[badge.id] ?? false;
                    const Icon = BADGE_ICONS[badge.id] ?? Award;
                    return (
                      <div
                        key={badge.id}
                        className={cn(
                          "flex flex-col items-center gap-1.5 w-[64px]",
                          !earned && "opacity-35"
                        )}
                      >
                        <div
                          className={cn(
                            "w-[52px] h-[52px] rounded-full flex items-center justify-center",
                            BADGE_RINGS[badge.id]
                          )}
                        >
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div className="text-[10px] tracking-[0.04em] text-[var(--ink-faint)] text-center leading-tight">
                          {badge.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ── RIGHT: activity feed ───────────────────────────────── */}
            <section className="rounded-[var(--r-lg)] bg-[var(--warm-white)] shadow-[var(--shadow-card)] px-6 py-6">
              <div className="text-[11px] tracking-[0.08em] text-[var(--ink-faint)] uppercase mb-2">
                Recent activity
              </div>
              <div>
                {DEMO_ACTIVITY.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 border-b border-[rgba(122,158,126,0.08)] last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-[var(--r-sm)] bg-[var(--mist)] flex items-center justify-center flex-shrink-0 text-[var(--sage-deep)]">
                      <item.Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                    <div className="text-[13px] text-[var(--ink-soft)] flex-1 leading-snug">
                      {item.text}
                    </div>
                    <div className="text-[11px] text-[var(--ink-faint)]">{item.time}</div>
                  </div>
                ))}
              </div>

              {!isDemoMode && (
                <div className="pt-6 mt-4 border-t border-[rgba(122,158,126,0.12)]">
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-[var(--ink-faint)] hover:text-[var(--ink-soft)] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
