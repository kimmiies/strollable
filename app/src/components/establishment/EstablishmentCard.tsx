"use client";

import Link from "next/link";
import { Heart, Star, Plus, ArrowRight } from "lucide-react";
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
}

export default function EstablishmentCard({
  establishment,
  isSaved,
  onSaveToggle,
  onClick,
  isSelected = false,
}: EstablishmentCardProps) {
  const { gradient, emoji } = getTypePlaceholder(establishment.type);
  const neighbourhood = getNeighbourhoodFromAddress(establishment.address);

  const metaParts = [
    getEstablishmentTypeLabel(establishment.type),
    neighbourhood || null,
    establishment.distance_meters !== undefined
      ? formatDistance(establishment.distance_meters)
      : null,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "bg-[var(--warm-white)] rounded-[var(--r-lg)] overflow-hidden cursor-pointer",
        "border transition-all flex flex-col",
        isSelected
          ? "border-[var(--sage)] shadow-[var(--shadow-float)] ring-1 ring-[var(--sage)]"
          : "border-[rgba(122,158,126,0.14)] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
      )}
      style={{
        transition:
          "transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s cubic-bezier(.16,1,.3,1), border-color 0.25s",
      }}
      onClick={onClick}
    >
      {/* Photo */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      >
        <span className="text-5xl opacity-60">{emoji}</span>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(establishment.place_id);
          }}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm shadow-[var(--shadow-sm)]",
            "transition-transform hover:scale-110"
          )}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isSaved
                ? "fill-[var(--terracotta)] text-[var(--terracotta)]"
                : "text-[var(--ink-soft)]"
            )}
          />
        </button>
      </div>

      {/* Card body */}
      <div className="px-4 pt-3.5 pb-3 space-y-2.5 flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <span className="font-display font-normal text-[17px] leading-snug tracking-[-0.02em] text-[var(--ink)] line-clamp-2">
            {establishment.name}
          </span>
          {establishment.google_rating && (
            <span className="flex items-center gap-0.5 text-sm font-medium text-[var(--amber)] flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              {formatRating(establishment.google_rating)}
            </span>
          )}
        </div>

        {/* Type · neighbourhood · distance */}
        <p className="text-xs text-[var(--ink-faint)] tracking-[0.02em]">
          {metaParts.join(" · ")}
        </p>

        {/* Top 3 feature chips — prioritised by data richness */}
        <FeatureChipRow features={establishment.features} compact />
      </div>

      {/* CTAs — stop propagation so card onClick doesn't also fire */}
      <div
        className="px-4 pb-4 pt-1 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Add info — secondary */}
        <Link
          href={`/contribute/${establishment.place_id}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5",
            "py-2.5 rounded-[var(--r-pill)] text-[13px] font-medium",
            "border border-[rgba(122,158,126,0.3)] text-[var(--sage-deep)]",
            "hover:bg-[var(--mist)] transition-colors"
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          Add info
        </Link>

        {/* View details — primary */}
        <Link
          href={`/place/${establishment.place_id}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5",
            "py-2.5 rounded-[var(--r-pill)] text-[13px] font-medium",
            "bg-[var(--sage)] text-white",
            "hover:bg-[var(--sage-deep)] transition-colors"
          )}
        >
          View details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
