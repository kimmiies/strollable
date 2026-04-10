"use client";

import Link from "next/link";
import { Heart, Star, X } from "lucide-react";
import type { Establishment } from "@/types";
import {
  cn,
  formatDistance,
  formatRating,
  getEstablishmentTypeLabel,
  getTypePlaceholder,
  getNeighbourhoodFromAddress,
} from "@/lib/utils";
import FeatureChipRow from "./FeatureChipRow";

interface EstablishmentCardProps {
  establishment: Establishment;
  isSaved: boolean;
  onSaveToggle: (placeId: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  /** When provided, renders a dismiss (×) button in the top-left of the hero.
   *  Used when the card is overlaid on the map so it can be closed. */
  onDismiss?: () => void;
}

function getFooterState(establishment: Establishment): "confirmed" | "partial" | "empty" {
  const features = Object.values(establishment.features);
  const confirmedCount = features.filter(
    (f) => f?.status === "confirmed" && f?.value === "yes"
  ).length;
  const reportedCount = features.filter((f) => f?.status === "reported").length;
  if (confirmedCount >= 2) return "confirmed";
  if (confirmedCount >= 1 || reportedCount >= 1) return "partial";
  return "empty";
}

function getContributorCount(establishment: Establishment): number {
  return Object.values(establishment.features).reduce(
    (sum, f) => sum + (f?.report_count ?? 0),
    0
  );
}

export default function EstablishmentCard({
  establishment,
  isSaved,
  onSaveToggle,
  onClick,
  isSelected = false,
  onDismiss,
}: EstablishmentCardProps) {
  const { gradient, emoji } = getTypePlaceholder(establishment.type);
  const neighbourhood = getNeighbourhoodFromAddress(establishment.address);
  const footerState = getFooterState(establishment);
  const contributorCount = getContributorCount(establishment);

  const metaParts = [
    getEstablishmentTypeLabel(establishment.type),
    neighbourhood || null,
    establishment.distance_meters !== undefined
      ? formatDistance(establishment.distance_meters)
      : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/place/${establishment.place_id}`}
      className={cn(
        "bg-[var(--warm-white)] rounded-[var(--r-lg)] overflow-hidden block",
        "border transition-all flex flex-col",
        isSelected
          ? "border-[var(--sage)] shadow-[var(--shadow-float)] ring-1 ring-[var(--sage)]"
          : "border-[rgba(122,158,126,0.14)] shadow-[var(--shadow-card)] hover:-translate-y-[3px] hover:shadow-[var(--shadow-float)]"
      )}
      style={{
        transition:
          "transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s cubic-bezier(.16,1,.3,1), border-color 0.25s",
      }}
      onClick={onClick}
    >
      {/* Photo / gradient hero */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,31,27,0.35) 0%, transparent 60%)",
          }}
        />

        <span className="text-5xl opacity-60 relative z-[1]">{emoji}</span>

        {/* Dismiss button — top-left, only when onDismiss is provided */}
        {onDismiss && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute top-3 left-3 z-[2] w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-[var(--shadow-sm)] transition-transform hover:scale-110"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[var(--ink-soft)]" />
          </button>
        )}

        {/* Save button — top-right, always */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSaveToggle(establishment.place_id);
          }}
          className={cn(
            "absolute top-3 right-3 z-[2] w-9 h-9 rounded-full flex items-center justify-center",
            "backdrop-blur-sm shadow-[var(--shadow-sm)]",
            "transition-transform hover:scale-110",
            isSaved ? "bg-[var(--terracotta)]" : "bg-white/90"
          )}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isSaved ? "fill-white text-white" : "text-[var(--ink-soft)]"
            )}
          />
        </button>
      </div>

      {/* Card body */}
      <div className="px-[18px] pt-4 pb-3.5 space-y-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display font-normal text-[18px] leading-snug tracking-[-0.02em] text-[var(--ink)] line-clamp-2">
            {establishment.name}
          </span>
          {establishment.google_rating && (
            <span className="flex items-center gap-0.5 text-[13px] font-medium text-[var(--amber)] flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              {formatRating(establishment.google_rating)}
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--ink-faint)] tracking-[0.02em]">
          {metaParts.join(" · ")}
        </p>

        <FeatureChipRow features={establishment.features} compact />
      </div>

      {/* Footer — state-driven inset strip */}
      <div
        className="mx-[18px] mb-[18px] rounded-[var(--r-md)] px-3.5 py-2.5 flex items-center justify-between"
        style={{
          background: footerState === "partial" ? "var(--amber-light)" : "var(--mist)",
        }}
      >
        <span
          className="text-[11px]"
          style={{
            color:
              footerState === "partial"
                ? "var(--amber)"
                : footerState === "confirmed"
                ? "var(--sage-deep)"
                : "var(--ink-soft)",
            fontWeight: footerState === "partial" ? 500 : 400,
          }}
        >
          {footerState === "confirmed" &&
            (contributorCount > 0
              ? `Reported by ${contributorCount} parent${contributorCount !== 1 ? "s" : ""}`
              : "Community verified")}
          {footerState === "partial" && "Help fill this in"}
          {footerState === "empty" && "Be the first to report"}
        </span>

        {establishment.distance_meters !== undefined && (
          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ink-faint)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {formatDistance(establishment.distance_meters)}
          </span>
        )}
      </div>
    </Link>
  );
}
