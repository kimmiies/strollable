"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, Phone, Globe, Star,
  Footprints, LockOpen, Baby, Armchair,
  DoorOpen, Navigation, Sofa, User, Users,
  type LucideIcon,
} from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import { cn, formatRating, getFeatureChipStyle } from "@/lib/utils";
import { FEATURE_LABELS } from "@/types";
import { useSaved } from "@/hooks/useSaved";

const FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
  "high_chairs",
  "auto_door_opener",
  "stroller_friendly_layout",
  "booster_seats",
  "change_table_mens",
  "change_table_family",
];

const FEATURE_ICON_MAP: Record<FeatureType, LucideIcon> = {
  step_free_entrance:       Footprints,
  accessible_bathroom:      LockOpen,
  change_table:             Baby,
  high_chairs:              Armchair,
  auto_door_opener:         DoorOpen,
  stroller_friendly_layout: Navigation,
  booster_seats:            Sofa,
  change_table_mens:        User,
  change_table_family:      Users,
};

const ICON_BG: Record<string, string> = {
  confirmed: "var(--mist)",
  reported:  "var(--amber-light)",
  disputed:  "var(--terra-light)",
  unknown:   "rgba(26,31,27,0.05)",
};

const ICON_COLOR: Record<string, string> = {
  confirmed: "var(--sage-deep)",
  reported:  "var(--amber)",
  disputed:  "var(--terracotta)",
  unknown:   "var(--ink-faint)",
};

const STATUS_SUBLABELS: Record<string, string> = {
  unknown:  "No one has checked this yet",
  reported: "1 report · needs 1 more to confirm",
  disputed: "Community disagrees — help resolve it",
};

const MOCK_AVATARS = [
  { initial: "S", bg: "linear-gradient(135deg, var(--sage-light), var(--sage))" },
  { initial: "R", bg: "linear-gradient(135deg, #e8b898, var(--terracotta))" },
  { initial: "J", bg: "linear-gradient(135deg, #d6eaf2, var(--sky))" },
  { initial: "P", bg: "linear-gradient(135deg, #fdf3d4, var(--amber))" },
];

const MOCK_REVIEWS = [
  {
    initial: "S",
    avatarBg: "linear-gradient(135deg, var(--sage-light), var(--sage))",
    name: "Sarah M.",
    badge: "Founding Reporter",
    badgeColor: "var(--sage-deep)",
    badgeBg: "var(--mist)",
    date: "2 days ago",
    text: "Ramp at the front entrance — totally flat all the way in. Staff were so lovely with the stroller, helped move a chair to make room near the window. Great spot for a weekday morning.",
  },
  {
    initial: "R",
    avatarBg: "linear-gradient(135deg, #e8b898, var(--terracotta))",
    name: "Raquel T.",
    badge: "Verifier",
    badgeColor: "var(--amber)",
    badgeBg: "var(--amber-light)",
    date: "1 week ago",
    text: "Wide enough for a Bugaboo Fox. Change table is in the accessible washroom at the back — you have to ask for the key but staff are quick about it.",
  },
  {
    initial: "J",
    avatarBg: "linear-gradient(135deg, #d6eaf2, var(--sky))",
    name: "James K.",
    badge: "Reporter",
    badgeColor: "var(--ink-soft)",
    badgeBg: "rgba(26,31,27,0.06)",
    date: "3 weeks ago",
    text: "Quick coffee stop with the stroller — no issues getting in. Busy on weekends but manageable even with the big travel system.",
  },
];

const frostedBtnClass =
  "rounded-full flex items-center justify-center transition-all active:scale-90";
const frostedBtnStyle = {
  width: 40,
  height: 40,
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
} as const;

interface EstablishmentDetailProps {
  establishment: Establishment;
}

