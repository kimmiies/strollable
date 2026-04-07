"use client";

import Link from "next/link";
import { Heart, Phone, Globe, Star, Clock } from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import {
  cn,
  formatRating,
  formatHours,
  getEstablishmentTypeLabel,
  getFeatureChipStyle,
} from "@/lib/utils";
import { FEATURE_LABELS, FEATURE_ICONS } from "@/types";
import { useSaved } from "@/hooks/useSaved";

const FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
];

const STATUS_LABELS: Record<string, string> = {
  unknown: "No one has checked this yet",
  reported: "Reported by 1 parent",
  confirmed: "Confirmed by parents",
  disputed: "Community disagrees on this — help resolve it",
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
      <div className="bg-white border-b border-[var(--border)] px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              {establishment.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-sm text-[var(--muted-foreground)]">
                {getEstablishmentTypeLabel(establishment.type)}
              </span>
              {establishment.google_rating && (
                <span className="flex items-center gap-0.5 text-sm text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {formatRating(establishment.google_rating)}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {establishment.address}
            </p>
          </div>
          <button
            onClick={() => toggle(establishment.place_id)}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
            aria-label={isSaved ? "Remove from saved" : "Save"}
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isSaved ? "fill-red-500 text-red-500" : "text-[var(--muted-foreground)]"
              )}
            />
          </button>
        </div>

        {/* Hours / phone / website */}
        <div className="mt-3 space-y-1.5">
          {todayHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
              <span
                className={cn(
                  "font-medium",
                  isOpen === true
                    ? "text-green-700"
                    : isOpen === false
                    ? "text-red-600"
                    : "text-[var(--foreground)]"
                )}
              >
                {isOpen === true ? "Open" : isOpen === false ? "Closed" : ""}
              </span>
              <span className="text-[var(--muted-foreground)]">{todayHours}</span>
            </div>
          )}
          {establishment.phone && (
            <a
              href={`tel:${establishment.phone}`}
              className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
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
              className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              Website
            </a>
          )}
        </div>
      </div>

      {/* Baby-friendly features */}
      <div className="px-4 py-5">
        <h2 className="font-semibold text-base text-[var(--foreground)] mb-4">
          Baby-friendly features
        </h2>
        <div className="space-y-3">
          {FEATURE_TYPES.map((type) => {
            const feature = establishment.features[type];
            const { bg, text } = getFeatureChipStyle(
              feature?.status ?? "unknown",
              feature?.value ?? null
            );
            const statusText =
              feature?.status === "confirmed"
                ? `Confirmed ${feature.value} · ${feature.report_count} parent${feature.report_count !== 1 ? "s" : ""}`
                : feature?.status === "reported"
                ? `Reported by 1 parent`
                : STATUS_LABELS[feature?.status ?? "unknown"];

            return (
              <div
                key={type}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{FEATURE_ICONS[type]}</span>
                  <div>
                    <p className="font-medium text-sm text-[var(--foreground)]">
                      {FEATURE_LABELS[type]}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {statusText}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    bg,
                    text
                  )}
                >
                  {feature?.status === "confirmed"
                    ? feature.value === "yes"
                      ? "Yes ✓"
                      : "No ✗"
                    : feature?.status === "reported"
                    ? "Reported"
                    : feature?.status === "disputed"
                    ? "Disputed"
                    : "Unknown"}
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
            "block w-full py-3.5 rounded-2xl text-center font-semibold text-sm",
            "bg-[var(--primary)] text-white",
            "hover:bg-[var(--primary-hover)] transition-colors"
          )}
        >
          Add or update features
        </Link>
        <p className="text-xs text-center text-[var(--muted-foreground)] mt-2">
          Verified by parents, for parents.
        </p>
      </div>
    </div>
  );
}
