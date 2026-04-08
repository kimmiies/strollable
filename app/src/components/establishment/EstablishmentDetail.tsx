"use client";

import Link from "next/link";
import {
  Heart, Phone, Globe, Star, Clock,
  Footprints, LockOpen, Baby, Armchair,
  DoorOpen, Navigation, Sofa, User, Users,
  type LucideIcon,
} from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import {
  cn,
  formatRating,
  formatHours,
  getEstablishmentTypeLabel,
  getFeatureChipStyle,
} from "@/lib/utils";
import { FEATURE_LABELS } from "@/types";
import { useSaved } from "@/hooks/useSaved";

// All 9 features — flat list, no hierarchy
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

const STATUS_SUBLABELS: Record<string, string> = {
  unknown:   "No one has checked this yet",
  reported:  "Reported · needs one more to confirm",
  disputed:  "Community disagrees — help resolve it",
};

interface EstablishmentDetailProps {
  establishment: Establishment;
}

export default function EstablishmentDetail({
  establishment,
}: EstablishmentDetailProps) {
  const { savedIds, toggle } = useSaved();
  const isSaved = savedIds.has(establishment.place_id);
  const { isOpen, todayHours } = formatHours(establishment.hours);

  return (
    <div className="pb-nav">
      {/* Header */}
      <div
        className="border-b border-[var(--border)] px-4 py-5"
        style={{ background: "var(--warm-white)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-normal text-[22px] tracking-[-0.025em] leading-tight text-[var(--ink)]">
              {establishment.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-sm text-[var(--ink-faint)]">
                {getEstablishmentTypeLabel(establishment.type)}
              </span>
              {establishment.google_rating && (
                <span className="flex items-center gap-0.5 text-sm text-[var(--amber)]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {formatRating(establishment.google_rating)}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--ink-faint)] mt-1">
              {establishment.address}
            </p>
          </div>
          <button
            onClick={() => toggle(establishment.place_id)}
            className="p-2 rounded-full hover:bg-[var(--mist)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
            aria-label={isSaved ? "Remove from saved" : "Save"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isSaved
                  ? "fill-[var(--terracotta)] text-[var(--terracotta)]"
                  : "text-[var(--ink-faint)]"
              )}
            />
          </button>
        </div>

        {/* Hours / phone / website */}
        <div className="mt-3 space-y-1.5">
          {todayHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--ink-faint)] flex-shrink-0" />
              <span
                className={cn(
                  "font-medium",
                  isOpen === true
                    ? "text-[var(--sage-deep)]"
                    : isOpen === false
                    ? "text-[var(--terracotta)]"
                    : "text-[var(--ink)]"
                )}
              >
                {isOpen === true ? "Open" : isOpen === false ? "Closed" : ""}
              </span>
              <span className="text-[var(--ink-faint)]">{todayHours}</span>
            </div>
          )}
          {establishment.phone && (
            <a
              href={`tel:${establishment.phone}`}
              className="flex items-center gap-2 text-sm text-[var(--sage-deep)] hover:underline"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              {establishment.phone}
            </a>
          )}
          {establishment.website && (
            <a
              href={establishment.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--sage-deep)] hover:underline"
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              Website
            </a>
          )}
        </div>
      </div>

      {/* Features — all 9, flat list */}
      <div className="px-4 py-5">
        <h2 className="font-display font-normal text-lg tracking-[-0.02em] text-[var(--ink)] mb-4">
          Features
        </h2>
        <div className="space-y-2">
          {FEATURE_TYPES.map((type) => {
            const feature = establishment.features[type];
            const status = feature?.status ?? "unknown";
            const value  = feature?.value  ?? null;
            const { bg, text } = getFeatureChipStyle(status, value);
            const Icon = FEATURE_ICON_MAP[type];

            const statusLabel =
              status === "confirmed"
                ? `Confirmed ${value} · ${feature.report_count} parent${feature.report_count !== 1 ? "s" : ""}`
                : STATUS_SUBLABELS[status] ?? "";

            const chipLabel =
              status === "confirmed"
                ? value === "yes" ? "Yes" : "No"
                : status === "reported"  ? "Reported"
                : status === "disputed"  ? "Disputed"
                : "Unknown";

            return (
              <div
                key={type}
                className="flex items-center justify-between p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--warm-white)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[var(--r-sm)] bg-[var(--mist)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--ink-soft)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">
                      {FEATURE_LABELS[type]}
                    </p>
                    {statusLabel && (
                      <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                        {statusLabel}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0",
                    bg,
                    text
                  )}
                >
                  {chipLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contribute CTA */}
      <div className="px-4 pb-6">
        <Link
          href={`/contribute/${establishment.place_id}`}
          className={cn(
            "block w-full py-3.5 rounded-[var(--r-lg)] text-center font-medium text-sm",
            "bg-[var(--sage)] text-white",
            "hover:bg-[var(--sage-deep)] transition-colors"
          )}
        >
          Add or update features
        </Link>
        <p className="text-xs text-center text-[var(--ink-faint)] mt-2">
          Verified by parents, for parents.
        </p>
      </div>
    </div>
  );
}