export default function EstablishmentDetail({ establishment }: EstablishmentDetailProps) {
  const router = useRouter();
  const { savedIds, toggle } = useSaved();
  const isSaved = savedIds.has(establishment.place_id);

  const confirmedCount = FEATURE_TYPES.filter(
    (t) => establishment.features[t]?.status === "confirmed"
  ).length;

  return (
    <div>

      {/* MOBILE: full-bleed hero + floating nav */}
      <div className="lg:hidden">
        <div className="relative" style={{ height: 340 }}>
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(160deg,#c8b89a 0%,#a08060 40%,#6b5040 100%)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(26,31,27,0.55) 0%, transparent 52%)" }} />
          <div className="absolute bottom-4 right-4 text-xs text-white px-2.5 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", letterSpacing: "0.04em" }}>
            1 / 4
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
            <div style={{ width: 18, height: 5, borderRadius: 3, background: "white" }} />
            {[0, 0, 0].map((_, i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
          <button onClick={() => router.back()} className={frostedBtnClass}
            style={{ ...frostedBtnStyle, position: "absolute", top: "max(16px, env(safe-area-inset-top, 16px))", left: 16 }}
            aria-label="Go back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={() => toggle(establishment.place_id)} className={frostedBtnClass}
            style={{ ...frostedBtnStyle, position: "absolute", top: "max(16px, env(safe-area-inset-top, 16px))", right: 16 }}
            aria-label={isSaved ? "Remove from saved" : "Save"}>
            <Heart className={cn("transition-colors", isSaved ? "fill-[var(--terracotta)] text-[var(--terracotta)]" : "text-[var(--ink)]")}
              style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:max-w-[1180px] lg:mx-auto lg:px-10 lg:pt-8 lg:pb-16 lg:items-start">

        {/* LEFT COLUMN */}
        <div>

          {/* Establishment info */}
          <div className="px-4 py-5 lg:px-0 lg:py-0 lg:pb-6 lg:border-b" style={{ borderColor: "rgba(122,158,126,0.12)" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {/* Name */}
                <h1
                  className="font-display font-normal leading-tight tracking-[-0.025em] lg:text-[32px]"
                  style={{ fontSize: 26, color: "var(--ink)" }}
                >
                  {establishment.name}
                </h1>

                {/* Rating */}
                {establishment.google_rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-current flex-shrink-0" style={{ color: "var(--amber)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--amber)" }}>
                      {formatRating(establishment.google_rating)}
                    </span>
                    <span className="text-sm" style={{ color: "var(--ink-faint)" }}>
                      · 48 reviews
                    </span>
                  </div>
                )}
              </div>

              {/* Save — desktop only */}
              <button
                onClick={() => toggle(establishment.place_id)}
                className="hidden lg:flex p-2 rounded-full transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] items-center justify-center"
                style={{ background: "transparent", border: "1px solid rgba(26,31,27,0.1)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label={isSaved ? "Remove from saved" : "Save"}
              >
                <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-[var(--terracotta)] text-[var(--terracotta)]" : "text-[var(--ink-faint)]")} />
              </button>
            </div>

            {/* Address / phone / website rows */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--ink-faint)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{establishment.address}</span>
              </div>
              {establishment.phone && (
                <a href={`tel:${establishment.phone}`} className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--ink-soft)", textDecoration: "none" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ink-faint)" }} />
                  {establishment.phone}
                </a>
              )}
              {establishment.website && (
                <a href={establishment.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--sage-deep)", textDecoration: "none" }}>
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ink-faint)" }} />
                  {establishment.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          <div className="lg:hidden h-px mx-4" style={{ background: "rgba(122,158,126,0.12)" }} />

          {/* Community summary */}
          <div className="px-4 py-5 lg:px-0 lg:py-7 lg:border-b flex flex-col gap-2.5" style={{ borderColor: "rgba(122,158,126,0.12)" }}>
            <p className="text-[13px] uppercase tracking-[0.08em] font-medium" style={{ color: "var(--ink-soft)" }}>Community summary</p>
            <div className="rounded-[var(--r-lg)] overflow-hidden" style={{ background: "var(--warm-white)", border: "1px solid rgba(122,158,126,0.12)" }}>
              <div className="px-4 py-3.5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(122,158,126,0.08)" }}>
                <div className="flex flex-col items-center">
                  <span className="font-display font-normal text-xl leading-none" style={{ color: "var(--ink)" }}>{confirmedCount}</span>
                  <span className="text-[10px] uppercase tracking-[0.06em] mt-0.5" style={{ color: "var(--ink-faint)" }}>Confirmed</span>
                </div>
                <div className="w-px h-7 mx-1" style={{ background: "rgba(122,158,126,0.15)" }} />
                <div className="flex">
                  {MOCK_AVATARS.map((av, i) => (
                    <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] text-white flex-shrink-0"
                      style={{ background: av.bg, border: "2px solid var(--cream)", marginLeft: i === 0 ? 0 : -8 }}>
                      {av.initial}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 py-2.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-faint)" }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Last verified 2 weeks ago
              </div>
            </div>
            <div className="rounded-[var(--r-lg)] p-4 flex gap-3 items-start" style={{ background: "var(--warm-white)", border: "1px solid rgba(122,158,126,0.12)" }}>
              <div className="w-8 h-8 rounded-[var(--r-sm)] flex items-center justify-center flex-shrink-0" style={{ background: "var(--mist)" }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="var(--sage-deep)" strokeWidth="1.5">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M20 12a8 8 0 1 1-8-8v8h8z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: "var(--sage)" }}>AI summary</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Parents consistently mention the side ramp entrance and the wide accessible washroom.
                  Staff are noted as stroller-friendly. The change table is in the accessible WC at the back.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:hidden h-px mx-4" style={{ background: "rgba(122,158,126,0.12)" }} />

          {/* Strollability features */}
          <div className="px-4 py-5 lg:px-0 lg:py-7">
            <p className="text-[13px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--ink-soft)" }}>Strollability features</p>
            <div className="space-y-1.5">
              {FEATURE_TYPES.map((type) => {
                const feature = establishment.features[type];
                const status  = feature?.status ?? "unknown";
                const value   = feature?.value  ?? null;
                const { bg, text } = getFeatureChipStyle(status, value);
                const Icon = FEATURE_ICON_MAP[type];
                const sublabel = status === "confirmed"
                  ? `Confirmed by ${feature.report_count} parent${feature.report_count !== 1 ? "s" : ""}`
                  : STATUS_SUBLABELS[status] ?? "";
                const chipLabel =
                  status === "confirmed" ? (value === "yes" ? "Yes" : "No")
                  : status === "reported" ? "Reported"
                  : status === "disputed" ? "Disputed"
                  : "Unknown";
                return (
                  <div key={type} className="flex items-center justify-between px-3.5 py-3 rounded-[var(--r-md)] gap-2.5"
                    style={{ background: "var(--warm-white)", border: "1px solid rgba(122,158,126,0.1)" }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-[var(--r-sm)] flex items-center justify-center flex-shrink-0" style={{ background: ICON_BG[status] }}>
                        <Icon className="w-4 h-4" style={{ color: ICON_COLOR[status] }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{FEATURE_LABELS[type]}</p>
                        {sublabel && <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-faint)" }}>{sublabel}</p>}
                      </div>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 flex items-center gap-1", bg, text)}>
                      {status === "confirmed" && <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      {status === "reported"  && <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
                      {chipLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden h-px mx-4" style={{ background: "rgba(122,158,126,0.12)" }} />

          {/* Community notes */}
          <div className="px-4 py-5 lg:px-0 lg:py-7 lg:border-t" style={{ borderColor: "rgba(122,158,126,0.12)" }}>
            <p className="text-[13px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--ink-soft)" }}>
              Community notes
            </p>
            <div className="space-y-3">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.name} className="rounded-[var(--r-md)] p-4"
                  style={{ background: "var(--warm-white)", border: "1px solid rgba(122,158,126,0.1)" }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm text-white flex-shrink-0"
                      style={{ background: review.avatarBg }}>
                      {review.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{review.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: review.badgeBg, color: review.badgeColor }}>
                          {review.badge}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>{review.date}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden h-24" />

        </div>{/* /left column */}

        {/* RIGHT COLUMN: sticky aside (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-[88px] rounded-[var(--r-xl)] overflow-hidden"
            style={{ background: "var(--warm-white)", border: "1px solid rgba(122,158,126,0.15)", boxShadow: "var(--shadow-float)" }}>
            <div className="p-6 border-b" style={{ borderColor: "rgba(122,158,126,0.1)" }}>
              <p className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: "var(--sage)" }}>Contribute</p>
              <p className="font-display font-normal text-[18px] tracking-[-0.02em] mb-1" style={{ color: "var(--ink)" }}>Know this place?</p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--ink-faint)" }}>
                Help other parents by reporting what you&apos;ve noticed — stroller access, change table, and more.
              </p>
              <Link href={`/contribute/${establishment.place_id}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[var(--r-pill)] text-sm font-medium text-white mb-2.5 transition-colors"
                style={{ background: "var(--ink)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-soft)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink)")}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add info about this place
              </Link>
              <button className="flex items-center justify-center gap-1.5 w-full py-3 rounded-[var(--r-pill)] text-sm font-medium transition-colors"
                style={{ background: "transparent", border: "1.5px solid rgba(26,31,27,0.12)", color: "var(--ink-soft)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                View on map
              </button>
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: "var(--sage)" }}>Verified by the community</p>
              <div className="flex items-center gap-3 mb-3.5">
                <div className="flex">
                  {MOCK_AVATARS.map((av, i) => (
                    <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] text-white flex-shrink-0"
                      style={{ background: av.bg, border: "2px solid var(--warm-white)", marginLeft: i === 0 ? 0 : -8 }}>
                      {av.initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-snug" style={{ color: "var(--ink-soft)" }}>4 parents have contributed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--sage-deep)" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span><strong className="font-medium">{confirmedCount} of 9</strong> features answered</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Last verified <strong className="font-medium">2 weeks ago</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /grid */}

      {/* MOBILE sticky footer CTAs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex gap-2.5 px-4 py-3 border-t"
        style={{
          background: "rgba(250,247,242,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(122,158,126,0.15)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[var(--r-pill)] text-sm transition-colors"
          style={{ background: "transparent", border: "1.5px solid rgba(26,31,27,0.14)", color: "var(--ink-soft)" }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          View on map
        </button>
        <Link href={`/contribute/${establishment.place_id}`}
          className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-[var(--r-pill)] text-sm font-medium text-white"
          style={{ background: "var(--ink)" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add info about this place
        </Link>
      </div>

    </div>
  );
}
