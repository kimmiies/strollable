"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Establishment } from "@/types";
import {
  cn,
  formatDistance,
  formatRating,
  getEstablishmentTypeLabel,
  getTypePlaceholder,
  isBabyFriendly,
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
  const babyFriendly = isBabyFriendly(establishment.features);

  return (
    <div
      className={cn(
        "bg-[var(--warm-white)] rounded-[var(--r-lg)] overflow-hidden cursor-pointer",
        "border transition-all duration-250",
        isSelected
          ? "border-[var(--sage)] shadow-[var(--shadow-float)] ring-1 ring-[var(--sage)]"
          : "border-[rgba(122,158,126,0.14)] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
      )}
      style={{ transition: "transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s cubic-bezier(.16,1,.3,1), border-color 0.25s" }}
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: gradient }}>
        <span className="text-5xl opacity-60">{emoji}</span>

        {/* Save button — top right */}
        <button
          onClick={(e) => { e.stopPropagation(); onSaveToggle(establishment.place_id); }}
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
              isSaved ? "fill-[var(--terracotta)] text-[var(--terracotta)]" : "text-[var(--ink-soft)]"
            )}
          />
        </button>

        {/* Baby-friendly badge — bottom left of photo */}
        {babyFriendly && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/92 backdrop-blur-sm rounded-[var(--r-pill)] px-3 py-1 shadow-[var(--shadow-sm)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)] flex-shrink-0" />
            <span className="text-[11px] font-medium text-[var(--sage-deep)]">Baby Friendly</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 pt-3.5 pb-4 space-y-2">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/place/${establishment.place_id}`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className="font-display font-normal text-[17px] leading-snug tracking-[-0.02em] text-[var(--ink)] hover:text-[var(--sage-deep)] transition-colors line-clamp-2"
          >
            {establishment.name}
          </Link>
          {establishment.google_rating && (
            <span className="flex items-center gap-0.5 text-sm font-medium text-[var(--amber)] flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              {formatRating(establishment.google_rating)}
            </span>
          )}
        </div>

        {/* Type + distance */}
        <p className="text-xs text-[var(--ink-faint)] tracking-[0.02em]">
          {getEstablishmentTypeLabel(establishment.type)}
          {establishment.distance_meters !== undefined && (
            <> · {formatDistance(establishment.distance_meters)}</>
          )}
        </p>

        {/* Feature chips */}
        <FeatureChipRow features={establishment.features} />

        {/* Footer */}
        <div className="bg-[var(--mist)] rounded-[var(--r-md)] px-3.5 py-2.5 flex items-center justify-between mt-1">
          <span className="text-[11px] text-[var(--ink-soft)]">
            {Object.values(establishment.features).filter(f => f.status !== "unknown").length > 0
              ? <><span className="font-medium text-[var(--sage-deep)]">{Object.values(establishment.features).filter(f => f.status !== "unknown").length}</span> feature{Object.values(establishment.features).filter(f => f.status !== "unknown").length !== 1 ? "s" : ""} reported</>
              : <span className="text-[var(--ink-faint)]">Be the first to contribute</span>
            }
          </span>
          {establishment.distance_meters !== undefined && (
            <span className="text-[11px] text-[var(--ink-faint)]">
              📍 {formatDistance(establishment.distance_meters)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
